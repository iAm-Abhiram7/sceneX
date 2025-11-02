const User = require('../models/User');
const Session = require('../models/Session');
const asyncHandler = require('../utils/asyncHandler');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt.utils');
const { sendSuccess, sendCreated, sendError, sendUnauthorized } = require('../utils/response.utils');
const { AppError } = require('../middleware/error.middleware');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }
  
  // Create new user (password will be hashed by pre-save hook)
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
  });
  
  // Generate tokens
  const { accessToken, refreshToken } = generateTokenPair(user._id);
  
  // Calculate refresh token expiry (7 days from now)
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
  
  // Store refresh token session
  await Session.create({
    userId: user._id,
    refreshToken,
    deviceInfo: req.headers['user-agent'] || 'Unknown Device',
    ipAddress: req.ip || req.connection.remoteAddress || 'Unknown IP',
    expiresAt: refreshTokenExpiry,
  });
  
  // Return user data and tokens
  const responseData = {
    user: user.getPublicProfile(),
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: '15m',
    },
  };
  
  sendCreated(res, responseData, 'User registered successfully');
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email and include password field
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }
  
  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Update last login timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  
  // Generate tokens
  const { accessToken, refreshToken } = generateTokenPair(user._id);
  
  // Calculate refresh token expiry
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
  
  // Create new session
  await Session.create({
    userId: user._id,
    refreshToken,
    deviceInfo: req.headers['user-agent'] || 'Unknown Device',
    ipAddress: req.ip || req.connection.remoteAddress || 'Unknown IP',
    expiresAt: refreshTokenExpiry,
  });
  
  // Return user data and tokens
  const responseData = {
    user: user.getPublicProfile(),
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: '15m',
    },
  };
  
  sendSuccess(res, 200, responseData, 'Login successful');
});

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  
  if (!token) {
    throw new AppError('Refresh token is required', 400);
  }
  
  // Verify refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (error) {
    throw new AppError(error.message, 401);
  }
  
  // Check token type
  if (decoded.type !== 'refresh') {
    throw new AppError('Invalid token type', 401);
  }
  
  // Find all sessions for this user
  const sessions = await Session.find({ 
    userId: decoded.userId,
    expiresAt: { $gt: new Date() } 
  });
  
  if (!sessions || sessions.length === 0) {
    throw new AppError('Session not found or expired. Please log in again.', 401);
  }
  
  // Find matching session by comparing hashed tokens
  let validSession = null;
  for (const session of sessions) {
    const isValid = await session.compareToken(token);
    if (isValid) {
      validSession = session;
      break;
    }
  }
  
  if (!validSession) {
    throw new AppError('Invalid refresh token. Please log in again.', 401);
  }
  
  // Check if session is expired
  if (validSession.isExpired()) {
    await validSession.deleteOne();
    throw new AppError('Session has expired. Please log in again.', 401);
  }
  
  // Verify user still exists and is active
  const user = await User.findById(decoded.userId);
  
  if (!user) {
    throw new AppError('User not found', 401);
  }
  
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }
  
  // Generate new access token
  const { accessToken } = generateTokenPair(user._id);
  
  // Return new access token
  const responseData = {
    accessToken,
    expiresIn: '15m',
  };
  
  sendSuccess(res, 200, responseData, 'Token refreshed successfully');
});

/**
 * @desc    Logout user and invalidate refresh token
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
const logout = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  
  if (!token) {
    throw new AppError('Refresh token is required', 400);
  }
  
  // Verify and decode refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (error) {
    // Even if token is expired, try to delete the session
    throw new AppError('Invalid or expired refresh token', 401);
  }
  
  // Find and delete all matching sessions
  const sessions = await Session.find({ userId: decoded.userId });
  
  let deletedCount = 0;
  for (const session of sessions) {
    const isMatch = await session.compareToken(token);
    if (isMatch) {
      await session.deleteOne();
      deletedCount++;
    }
  }
  
  if (deletedCount === 0) {
    throw new AppError('Session not found', 404);
  }
  
  sendSuccess(res, 200, null, 'Logout successful');
});

/**
 * @desc    Logout from all devices
 * @route   POST /api/v1/auth/logout-all
 * @access  Private
 */
const logoutAll = asyncHandler(async (req, res) => {
  // Delete all sessions for the authenticated user
  const result = await Session.deleteMany({ userId: req.userId });
  
  sendSuccess(
    res, 
    200, 
    { sessionsDeleted: result.deletedCount }, 
    'Logged out from all devices successfully'
  );
});

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  logoutAll,
};
