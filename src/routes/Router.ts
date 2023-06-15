
import * as express from "express";
import { Logger } from "../../winston";
export abstract class Router {

    public router: express.Router;
    private controller: any;

    constructor(controller: any) {
        this.controller = controller;
        this.router = express.Router();
    }

    protected handler(action: () => void): any {
        
        return (req: Request, res: Response) => {
            
            Logger('info','"--request--": "${url}", "message": "${msg}"', 
            {
                url: req.url,
                msg: req.text
            });
            
            action.call(new this.controller(req, res))
        };
    }
}
