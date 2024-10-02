const joi = require('joi')
const createError = require('../utils/create-error')

const loginSchema = joi.object({
    email: joi
    .string()
    .email()
    .required()
    .trim()
    .messages({
        "string.empty": "email is required",
        "string.email": "Please enter a valid email address"
    }),
    password: joi
    .string()
    .required()
    .messages({
        "string.empty": "password is required",
    }),
})

const validateSchema = (schema) => (req, res, next) => {
    const {value, error} = schema.validate(req.body)

    if(error){
        return createError(400, error.details[0].message)
    }
    req.input = value
    next()
}


module.exports.loginValidator = validateSchema(loginSchema)