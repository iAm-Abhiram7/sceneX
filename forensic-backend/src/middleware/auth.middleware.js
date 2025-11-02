const { verifyAccessToken } = require('../utils/jwt.utils');
const { sendUnauthorized, sendForbidden } = require('../utils/response.utils');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request object
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(res, 'No token provided. Please authenticate.');
    }
    
    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);
    
    if (!token) {
      return sendUnauthorized(res, 'Invalid token format');
    }
    
    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return sendUnauthorized(res, error.message);
    }
    
    // Check if token type is access token
    if (decoded.type !== 'access') {
      return sendUnauthorized(res, 'Invalid token type');
    }
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return sendUnauthorized(res, 'User not found. Token may be invalid.');
    }
    
    // Check if user is active
    if (!user.isActive) {
      return sendForbidden(res, 'Your account has been deactivated. Please contact support.');
    }
    
    // Attach user to request object
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return sendUnauthorized(res, 'Authentication failed');
  }
};

/**
 * Authorization Middleware
 * Checks if user has required role
 * @param {Array<string>} roles - Array of allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorized(res, 'Authentication required');
    }
    
    if (!roles.includes(req.user.role)) {
      return sendForbidden(res, 'You do not have permission to perform this action');
    }
    
    next();
  };
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }
    
    try {
      const decoded = verifyAccessToken(token);
      
      if (decoded.type === 'access') {
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
          req.userId = user._id;
        }
      }
    } catch (error) {
      // Silently fail - token is optional
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
