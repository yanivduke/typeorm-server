import { DataSource } from 'typeorm';
import { configApp, isProduction } from "./configApp";

export default new DataSource({
    synchronize: false, // !!! true will drop the DB !!!
    database: configApp.DATABASE.DB_NAME,
    host: configApp.DATABASE.DB_HOST,
    password: configApp.DATABASE.DB_PASSWORD,
    port: 5432,
    type: 'postgres',
    username: configApp.DATABASE.DB_USER,
    migrations: [
        "src/migrations/**/*.ts"
    ],
    subscribers: [
        "src/subscribers/**/*.ts"
    ],
    
    logging: true

});