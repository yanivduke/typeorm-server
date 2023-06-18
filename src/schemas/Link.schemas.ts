
import *  as Joi from "joi";

export const new_link = Joi.object().keys({
    name: Joi.string().required(),
    desc: Joi.string().allow(null, ''),
    link: Joi.string().required(),
    cdate: Joi.date().required(),
    status: Joi.boolean().required(),
    features: Joi.string().required(),
});

export const link_data = Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required(),
    desc: Joi.string().allow(null, ''),
});


export const link_status = Joi.object().keys({
    id: Joi.number().required(),
    status: Joi.boolean().required(),
});
