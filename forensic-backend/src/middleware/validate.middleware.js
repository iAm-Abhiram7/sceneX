const { validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/response.utils');

/**
 * Validation Middleware
 * Checks for validation errors from express-validator
 * Returns formatted error response if validation fails
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format validation errors
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));
    
    return sendValidationError(res, formattedErrors);
  }
  
  next();
};

module.exports = { validate };
