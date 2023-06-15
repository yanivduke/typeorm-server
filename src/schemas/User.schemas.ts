
import *  as Joi from "joi";

export const register = Joi.object().keys({
    email:   Joi.string().required(),
    password:   Joi.string().required()
});

export const login = Joi.object().keys({
    email:       Joi.string().required(),
    password:       Joi.string().required(),
});


export const refresh = Joi.object().keys({
    refreshToken:   Joi.string().required().guid({ version : 'uuidv4' }),
    accessToken:    Joi.string().required(),
});

