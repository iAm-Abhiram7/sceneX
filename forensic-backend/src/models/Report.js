const mongoose = require('mongoose');

/**
 * Report Schema
 * Stores forensic analysis reports with images, chat history, and case details
 */
const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  caseId: {
    type: String,
    required: [true, 'Case ID is required'],
    unique: true,
    index: true,
  },
  images: [{
    uri: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    size: {
      type: Number,
      min: 0,
    },
    _id: false, // Disable _id for subdocuments
  }],
  chatHistory: [{
    id: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUri: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    _id: false,
  }],
  reportContent: {
    type: String,
    default: '',
  },
  evidenceTags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  summary: {
    type: String,
    default: '',
    maxlength: [200, 'Summary cannot exceed 200 characters'],
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'completed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'draft',
    index: true,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
  }
});

/**
 * Pre-save middleware to auto-generate summary from reportContent
 */
reportSchema.pre('save', function(next) {
  if (this.isModified('reportContent') && this.reportContent) {
    // Generate summary as first 200 characters of report content
    this.summary = this.reportContent.substring(0, 200);
    if (this.reportContent.length > 200) {
      this.summary += '...';
    }
  }
  next();
});

/**
 * Static method to generate unique case ID
 * Format: CASE-YYYY-XXXX (e.g., CASE-2025-0001)
 * @returns {Promise<string>} - Generated case ID
 */
reportSchema.statics.generateCaseId = async function() {
  const currentYear = new Date().getFullYear();
  const prefix = `CASE-${currentYear}-`;
  
  // Find the latest case ID for this year
  const latestReport = await this.findOne({
    caseId: { $regex: `^${prefix}` }
  }).sort({ caseId: -1 }).select('caseId');
  
  let sequenceNumber = 1;
  
  if (latestReport) {
    // Extract sequence number from latest case ID
    const lastSequence = parseInt(latestReport.caseId.split('-')[2]);
    sequenceNumber = lastSequence + 1;
  }
  
  // Pad sequence number to 4 digits
  const paddedSequence = sequenceNumber.toString().padStart(4, '0');
  
  return `${prefix}${paddedSequence}`;
};

/**
 * Virtual field for image count
 */
reportSchema.virtual('imageCount').get(function() {
  return this.images ? this.images.length : 0;
});

/**
 * Virtual field for message count
 */
reportSchema.virtual('messageCount').get(function() {
  return this.chatHistory ? this.chatHistory.length : 0;
});

/**
 * Indexes for efficient queries
 */
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ caseId: 1 }, { unique: true });
reportSchema.index({ evidenceTags: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
