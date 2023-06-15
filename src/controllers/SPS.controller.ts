
import { Request, Response } from "express";
import { Controller } from "./Controller";
import { SPSService } from "../services/sps.service";
import { BaseEntity } from "typeorm";
import { HttpStatusCode } from "../Interfaces";

export class SPSController<T> extends Controller {
    protected service: SPSService<T>;
    protected searchObj:{[key: string]: any};
    
    constructor(req: Request, res: Response, service: SPSService<T>, searchObj:{[key: string]: any}) {
        super(req, res);
        this.service = service;
        this.searchObj = searchObj;
    }

    public async Get(): Promise<Response> {
        const id: any  = this.req.params.id;
        //console.log("cntroler item: ", id)
        if(id){
            let item: any = await this.service.get(id)
            return this.res.status(HttpStatusCode.OK).send({status: "OK", data: item});
        }
    }
    
    public async Search(): Promise<Response> {
        let pagingAndSorting = this.GetPS()
        let answer = await this.service.search(this.searchObj, pagingAndSorting)
        
        return this.res.status(HttpStatusCode.OK).send({status: "OK", data: answer[0], count: answer[1]});
    }
    
    public GetPS() {
        let limit = this.req.query.psize || 5
        let start = this.req.query.pnum || 1
        let sortField = (!this.req.query.sfield || this.req.query.sfield == '[]') ? '["id"]':this.req.query.sfield;
        let sortDir = (!this.req.query.sdir || this.req.query.sdir == '[]') ? '["DESC"]':this.req.query.sdir;
        let searchBy = this.req.query.search || '[]'
        return {limit, start, sortField, sortDir, searchBy}
    }
    
}
