
import { DataSourceOptions, DataSource } from "typeorm";
import { configApp, isProduction } from "../configApp";
import * as models from "../src/entities";

const config: DataSourceOptions = {
    //- !!! DO NOT CHANGE synchronize 
    synchronize: true, // !!! true will drop the DB !!!
    database: configApp.DATABASE.DB_NAME,
    host: configApp.DATABASE.DB_HOST,
    password: configApp.DATABASE.DB_PASSWORD,
    port: configApp.DATABASE.DB_PORT as number,
    type: configApp.DATABASE.DIALECT as any,
    username: configApp.DATABASE.DB_USER,
    migrations: [
        "src/migrations/**/*.ts"
    ],
    subscribers: [
        "src/subscribers/**/*.ts"
    ],
    
    logging: !isProduction(),
    entities: Object.values(models),
    cache: false
}
export const Connection = new DataSource(config);
