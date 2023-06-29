import * as dotenv from "dotenv";
import { env } from "process";

dotenv.config({ path: "./.env" });

const LOCAL_CONFIGURATION = {
    DB_NAME: process.env.DB_NAME,
    DIALECT: process.env.DB_DIALECT,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER
};

const PRODUCTION_CONFIGURATION = {
    DB_NAME: process.env.DB_NAME,
    DIALECT: "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: 5432,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER
};

export function isProduction(): boolean {
    return env.NODE_ENV === "PRODUCTION";
}

export const configApp = {
    LOG_FILE_PATH: process.env.LOG_FILE_PATH,
    DATABASE: isProduction() ? PRODUCTION_CONFIGURATION : LOCAL_CONFIGURATION,
    PORT_APP: env.SERVER_PORT,
    COOKIE_SECRET: env.COOKIE_SECRET,
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES,
    API_TOKEN_EXPIRES: process.env.API_TOKEN_EXPIRES,
    NANOID_CHARS: "0123456789abcdefghijklmnopqrstuvwxyz",
    NANOID_LENGTH: 8,
    BASE_URL: process.env.BASE_URL,
    SITE_URL: process.env.SITE_URL,
    DOMAIN: process.env.DOMAIN,
    UPLOAD_ROOT_PATH: process.env.UPLOAD_ROOT_PATH,
    UPLOAD_BASE_URL: process.env.UPLOAD_BASE_URL,
    EMAIL_SENDER: "dukhan.yaniv@gmail.com",
    EMAIL_SMTP: {
        host: 'email-smtp.eu-west-1.amazonaws.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_KEY,
            pass: process.env.SMTP_TOKEN,
        }
    },
    SMS: {
        provider_name: "019",
        address: 'https://www.019sms.co.il/api',
        user_name: process.env.SMS_KEY,
        password: process.env.SMS_TOKEN,
        sender: "Duke"
    },

};
