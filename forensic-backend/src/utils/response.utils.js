/**
 * Standardized API Response Utilities
 * Provides consistent response format across all endpoints
 */

/**
 * Send success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {object} data - Response data
 * @param {string} message - Success message
 */
const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
  const response = {
    success: true,
    message,
    data,
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} errors - Additional error details
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    error: {
      message,
      statusCode,
    },
  };
  
  if (errors) {
    response.error.details = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {array} data - Response data
 * @param {object} pagination - Pagination metadata
 * @param {string} message - Success message
 */
const sendPaginated = (res, statusCode = 200, data = [], pagination = {}, message = 'Success') => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: pagination.totalPages || 0,
      hasNext: pagination.hasNext || false,
      hasPrev: pagination.hasPrev || false,
    },
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send created response (201)
 * @param {object} res - Express response object
 * @param {object} data - Created resource data
 * @param {string} message - Success message
 */
const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, 201, data, message);
};

/**
 * Send no content response (204)
 * @param {object} res - Express response object
 */
const sendNoContent = (res) => {
  return res.status(204).send();
};

/**
 * Send validation error response
 * @param {object} res - Express response object
 * @param {array} errors - Validation errors array
 */
const sendValidationError = (res, errors) => {
  return sendError(res, 400, 'Validation failed', errors);
};

/**
 * Send unauthorized response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, 401, message);
};

/**
 * Send forbidden response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendForbidden = (res, message = 'Forbidden access') => {
  return sendError(res, 403, message);
};

/**
 * Send not found response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, 404, message);
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
  sendNoContent,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
};
