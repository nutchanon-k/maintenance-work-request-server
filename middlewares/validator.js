const Joi = require('joi')
const createError = require('../utils/create-error')

const loginSchema = Joi.object({
    email: Joi
    .string()
    .email()
    .required()
    .trim()
    .messages({
        "string.empty": "email is required",
        "string.email": "Please enter a valid email address"
    }),
    password: Joi
    .string()
    .required()
    .messages({
        "string.empty": "password is required",
    }),
})
// {firstName, lastName, email, password, confirmPassword, picture?, locationId, departmentId, role, level}
const createUserSchema = Joi.object({
    firstName: Joi
    .string()
    .required()
    .trim()
    .messages({
        "string.empty": "firstName is required",
    }),
    lastName: Joi
    .string()
    .required()
    .trim()
    .messages({
        "string.empty": "lastName is required",
    }),
    email: Joi
    .string()
    .email()
    .required()
    .trim()
    .messages({
        "string.empty": "email is required",
        "string.email": "Please enter a valid email address"
    }),
    password: Joi
    .string()
    .required()
    .min(6)
    .messages({
        "string.empty": "password is required",
    }),
    confirmPassword: Joi
    .string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Confirm password not match the password.',
      'string.empty': 'Confirm password is required.',
    }),
    picture: Joi
    .string()
    .allow('')
    .uri()
    .optional()
    .messages({
      'string.uri': 'Picture must be a valid URL.',
    }),
    locationId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'number.base': 'Location ID must be a number.',
      'number.integer': 'Location ID must be an integer.',
      'any.required': 'Location ID is required.',
    }),
    departmentId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'number.base': 'Department ID must be a number.',
      'number.integer': 'Department ID must be an integer.',
      'any.required': 'Department ID is required.',
    }),
    role: Joi
    .string()
    .valid('admin', 'requester', 'maintenance')
    .required()
    .trim()
    .messages({
      'any.only': 'Role must be either admin, user, or manager.',
      'string.empty': 'Role is required.',
    }),
    level: Joi.string()
    .valid('manager', 'leader', 'staff')
    .required()
    .trim()
    .messages({
      'any.only': 'Level must be either manager, leader, or staff.',
      'string.empty': 'Level is required.',
    }),

})

const updateUserSchema = Joi.object({
    firstName: Joi
    .string()
    .required()
    .trim()
    .messages({
        "string.empty": "firstName is required",
    }),
    lastName: Joi
    .string()
    .required()
    .trim()
    .messages({
        "string.empty": "lastName is required",
    }),
    email: Joi
    .string()
    .email()
    .required()
    .trim()
    .messages({
        "string.empty": "email is required",
        "string.email": "Please enter a valid email address"
    }),
    password: Joi
    .string()
    .required()
    .min(6)
    .messages({
        "string.empty": "password is required",
    }),
    picture: Joi
    .string()
    .allow('')
    .uri()
    .optional()
    .messages({
      'string.uri': 'Picture must be a valid URL.',
    }),
    locationId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'number.base': 'Location ID must be a number.',
      'number.integer': 'Location ID must be an integer.',
      'any.required': 'Location ID is required.',
    }),
    departmentId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'number.base': 'Department ID must be a number.',
      'number.integer': 'Department ID must be an integer.',
      'any.required': 'Department ID is required.',
    }),
    role: Joi
    .string()
    .valid('admin', 'requester', 'maintenance')
    .required()
    .trim()
    .messages({
      'any.only': 'Role must be either admin, user, or manager.',
      'string.empty': 'Role is required.',
    }),
    level: Joi.string()
    .valid('manager', 'leader', 'staff')
    .required()
    .trim()
    .messages({
      'any.only': 'Level must be either manager, leader, or staff.',
      'string.empty': 'Level is required.',
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
module.exports.createUserValidator = validateSchema(createUserSchema)
module.exports.updateUserValidator = validateSchema(updateUserSchema)