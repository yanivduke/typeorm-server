
import * as dotenv from "dotenv";
import { resolve } from "path";
import { env } from "process";
import { Logger } from "./winston";
import { configApp, isProduction } from "./configApp";
import { Server } from "./config/Server";

dotenv.config({ path: resolve() + "/.env" });

const port: number = Number(env.SERVER_PORT) || Number(configApp.PORT_APP) || 3000;
new Server().start().then((server) => {
    server.listen(port);

    server.on("error", (error: any) => {
        if (error.syscall !== "listen") {
            throw error;
        }
        switch (error.code) {
            case "EACCES":
                console.error("Port requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error("Port is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    server.on("listening", () => {
        Logger('info','"process": "${pid}", "PORT": "${port}", "message": "${msg}"', 
        {
            port: port, 
            pid: process.pid,
            msg: "server starts!"
        })
    });
});

