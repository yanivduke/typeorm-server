import * as JWT from "jsonwebtoken";
import * as crypto from 'crypto';
import { configApp } from "../../configApp";
import { IAuthResult, AuthStatus, IAuthInfo, IRole, IPaymentAuth } from "../Interfaces";

export class JwtAction {

    public static signToken(params: IAuthInfo, options?: any): string {
        return JWT.sign(params, configApp.COOKIE_SECRET, options || undefined);
    }

    public static signPayment(params: IPaymentAuth, options?: any): string {
        return JWT.sign(params, configApp.COOKIE_SECRET, options || undefined);
    }

    public static validateToken( accessToken: string): IAuthResult {
        let authResult: IAuthResult = {status: null}
        JWT.verify(accessToken.split(" ")[1], configApp.COOKIE_SECRET, (err, decoded) => {
            authResult.info = decoded as IAuthInfo;
            if (err) {
                if (err instanceof JWT.TokenExpiredError) {
                    authResult.status = AuthStatus.ExpiredAccess;
                } else {
                    authResult.status = AuthStatus.FakeAccess;
                    authResult.info = null;
                }
            } else {
                authResult.status = AuthStatus.OK;
            }
        })
        return authResult
    }

    public static validatePayment( paymentToken: string): IPaymentAuth {
        let info: IPaymentAuth = null;
        JWT.verify(paymentToken, configApp.COOKIE_SECRET, (err, decoded) => {
            
            if (err) {
                if (err instanceof JWT.TokenExpiredError) {
                    info = null;
                } else {
                    info = null;
                }
            } else {
                info = decoded as IPaymentAuth;
            }
        })
        return info
    }

    public static randomValueHex (len: number) {
        return crypto.randomBytes(Math.ceil(len/2))
            .toString('hex') // convert to hexadecimal format
            .slice(0,len);   // return required number of characters
    }

    public static getHashBySalt(pss: string, slt: string, format: string){
        let hash = crypto.createHmac(format, slt); /** Hashing algorithm sha256 */
        hash.update(pss);
        let value = hash.digest('hex');
        return value
    }

    public static cryptoRandomBytes (length: number) {
        return crypto.randomBytes(length).toString('base64');
    }

}
