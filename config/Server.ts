
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as methodOverride from "method-override";
import * as morgan from "morgan";
import { HttpStatusCode } from "../src/Interfaces";
import { Connection } from "./Database";
import { DataSourceOptions, DataSource } from "typeorm";

import { ROUTER } from "./Router";

export class Server {

    private static connectDB(): DataSource {
        Connection.initialize()
        return Connection;
    }

    private readonly app: express.Application;
    private readonly server: http.Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
    }

    public async start(): Promise<http.Server> {
        await Server.connectDB();
        this.expressConfiguration();
        this.configurationRouter();
        
        return this.server;
    }

    public App(): express.Application {
        return this.app;
    }

    private expressConfiguration(): void {
        this.app.use(express.urlencoded({ extended: true, limit: "50kb" }));
        this.app.use(express.json({ limit: "50kb" }));
        this.app.use(methodOverride());
        this.app.use((req, res, next): void => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
            res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS");
            next();
        });
        this.app.use(morgan("combined"));
        this.app.disable('x-powered-by')
        //this.app.use(helmet({
        //    crossOriginResourcePolicy: false,
        //}));
        this.app.use(cors());
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
            err.status = HttpStatusCode.NOT_FOUND;
            next(err);
        });
    }

    private configurationRouter(): void {
        for (const route of ROUTER) {
            this.app.use(route.path, route.middleware, route.handler);
        }
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
            res.status(HttpStatusCode.NOT_FOUND);
            res.json({
                error: "Not found",
            });
            next();
        });
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
            if (err.name === "UnauthorizedError") {
                res.status(HttpStatusCode.UNAUTHORIZED).json({
                    error: "Please send a valid Token...",
                });
            }
            next();
        });
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
            res.status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR);
            res.json({
                error: err.message,
            });
            next();
        });
    }

}
