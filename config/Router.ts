
import * as express from "express";
import { 
    AuthRouter, 
    RefreshRouter, 
} from "../src/routes";

interface IROUTER {
    path: string;
    middleware: any[];
    handler: express.Router;
}

const Auth = new AuthRouter()
const Refresh = new RefreshRouter()

export const ROUTER: IROUTER[] = [
    {
        handler: Refresh.router,
        middleware: [],
        path: "/api",
    },
    {
        handler: Auth.router,
        middleware: [],
        path: "/api/admin/auth",
    },
    
];
