
import * as express from "express";
import { 
    AuthRouter, 
    RefreshRouter, 
    LinkRouter,
    ClientRouter
} from "../src/routes";

interface IROUTER {
    path: string;
    middleware: any[];
    handler: express.Router;
}

const Auth = new AuthRouter()
const Refresh = new RefreshRouter()
const Link = new LinkRouter()
const Client = new ClientRouter()

export const ROUTER: IROUTER[] = [
    {
        handler: Refresh.router,
        middleware: [],
        path: "/api/refresh",
    },
    {
        handler: Auth.router,
        middleware: [],
        path: "/api/admin/auth",
    },
    {
        handler: Link.router,
        middleware: [],
        path: "/api/admin/link",
    },
    {
        handler: Client.router,
        middleware: [],
        path: "/api",
    },
    
];
