
import { Request, Response } from "express";
import { LinkService } from "../services";
import { Controller } from "./Controller";
import { Logger } from "../../winston";
import { HttpStatusCode, ILink, ILinkData, ILinkStatus} from "../Interfaces";
import { SPSController } from "./SPS.controller";
import { Link } from "../entities";

export class LinkController extends SPSController<Link> {

    constructor(req: Request, res: Response) {
        let srv = new LinkService()
        let searchObj:{[key: string]: any} = {};
        super(req, res, srv, searchObj);
        this.service = srv

    }

    public async GetDetails(): Promise<Response> {
        const id: any  = this.req.params.id;
        let data = await (this.service as LinkService).getDetails(id);

        return this.res.status(HttpStatusCode.OK).send({status: "OK", data: data});
    }

    public async create(): Promise<Response> {
        const newLink: ILink  = this.req.body as ILink;
        let data = await (this.service as (LinkService)).create(newLink);

        return this.res.status(HttpStatusCode.OK).send({status: "OK", data: data});
    }

    public async update(): Promise<Response> {
        const updateLink: ILinkData  = this.req.body as ILinkData;

        let data = await (this.service as (LinkService)).update(updateLink);

        return this.res.status(HttpStatusCode.OK).send({status: "OK", data: data});
    }
    
    public async setStatus(): Promise<Response> {
        const statusLink: ILinkStatus  = this.req.body as ILinkStatus;
        let data = await (this.service as (LinkService)).status(statusLink);

        return this.res.status(HttpStatusCode.OK).send({status: "OK", data: data});
    }

}
