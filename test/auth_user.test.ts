
import * as chai from "chai";
import * as dotenv from "dotenv";
import * as express from "express";
import { resolve } from "path";
import * as supertest from "supertest";
import { Logger } from "../winston";
import { UserAuthService } from "../src/services/user_auth.service";
import { Server } from "../config/Server";

dotenv.config({ path: resolve() + "/.env" });

let token: string;
let IdRecord: number;
let IdRecordTwo: number;
const server: Server = new Server();
let app: express.Application;

const loginService = new UserAuthService();

describe("Auth User route", () => {

    before((done) => {
        
        server.start().then(() => {
            app = server.App();
            Promise.all([
                
            ]).then((res) => {
                
                done();
            });
        });
    });

    after(async () => {
        
    });

    

    it("create a new login auth", (done) => {
        supertest(app).post("/auth")
            //.set("Authorization", `bearer ${token}`)
            .set("Accept", "application/json")
            .send({ email: "yaniv.d1uke@gmail.com", password: "12345678"})
            .end((err: Error, res: supertest.Response) => {
                chai.expect(res.status).to.eq(200);
                //chai.expect(res.body).to.have.all.keys("email", "phone", "email", "password");
                //chai.expect(res.body.id).to.be.a("number");
                //chai.expect(res.body.text).to.be.a("string");
                //IdRecordTwo = res.body.id;
                done();
            });
    });

    it("login", (done) => {
        supertest(app).post("/auth/login")
            //.set("Authorization", `bearer ${token}`)
            .set("Accept", "application/json")
            .send({email: "yaniv.d1uke@gmail.com", password: "12345678"})
            .end((err: Error, res: supertest.Response) => {
                chai.expect(res.status).to.eq(200);
                done();
            });
    });

});
