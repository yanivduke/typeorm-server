
import * as express from "express";
import { HttpStatusCode, IRole } from "../Interfaces";

export function Permissions(allowedRoles: string[]) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let authRoles = (req as any).scope.roles as IRole[]
        let isPermitted: boolean = false;
        for(let i: number=0; i < authRoles.length && !isPermitted; i++)
        {
            for(let j: number=0; j < allowedRoles.length; j++)
            {
                if(authRoles[i].name==allowedRoles[j]){
                    isPermitted = true;
                    break;
                }
            }
        }

        if (isPermitted) {
            return next();
        } else {
            const { message } = {message: "error: no permission"};
            return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ message });
        }
    };
}
