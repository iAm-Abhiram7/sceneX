const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate JWT Access Token
 * @param {string} userId - User ID to encode in token
 * @returns {string} - Signed JWT token
 */
const generateAccessToken = (userId) => {
  try {
    const payload = {
      userId,
      type: 'access',
    };
    
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpire,
      issuer: 'forensic-api',
      audience: 'forensic-client',
    });
  } catch (error) {
    throw new Error('Failed to generate access token');
  }
};

/**
 * Generate JWT Refresh Token
 * @param {string} userId - User ID to encode in token
 * @returns {string} - Signed JWT refresh token
 */
const generateRefreshToken = (userId) => {
  try {
    const payload = {
      userId,
      type: 'refresh',
    };
    
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshTokenExpire,
      issuer: 'forensic-api',
      audience: 'forensic-client',
    });
  } catch (error) {
    throw new Error('Failed to generate refresh token');
  }
};

/**
 * Verify JWT Access Token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'forensic-api',
      audience: 'forensic-client',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Verify JWT Refresh Token
 * @param {string} token - JWT refresh token to verify
 * @returns {object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'forensic-api',
      audience: 'forensic-client',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token to decode
 * @returns {object} - Decoded token payload
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Failed to decode token');
  }
};

/**
 * Generate both access and refresh tokens
 * @param {string} userId - User ID to encode in tokens
 * @returns {object} - Object with accessToken and refreshToken
 */
const generateTokenPair = (userId) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  generateTokenPair,
};
