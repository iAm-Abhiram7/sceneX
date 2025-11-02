const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated, sendNotFound, sendNoContent, sendPaginated } = require('../utils/response.utils');
const { AppError } = require('../middleware/error.middleware');

/**
 * @desc    Create a new forensic report
 * @route   POST /api/v1/reports
 * @access  Private
 */
const createReport = asyncHandler(async (req, res) => {
  const { images, chatHistory, reportContent, evidenceTags, status } = req.body;
  
  // Generate unique case ID
  const caseId = await Report.generateCaseId();
  
  // Create report
  const report = await Report.create({
    userId: req.userId,
    caseId,
    images: images || [],
    chatHistory: chatHistory || [],
    reportContent: reportContent || '',
    evidenceTags: evidenceTags || [],
    status: status || 'draft',
  });
  
  sendCreated(res, report, 'Report created successfully');
});

/**
 * @desc    Get all reports for authenticated user
 * @route   GET /api/v1/reports
 * @access  Private
 */
const getReports = asyncHandler(async (req, res) => {
  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Filter parameters
  const status = req.query.status;
  const search = req.query.search;
  
  // Build query
  const query = { userId: req.userId };
  
  if (status) {
    query.status = status;
  }
  
  if (search) {
    query.$or = [
      { caseId: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } },
      { evidenceTags: { $in: [new RegExp(search, 'i')] } },
    ];
  }
  
  // Execute query with pagination
  const [reports, total] = await Promise.all([
    Report.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-chatHistory'), // Exclude chat history for list view
    Report.countDocuments(query),
  ]);
  
  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  const pagination = {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
  
  sendPaginated(res, 200, reports, pagination, 'Reports retrieved successfully');
});

/**
 * @desc    Get single report by ID
 * @route   GET /api/v1/reports/:id
 * @access  Private
 */
const getReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const report = await Report.findById(id);
  
  if (!report) {
    throw new AppError('Report not found', 404);
  }
  
  // Verify ownership
  if (report.userId.toString() !== req.userId.toString()) {
    throw new AppError('You do not have permission to access this report', 403);
  }
  
  sendSuccess(res, 200, report, 'Report retrieved successfully');
});

/**
 * @desc    Update a report
 * @route   PUT /api/v1/reports/:id
 * @access  Private
 */
const updateReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { images, chatHistory, reportContent, evidenceTags, status } = req.body;
  
  // Find report
  const report = await Report.findById(id);
  
  if (!report) {
    throw new AppError('Report not found', 404);
  }
  
  // Verify ownership
  if (report.userId.toString() !== req.userId.toString()) {
    throw new AppError('You do not have permission to update this report', 403);
  }
  
  // Update fields
  if (images !== undefined) {
    report.images = images;
  }
  
  if (chatHistory !== undefined) {
    // Append new messages to existing chat history
    if (Array.isArray(chatHistory)) {
      report.chatHistory.push(...chatHistory);
    }
  }
  
  if (reportContent !== undefined) {
    report.reportContent = reportContent;
  }
  
  if (evidenceTags !== undefined) {
    report.evidenceTags = evidenceTags;
  }
  
  if (status !== undefined) {
    report.status = status;
  }
  
  // Save updated report
  await report.save();
  
  sendSuccess(res, 200, report, 'Report updated successfully');
});

/**
 * @desc    Delete a report
 * @route   DELETE /api/v1/reports/:id
 * @access  Private
 */
const deleteReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Find report
  const report = await Report.findById(id);
  
  if (!report) {
    throw new AppError('Report not found', 404);
  }
  
  // Verify ownership
  if (report.userId.toString() !== req.userId.toString()) {
    throw new AppError('You do not have permission to delete this report', 403);
  }
  
  // Delete report
  await report.deleteOne();
  
  sendSuccess(res, 200, { id }, 'Report deleted successfully');
});

/**
 * @desc    Get report statistics for authenticated user
 * @route   GET /api/v1/reports/stats
 * @access  Private
 */
const getReportStats = asyncHandler(async (req, res) => {
  const stats = await Report.aggregate([
    {
      $match: { userId: req.userId }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const total = await Report.countDocuments({ userId: req.userId });
  
  const statsObject = {
    total,
    draft: 0,
    completed: 0,
  };
  
  stats.forEach(stat => {
    statsObject[stat._id] = stat.count;
  });
  
  sendSuccess(res, 200, statsObject, 'Statistics retrieved successfully');
});

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportStats,
};
