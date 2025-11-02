const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Session Schema
 * Manages refresh token sessions for authentication
 */
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  refreshToken: {
    type: String,
    required: [true, 'Refresh token is required'],
  },
  deviceInfo: {
    type: String,
    default: 'Unknown Device',
    trim: true,
  },
  ipAddress: {
    type: String,
    default: 'Unknown IP',
    validate: {
      validator: function(v) {
        // Basic IP address validation (IPv4 and IPv6)
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return v === 'Unknown IP' || ipv4Regex.test(v) || ipv6Regex.test(v);
      },
      message: 'Invalid IP address format'
    }
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
    index: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.refreshToken; // Don't expose token in JSON
      return ret;
    }
  }
});

/**
 * Pre-save middleware to hash refresh token before storing
 */
sessionSchema.pre('save', async function(next) {
  if (!this.isModified('refreshToken')) {
    return next();
  }
  
  try {
    // Hash the refresh token before storing
    const salt = await bcrypt.genSalt(10);
    this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare candidate token with hashed token
 * @param {string} candidateToken - Plain token to compare
 * @returns {Promise<boolean>} - True if tokens match
 */
sessionSchema.methods.compareToken = async function(candidateToken) {
  try {
    return await bcrypt.compare(candidateToken, this.refreshToken);
  } catch (error) {
    throw new Error('Token comparison failed');
  }
};

/**
 * Method to check if session is expired
 * @returns {boolean} - True if session is expired
 */
sessionSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

/**
 * Static method to clean up expired sessions
 * @returns {Promise<number>} - Number of deleted sessions
 */
sessionSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  return result.deletedCount;
};

/**
 * TTL index to automatically remove expired sessions
 * MongoDB will remove documents when expiresAt date is reached
 */
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Compound index for efficient queries
 */
sessionSchema.index({ userId: 1, expiresAt: 1 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
