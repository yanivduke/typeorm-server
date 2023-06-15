
import { Request, Response } from "express";
import { RefreshSessionService } from "../services";
import { AuthStatus, IAuthResult, IRefreshToken, HttpStatusCode } from "../Interfaces";
import { Controller } from "./Controller";
import { Logger } from "../../winston";

export class RefreshSessionController extends Controller {

    private sessionService: RefreshSessionService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.sessionService = new RefreshSessionService();
    }

    public async refreshToken(): Promise<Response> {
        const reqRefreshToken: IRefreshToken  = this.req.body;
        if(reqRefreshToken && reqRefreshToken.refreshToken && reqRefreshToken.fingerprint){
            let authResult: IAuthResult = await this.sessionService.validate(reqRefreshToken)
            if(authResult && authResult.status == AuthStatus.OK) {
                return this.res.status(HttpStatusCode.OK).send({status: AuthStatus[authResult.status], session: reqRefreshToken.refreshToken, token: authResult.token});
            } else {
                return this.res.status(HttpStatusCode.UNAUTHORIZED).send({status: AuthStatus[authResult.status], session: "", token: ""});
            }
        } else {
            return this.res.status(HttpStatusCode.NOT_ACCEPTABLE).send({status: AuthStatus[AuthStatus.NoRefresh], session: "", token: ""});
        }
    }
}
