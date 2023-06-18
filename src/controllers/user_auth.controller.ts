
import { Request, Response } from "express";
import { UserAuthService } from "../services";
import { Controller } from "./Controller";
import { Logger } from "../../winston";
import { AuthStatus, HttpStatusCode, IAuthLogin, IAuthRegister, IAuthResult, IRefreshToken, IRole, RegStatus, ROLES } from "../Interfaces";
import { SPSController } from "./SPS.controller";
import { UserAuth } from "../entities";

export class UserAuthController extends SPSController<UserAuth> {

    private authService: UserAuthService;
    private loginReg: IAuthRegister;

    constructor(req: Request, res: Response) {
        let srv = new UserAuthService()
        let searchObj:{[key: string]: any} = {};
        super(req, res, srv, searchObj);
        this.authService = srv

    }

    public async GetDetails(): Promise<Response> {
        const id: any  = this.req.params.id;
        let data = await this.authService.getDetails(this.scope, id);

        return this.res.status(HttpStatusCode.OK).send({status: "OK", data: data});
    }

    public async login(): Promise<Response> {
        let result: IAuthResult;
        const data: IAuthLogin  = this.req.body;
        
        try {
            result = await this.authService.authenticate(data);
            if(result.status == AuthStatus.OK)
            {
                return this.res.status(HttpStatusCode.OK).send({status: AuthStatus[result.status], session: result.session, token: result.token});
            } else {
                return this.res.status(HttpStatusCode.UNAUTHORIZED).send({ status: AuthStatus[result.status] });
            }
        } catch (ex) {
            let errId = Logger('error', '"data": ${data} "message": "${msg}"', {
                data: JSON.stringify(ex),
                msg: "uset_auth-login: " + ex.message
            })
            return this.res.status(HttpStatusCode.EXPECTATION_FAILED).send({ status: "Unexpected", err: errId });
        }
    }

    public async logout(): Promise<Response> {
        let result: any
        const data = {
            fingerprint: this.req.body.fingerprint,
            refreshToken: this.req.body.refreshToken,
        }
        try {
            result = await this.authService.logout(data);
            if(result)
            {
                return this.res.status(HttpStatusCode.OK).send({status: "OK"});
            } else {
                return this.res.status(HttpStatusCode.NO_CONTENT).send({ status: 'ERROR' });
            }
        } catch (ex) {
            let errId = Logger('error', '"data": ${data} "message": "${msg}"', {
                data: JSON.stringify(ex),
                msg: "uset_auth-logout: " + ex.message
            })
            return this.res.status(HttpStatusCode.NOT_ACCEPTABLE).send({ status: "Unexpected", err: errId });
        }
    }

    public async register(): Promise<Response> {
        const newUser: IAuthRegister  = this.req.body;
        
        let data = await this.authService.create(newUser);

        return this.res.status(HttpStatusCode.OK).send({status: RegStatus[data.status]});
    }


    public async update(): Promise<Response> {
        const newUser: IAuthRegister  = this.req.body;
        
        let data = await this.authService.create(newUser);

        return this.res.status(HttpStatusCode.OK).send({status: "OK", data: data});
    }


    public async SendOPT(): Promise<Response> {
        const newUser: IAuthRegister  = this.req.body;
        
        let data = await this.authService.create(newUser);

        return this.res.status(HttpStatusCode.OK).send({status: "OK", data: data});
    }
}
