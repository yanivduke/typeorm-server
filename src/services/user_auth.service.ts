
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
import { configApp } from "../../configApp";
import email from "../helpers/outgoing/email";

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

    public async SendOTP(eMail: string): Promise < boolean > {
        if(this.isValidEmail(eMail)){

            let userAuth = await this.dataConn.getRepository(UserAuth).findOne({where:{email: eMail}})
            if(userAuth){
                const nanoidShort = customAlphabet("0123456789",6);
                let passcode =  await nanoidShort();
                userAuth.tokenCreateDate = new Date();
                userAuth.resetPasswordToken = passcode;
                userAuth = await this.dataConn.getRepository(UserAuth).save(userAuth);

                let welcomeMessage = `<!doctype html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>אישור הרשמה - דוכנים</title>
        <style>
        img {
            border: none;
            -ms-interpolation-mode: bicubic;
            max-width: 100%; 
        }

        body {
            background-color: #f6f6f6;
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%; 
        }

        table {
            border-collapse: separate;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%; }
            table td {
            font-family: sans-serif;
            font-size: 14px;
            vertical-align: top; 
        }

        .body {
            background-color: #f6f6f6;
            width: 100%; 
        }

        .container {
            display: block;
            margin: 0 auto !important;
            /* makes it centered */
            max-width: 580px;
            padding: 10px;
            width: 580px; 
        }

        .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 580px;
            padding: 10px; 
        }

        </style>
    </head>
    <body dir="RTL">
        <span class="preheader">מערכת צ'יטה</span>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
            <td>שלום חבריקו, שכחת את הסיסמה לא נורא...</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td class="container">
                <a href=${configApp.SITE_URL + '/reset/?token=' + userAuth.resetPasswordToken}
                לחץ כאן לאיפוס סיסמה
                </a>
            </td>
            <td>&nbsp;</td>
        </tr>
        </table>
    </body>
    </html>`
                let emailMsg: any = {isHTML: true, subject: 'איפוס סיסמה', to_address: userAuth.email, content: welcomeMessage}
                
                email(emailMsg);
            
                return true
            }
        }
        else
        {
            return false
        }
        
    }
    isValidEmail(email: string): boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    public async update(loginReg: IAuthRegister, code: string): Promise < IRegResult > {
        let userAuth = await this.dataConn.getRepository(UserAuth).findOne({where:{email: loginReg.email, resetPasswordToken:code}})
        if(userAuth){
            let latestCreationTime = userAuth.tokenCreateDate;
            latestCreationTime.setMinutes(latestCreationTime.getMinutes() + 20);
            if( latestCreationTime < new Date()){
                return {status: RegStatus.Expired};
            }
        }
        let salt = JwtAction.cryptoRandomBytes(128);
        let sha256 = JwtAction.getHashBySalt(loginReg.password, salt, process.env.PASSWORD_FORMAT)
        
        const nanoidShort = customAlphabet("0123456789",6);
        let passcode =  await nanoidShort();
        userAuth.tokenCreateDate = new Date(); //moment().format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
        userAuth.passwordSalt = salt;
        userAuth.passwordHash = sha256;
        userAuth.resetPasswordToken = passcode;
        userAuth.isLocked = false;
        userAuth.failedCount = 0;
        userAuth.updatedBy = userAuth.id

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