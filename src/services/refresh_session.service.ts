import { DataSource } from 'typeorm'
import { AuthStatus, IRefreshToken, IAuthResult, IAuthInfo, ROLES } from "../Interfaces";
import { RefreshSession, UserRole } from "../entities";
import { JwtAction } from "../actions/Jwt.action";
import { configApp } from "../../configApp";
import { Connection } from "../../config/Database";

export class RefreshSessionService {
    public dataConn: DataSource;
    
    constructor() {
        this.dataConn = Connection;
    }
    public async add(refreshSession: RefreshSession): Promise<string> {
        refreshSession = await this.dataConn.getRepository(RefreshSession).save(refreshSession);
        return refreshSession.refreshToken
    }

    public async remove(refreshSession: RefreshSession): Promise<boolean> {
        let answer: boolean = true;
        try {
            await this.dataConn.getRepository(RefreshSession).delete({refreshToken: refreshSession.refreshToken});
        }
        catch(error){
            answer = false;
        }
        return answer;
    }

    public async validate(refreshToken: IRefreshToken): Promise<IAuthResult> {
        let repo = this.dataConn.getRepository(RefreshSession);
        let tokenStatus: AuthStatus = JwtAction.validateToken(refreshToken.accessToken).status;
        if(tokenStatus != AuthStatus.FakeAccess) {
            let session: RefreshSession = await repo.findOne({where:{refreshToken:refreshToken.refreshToken}});
            if(session && refreshToken){
                if(session.expiresIn > new Date().getTime()){
                    session.expiresIn = new Date().getTime() + parseInt(configApp.REFRESH_TOKEN_EXPIRES);
                    repo.save(session);
                    let lastDateToken = (new Date().getTime() + parseInt(configApp.ACCESS_TOKEN_EXPIRES)).toString()
                    let authRoles = await this.dataConn.getRepository(UserRole).find({where:{auth_id: session.auth_id}});
                    let 
                        authInfo: IAuthInfo = {
                        authId: session.auth_id,
                        expiresIn: new Date(new Date().getTime() + parseInt(configApp.ACCESS_TOKEN_EXPIRES) * 1000).toISOString(),
                        roles: authRoles.map((userRole) => {
                            return {
                                id:userRole.role_id,
                                name: ROLES[userRole.role_id]
                            }
                        })
                    }
                    //authInfo.expiresIn = session.expiresIn
                    let accessToken = JwtAction.signToken( authInfo, {
                        expiresIn: configApp.ACCESS_TOKEN_EXPIRES
                    })
                    return {status: AuthStatus.OK, token: accessToken};
                    
                } else {
                    return {status: AuthStatus.ExpiredRefresh};
                }
            } else {
                return {status: AuthStatus.FakeRefresh};
            }
        } else {
            return {status: AuthStatus.FakeAccess};
        }
    }
}
