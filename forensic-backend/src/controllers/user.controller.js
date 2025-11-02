const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendNotFound } = require('../utils/response.utils');
const { AppError } = require('../middleware/error.middleware');

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  // User is already attached to req by auth middleware
  const user = await User.findById(req.userId).select('-password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  sendSuccess(res, 200, user.getPublicProfile(), 'Profile retrieved successfully');
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  
  const user = await User.findById(req.userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Update allowed fields
  if (firstName !== undefined) {
    user.firstName = firstName;
  }
  
  if (lastName !== undefined) {
    user.lastName = lastName;
  }
  
  if (email !== undefined) {
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.userId } 
    });
    
    if (existingUser) {
      throw new AppError('Email is already in use', 409);
    }
    
    user.email = email;
  }
  
  await user.save();
  
  sendSuccess(res, 200, user.getPublicProfile(), 'Profile updated successfully');
});

/**
 * @desc    Change user password
 * @route   PUT /api/v1/users/password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password field
  const user = await User.findById(req.userId).select('+password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }
  
  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();
  
  sendSuccess(res, 200, null, 'Password changed successfully');
});

/**
 * @desc    Deactivate user account
 * @route   DELETE /api/v1/users/account
 * @access  Private
 */
const deactivateAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Soft delete - set isActive to false
  user.isActive = false;
  await user.save();
  
  // Optionally, delete all user sessions
  const Session = require('../models/Session');
  await Session.deleteMany({ userId: req.userId });
  
  sendSuccess(res, 200, null, 'Account deactivated successfully');
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
};
