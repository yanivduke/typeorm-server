
import { UserAuthController } from "../controllers";
import { Router } from "./Router";
import { ValidateToken, Validator, Permissions } from "../middlewares";
import { register, login } from "../schemas";

export class AuthRouter extends Router {
    constructor() {
        super(UserAuthController);
        this.router
            .get("/:id", [
                ValidateToken, 
                Permissions(["owner","admin","master", "system"]),
            ],
            this.handler(UserAuthController.prototype.GetDetails))         

            .post("/login", [ Validator(login) ], this.handler(UserAuthController.prototype.login))
            .post("/logout", this.handler(UserAuthController.prototype.logout))
            .post("/register", [ Validator(register) ], this.handler(UserAuthController.prototype.register))
            .put("/update/:resetPasswordToken", [ Validator(register) ], this.handler(UserAuthController.prototype.update))
            .put("/reset/:email", [ Validator(register) ], this.handler(UserAuthController.prototype.SendOPT))

    }
}
