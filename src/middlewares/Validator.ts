
import { ObjectSchema, ValidationOptions } from "joi";
import * as express from "express";
import { HttpStatusCode } from "../Interfaces";

const OPTS: ValidationOptions = {
    abortEarly: false,
    messages: {
        key: "{{key}} ",
    },
};

export function Validator(schema: ObjectSchema) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const params = req.method === "GET" ? req.params : req.body;
        const { error } = schema.validate(params, OPTS);
        if (error) {
            const { message } = error;
            return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ message });
        } else {
            return next();
        }
    };
}

