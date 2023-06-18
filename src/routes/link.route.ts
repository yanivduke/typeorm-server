
import { LinkController } from "../controllers";
import { Router } from "./Router";
import { ValidateToken, Validator, Permissions } from "../middlewares";
//import { link } from "../schemas";

export class LinkRouter extends Router {
    constructor() {
        super(LinkController);
        this.router
            .get("/:id", [
                ValidateToken, 
                //Permissions(["owner","admin","master", "system"]),
            ],
            this.handler(LinkController.prototype.GetDetails))         

    }
}
