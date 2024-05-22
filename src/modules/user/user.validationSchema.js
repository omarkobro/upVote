import Joi from "joi";

export let userSchema = {
    body: Joi.object({
        userName: Joi.string().min(2).max(10).alphanum().required().messages({
            'any.required': 'please enter your username'
        }),
        email: Joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }).required(),
        password: Joi.string().required(),
        cpass: Joi.string().valid(Joi.ref('password')), 
        age: Joi.number().min(4).max(75),
        gender: Joi.string().valid('female', 'male') 
        
    })
}