
import * as express from "express";
import { 
    AuthRouter, 
    RefreshRouter, 
    LinkRouter
} from "../src/routes";

interface IROUTER {
    path: string;
    middleware: any[];
    handler: express.Router;
}

const Auth = new AuthRouter()
const Refresh = new RefreshRouter()
const Link = new LinkRouter()

export const ROUTER: IROUTER[] = [
    {
        handler: Refresh.router,
        middleware: [],
        path: "/api",
    },
    {
        handler: Auth.router,
        middleware: [],
        path: "/api/auth",
    },
    {
        handler: Link.router,
        middleware: [],
        path: "/api/link",
    },
    
];
