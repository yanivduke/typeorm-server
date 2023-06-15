
import * as express from "express";
import { IAuthInfo } from "../Interfaces";

export abstract class Controller {

    public req: express.Request;
    public res: express.Response;
    public scope: IAuthInfo;
    constructor(req: express.Request, res: express.Response) {
        this.req = req;
        this.res = res;
        this.scope = (req as any).scope;
    }
}
