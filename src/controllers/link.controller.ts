
import { Request, Response } from "express";
import { LinkService } from "../services";
import { Controller } from "./Controller";
import { Logger } from "../../winston";
import { AuthStatus, HttpStatusCode, IAuthLogin, IAuthRegister, IAuthResult, IRefreshToken, IRole, RegStatus, ROLES } from "../Interfaces";
import { SPSController } from "./SPS.controller";
import { Link } from "../entities";

export class LinkController extends SPSController<Link> {

    private loginReg: IAuthRegister;

    constructor(req: Request, res: Response) {
        let srv = new LinkService()
        let searchObj:{[key: string]: any} = {};
        super(req, res, srv, searchObj);
        this.service = srv

    }

    public async GetDetails(): Promise<Response> {
        const id: any  = this.req.params.id;
        let data = await this.service.get(id);

        return this.res.status(HttpStatusCode.OK).send({status: "OK", data: data});
    }

}
