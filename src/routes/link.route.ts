
import { LinkController } from "../controllers";
import { Router } from "./Router";
import { ValidateToken, Validator, Permissions } from "../middlewares";
import { new_link, link_data, link_status } from "../schemas";

export class LinkRouter extends Router {
    constructor() {
        super(LinkController);
        this.router
            .post("/", [ 
                ValidateToken, 
                Validator(new_link) 
            ], this.handler(LinkController.prototype.create))
            .put("/", [ 
                ValidateToken, 
                Validator(link_data) 
            ], this.handler(LinkController.prototype.update))
            .put("/status", [ 
                ValidateToken, 
                Validator(link_status) 
            ], this.handler(LinkController.prototype.setStatus))
            .get("/", [ 
                ValidateToken, 
            ], this.handler(LinkController.prototype.Search))

    }
}
