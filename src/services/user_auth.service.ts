
import {
    AuthStatus,
    IAuthRegister,
    IAuthLogin,
    IAuthResult,
    IAuthInfo,
    IRegResult,
    RegStatus,
    ROLES,
    IRole
} from "../Interfaces";
import {
    QueryRunner
} from "typeorm";
import {
    UserAuth,
    RefreshSession,
    UserRole,
} from "../entities";
import {
    JwtAction,
    RefreshSessionService,
} from ".";
import * as moment from "moment"
import {
    configApp
} from "../../configApp";
import { SPSService } from "./sps.service";
import { customAlphabet } from "nanoid";


export class UserAuthService  extends SPSService<UserAuth> {
    constructor() {
        super(UserAuth);
    }
    
    public async getDetails(scope: IAuthInfo, userId: number): Promise<UserAuth> {
        let user = await this.dataConn.getRepository(UserAuth).findOne({where:{id: userId}});
        delete user.passwordHash;
        delete user.passwordSalt;
        delete user.passwordFormat;
        delete user.resetPasswordToken;
        delete user.confirmToken;

        
        return user;
    }
    
    public async create(loginReg: IAuthRegister): Promise < IRegResult > {
        let alreadyExits = await this.dataConn.getRepository(UserAuth).findOne({where:{email: loginReg.email}})
        if(alreadyExits){
            return {
                status: RegStatus.Exists
            }
        }
        let userAuth = new UserAuth();
        let salt = JwtAction.cryptoRandomBytes(128);
        let sha256 = JwtAction.getHashBySalt(loginReg.password, salt, process.env.PASSWORD_FORMAT)
        const nanoidLong = customAlphabet(configApp.NANOID_CHARS, configApp.NANOID_LENGTH);
        let roundomNumer =  await nanoidLong();
        const nanoidShort = customAlphabet("0123456789",6);
        let passcode =  await nanoidShort();
        userAuth.email = loginReg.email;
        userAuth.tokenCreateDate = new Date(); //moment().format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
        userAuth.passwordFormat = process.env.PASSWORD_FORMAT;
        userAuth.passwordSalt = salt;
        userAuth.passwordHash = sha256;
        userAuth.confirmToken = roundomNumer + JwtAction.randomValueHex(6);
        userAuth.resetPasswordToken = passcode;
        userAuth.isConfirmed = false;
        userAuth.isApproved = true;
        userAuth.isLocked = false;
        userAuth.failedCount = 0;
        userAuth.updatedBy = 0

        try {
            let answer = await this.dataConn.getRepository(UserAuth).save(userAuth);
            delete answer.passwordHash;
            delete answer.passwordSalt;
            return {
                status: RegStatus.OK,
            }
        } catch (ex) {
            // logger
            return {
                status: RegStatus.DBError
            }
        }

    }

    
    public async logout(authsession: any): Promise < boolean > {
        let sessionService = new RefreshSessionService();
        return sessionService.remove(authsession)
        
    }
    public async authenticate(authLogin: IAuthLogin): Promise < IAuthResult > {
        let sessionService = new RefreshSessionService();
        let userAuth = await this.dataConn.getRepository(UserAuth).findOne({where:{email: authLogin.email}})

        if (!userAuth) {
            return {
                status: AuthStatus.NotFound
            };
        } else {
            if (!userAuth.isConfirmed) {
                return {
                    status: AuthStatus.NotConfirmed
                };
            } else {
                if (!userAuth.isApproved) {
                    return {
                        status: AuthStatus.NotApproved
                    };
                } else {
                    if (userAuth.isLocked) {
                        return {
                            status: AuthStatus.Locked
                        };
                    } else {

                        let sha256_new = JwtAction.getHashBySalt(authLogin.password, userAuth.passwordSalt, userAuth.passwordFormat)
                        if (sha256_new === userAuth.passwordHash) {
                            let session: RefreshSession = new RefreshSession();
                            session.auth_id = userAuth.id;
                            session.expiresIn = new Date().getTime() + parseInt(configApp.REFRESH_TOKEN_EXPIRES);
                            session.ip = '';
                            session.ua = '';

                            let refresh: string = await sessionService.add(session);
                            let authRoles = await this.dataConn.getRepository(UserRole).find({where: {id:userAuth.id}});
                            
                            let 
                                authInfo: IAuthInfo = {
                                authId: userAuth.id,
                                expiresIn: new Date(new Date().getTime() + parseInt(configApp.ACCESS_TOKEN_EXPIRES) * 1000).toISOString(),
                                roles: authRoles.map((userRole) => {
                                    return {
                                        id:userRole.role_id,
                                        name: ROLES[userRole.role_id]
                                    }
                                })
                            }
                            let accessToken = JwtAction.signToken(authInfo, {
                                expiresIn: configApp.ACCESS_TOKEN_EXPIRES
                            })
                            userAuth.failedCount = 0;
                            userAuth.lastLogin = new Date();

                            await this.dataConn.getRepository(UserAuth).save(userAuth)
                            return {
                                status: AuthStatus.OK,
                                token: accessToken,
                                session: refresh
                            };
                        } else {
                            userAuth.failedCount++;
                            userAuth.lastLogin = new Date();
                            userAuth.isLocked = (userAuth.failedCount >= 3) ? true : false;
                            await this.dataConn.getRepository(UserAuth).save(userAuth)
                            return {
                                status: AuthStatus.WrongPass
                            };
                        }
                    }
                }
            }
        }
    }
}