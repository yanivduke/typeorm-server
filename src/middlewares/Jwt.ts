
import * as express from "express";
import { AuthStatus, IAuthInfo, IRole } from "../Interfaces";
import { JwtAction } from "../services";
import { HttpStatusCode } from "../Interfaces";

export function ValidateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    let auth_header = req.header("Authorization")
    if(auth_header) {
        if(auth_header=='guest') {
            let guestInfo: IAuthInfo = {roles: [{id: 1, name:'guest'}] as IRole[]};

            (req as any).scope = guestInfo;
            return next()
        } else {
            let result = JwtAction.validateToken(auth_header)

            if(result.status == AuthStatus.OK) {
                (req as any).scope = result.info
            } else {
                (req as any).scope = null
                const { message, status } = {message: "error: no valid token", status: "AUTH_TOKEN_ERROR"};
                return res.status(HttpStatusCode.NETWORK_AUTHENTICATION_REQUIRED).json({ message, status });
            }
            return next()
        }
    } else {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({message: "error: no token" });
    }
}

