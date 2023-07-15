
import { LinkController } from "../controllers";
import { Router } from "./Router";

export class ClientRouter extends Router {
    constructor() {
        super(LinkController);
        this.router
            .get("/link/:id", this.handler(LinkController.prototype.GetDetails))

    }
}
