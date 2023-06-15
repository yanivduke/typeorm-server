
import { RefreshSessionController } from "../controllers";
import { Router } from "./Router";
import { Validator } from "../middlewares";
import { refresh } from "../schemas";

export class RefreshRouter extends Router {
    constructor() {
        super(RefreshSessionController);
        this.router
            .post("/refresh", [ Validator(refresh) ],this.handler(RefreshSessionController.prototype.refreshToken))
            
    }
}
