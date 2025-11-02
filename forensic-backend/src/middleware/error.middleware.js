const config = require('../config/config');

/**
 * Custom Application Error Class
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Mongoose Validation Errors
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => ({
    field: error.path,
    message: error.message,
  }));
  
  return {
    statusCode: 400,
    message: 'Validation failed',
    errors,
  };
};

/**
 * Handle Mongoose Duplicate Key Errors
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  
  return {
    statusCode: 409,
    message: `A record with ${field} '${value}' already exists`,
    errors: [{ field, message: `${field} must be unique` }],
  };
};

/**
 * Handle Mongoose Cast Errors
 */
const handleCastError = (err) => {
  return {
    statusCode: 400,
    message: `Invalid ${err.path}: ${err.value}`,
    errors: [{ field: err.path, message: 'Invalid format' }],
  };
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => {
  return {
    statusCode: 401,
    message: 'Invalid token. Please log in again.',
  };
};

/**
 * Handle JWT Expired Errors
 */
const handleJWTExpiredError = () => {
  return {
    statusCode: 401,
    message: 'Your token has expired. Please log in again.',
  };
};

/**
 * Send Error Response in Development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
      statusCode: err.statusCode || 500,
      status: err.status,
      stack: err.stack,
      error: err,
    },
  });
};

/**
 * Send Error Response in Production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const response = {
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    };
    
    if (err.errors) {
      response.error.details = err.errors;
    }
    
    res.status(err.statusCode).json(response);
  } else {
    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥:', err);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong. Please try again later.',
        statusCode: 500,
      },
    });
  }
};

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.isOperational = err.isOperational || false;
  
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    const validationError = handleValidationError(err);
    error.statusCode = validationError.statusCode;
    error.message = validationError.message;
    error.errors = validationError.errors;
    error.isOperational = true;
  }
  
  if (err.code === 11000) {
    const duplicateError = handleDuplicateKeyError(err);
    error.statusCode = duplicateError.statusCode;
    error.message = duplicateError.message;
    error.errors = duplicateError.errors;
    error.isOperational = true;
  }
  
  if (err.name === 'CastError') {
    const castError = handleCastError(err);
    error.statusCode = castError.statusCode;
    error.message = castError.message;
    error.errors = castError.errors;
    error.isOperational = true;
  }
  
  if (err.name === 'JsonWebTokenError') {
    const jwtError = handleJWTError();
    error.statusCode = jwtError.statusCode;
    error.message = jwtError.message;
    error.isOperational = true;
  }
  
  if (err.name === 'TokenExpiredError') {
    const jwtExpiredError = handleJWTExpiredError();
    error.statusCode = jwtExpiredError.statusCode;
    error.message = jwtExpiredError.message;
    error.isOperational = true;
  }
  
  // Send error response based on environment
  if (config.nodeEnv === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 Not Found Errors
 */
const notFound = (req, res, next) => {
  const error = new AppError(
    `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    404
  );
  next(error);
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
};
