const Joi = require('joi')
const createError = require('../utils/create-error')

//auth validator
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


//user validator
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
  isAvailable: Joi
    .boolean()
    .messages({
      'any.required': 'isAvailable is required.',
    }),
})


//Request Task validator
const createRequestTaskSchema = Joi.object({

  employeeId: Joi
    .number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Employee ID must be a number',
      'number.integer': 'Employee ID must be an integer',
      'number.positive': 'Employee ID must be a positive number',
      'any.required': 'Employee ID is required'
    }),
  machineId: Joi
    .number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Machine ID must be a number',
      'number.integer': 'Machine ID must be an integer',
      'number.positive': 'Machine ID must be a positive number',
      'any.required': 'Machine ID is required'
    }),
  faultSymptoms: Joi
    .string()
    .required()
    .messages({
      'string.base': 'Fault symptoms must be a string',
      'string.empty': 'Fault symptoms cannot be empty',
      'any.required': 'Fault symptoms are required'
    }),
  departmentId: Joi
    .number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Department ID must be a number',
      'number.integer': 'Department ID must be an integer',
      'number.positive': 'Department ID must be a positive number',
      'any.required': 'Department ID is required'
    }),

  image: Joi
    .string()
    .uri()
    .allow('')
    .messages({
      'string.base': 'Image must be a string',
      'string.uri': 'Image must be a valid URL'
    }),

});
const updateRequestTaskSchema = Joi.object({

  employeeId: Joi
    .number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Employee ID must be a number',
      'number.integer': 'Employee ID must be an integer',
      'number.positive': 'Employee ID must be a positive number',
      'any.required': 'Employee ID is required'
    }),
  machineId: Joi
    .number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Machine ID must be a number',
      'number.integer': 'Machine ID must be an integer',
      'number.positive': 'Machine ID must be a positive number',
      'any.required': 'Machine ID is required'
    }),
  faultSymptoms: Joi
    .string()
    .required()
    .messages({
      'string.base': 'Fault symptoms must be a string',
      'string.empty': 'Fault symptoms cannot be empty',
      'any.required': 'Fault symptoms are required'
    }),
  departmentId: Joi
    .number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Department ID must be a number',
      'number.integer': 'Department ID must be an integer',
      'number.positive': 'Department ID must be a positive number',
      'any.required': 'Department ID is required'
    }),

  image: Joi
    .string()
    .uri()
    .allow('',null)
    .messages({
      'string.base': 'Image must be a string',
      'string.uri': 'Image must be a valid URL'
    }),
  status: Joi
    .string()
    .valid('inProgress','success')
    .required()
    .messages({
      'any.only': 'Status must be either inProgress or success.',
      'string.empty': 'Status is required.',
    }),

});


//Maintenance Task validator
const createMaintenanceTaskSchema = Joi.object({
  requestId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Request ID is required.',
      'number.base': 'Request ID must be a number.',
      'number.integer': 'Request ID must be an integer.'
    }),
  machineId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Machine ID is required.',
      'number.base': 'Machine ID must be a number.',
      'number.integer': 'Machine ID must be an integer.'
    }),
  employeeId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Employee ID is required.',
      'number.base': 'Employee ID must be a number.',
      'number.integer': 'Employee ID must be an integer.'
    }),
  typeOfFailureId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Type of Failure ID is required.',
      'number.base': 'Type of Failure ID must be a number.',
      'number.integer': 'Type of Failure ID must be an integer.'
    }),
  typeOfRootCauseId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Type of Root Cause ID is required.',
      'number.base': 'Type of Root Cause ID must be a number.',
      'number.integer': 'Type of Root Cause ID must be an integer.'
    }),
  rootCauseDetail: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Root Cause Detail must be a string.'
  }),
  operationDetails: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Operation Details must be a string.'
  }),
  preventingRecurrence: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Preventing Recurrence must be a string.'
  }),
  equipmentUsed: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Equipment Used must be a string.'
  }),
  additionalSuggestions: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Additional Suggestions must be a string.'
  }),
  image: Joi
  .string()
  .allow('',null)
  .uri()
  .optional()
  .messages({
    'string.uri': 'Picture must be a valid URL.',
  }),
});
const updateMaintenanceTaskSchema = Joi.object({
  requestId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Request ID is required.',
      'number.base': 'Request ID must be a number.',
      'number.integer': 'Request ID must be an integer.'
    }),
  machineId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Machine ID is required.',
      'number.base': 'Machine ID must be a number.',
      'number.integer': 'Machine ID must be an integer.'
    }),
  employeeId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Employee ID is required.',
      'number.base': 'Employee ID must be a number.',
      'number.integer': 'Employee ID must be an integer.'
    }),
  typeOfFailureId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Type of Failure ID is required.',
      'number.base': 'Type of Failure ID must be a number.',
      'number.integer': 'Type of Failure ID must be an integer.'
    }),
  typeOfRootCauseId: Joi
    .number()
    .integer()
    .required()
    .messages({
      'any.required': 'Type of Root Cause ID is required.',
      'number.base': 'Type of Root Cause ID must be a number.',
      'number.integer': 'Type of Root Cause ID must be an integer.'
    }),
  rootCauseDetail: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Root Cause Detail must be a string.'
  }),
  operationDetails: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Operation Details must be a string.'
  }),
  preventingRecurrence: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Preventing Recurrence must be a string.'
  }),
  equipmentUsed: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Equipment Used must be a string.'
  }),
  additionalSuggestions: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Additional Suggestions must be a string.'
  }),
  finishTime: Joi
  .date()
  .iso()
  .allow(null)
  .optional()
  .messages({
    'date.base': 'Finish Time must be a valid date.',
    'date.iso': 'Finish Time must be in ISO format.'
  }),
  acceptTime: Joi
  .date()
  .iso()
  .allow(null)
  .optional()
  .messages({
    'date.base': 'Accept Time must be a valid date.',
    'date.iso': 'Accept Time must be in ISO format.'
  }),
  status: Joi
  .string()
  .valid('backlog', 'inProgress', 'inReview', 'success')
  .optional()
  .messages({
    'any.only': 'Status must be one of the following: backlog, inProgress, inReview, success.'
  }),
  isRejected: Joi
  .boolean()
  .optional()
  .messages({
    'boolean.base': 'Is Rejected must be a boolean.'
  }),
  rejectReason: Joi
  .string()
  .allow(null, '')
  .optional()
  .messages({
    'string.base': 'Reject Reason must be a string.'
  }),
  image: Joi
  .string()
  .allow('',null)
  .uri()
  .optional()
  .messages({
    'string.uri': 'Picture must be a valid URL.',
  }),
});




//function to validate schema
const validateSchema = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body)

  if (error) {
    return createError(400, error.details[0].message)
  }
  req.input = value
  next()
}





module.exports.loginValidator = validateSchema(loginSchema)
module.exports.createUserValidator = validateSchema(createUserSchema)
module.exports.updateUserValidator = validateSchema(updateUserSchema)
module.exports.createRequestTaskValidator = validateSchema(createRequestTaskSchema)
module.exports.updateRequestTaskValidator = validateSchema(updateRequestTaskSchema)
module.exports.createMaintenanceTaskValidator = validateSchema(createMaintenanceTaskSchema)
module.exports.updateMaintenanceTaskValidator = validateSchema(updateMaintenanceTaskSchema)