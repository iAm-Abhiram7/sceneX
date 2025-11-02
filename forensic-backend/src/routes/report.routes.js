const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportStats,
} = require('../controllers/report.controller');

const router = express.Router();

/**
 * Apply authentication middleware to all routes
 */
router.use(authenticate);

/**
 * Validation rules for creating a report
 */
const createReportValidation = [
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*.uri')
    .optional()
    .isString()
    .withMessage('Image URI must be a string'),
  body('images.*.size')
    .optional()
    .isNumeric()
    .withMessage('Image size must be a number'),
  body('chatHistory')
    .optional()
    .isArray()
    .withMessage('Chat history must be an array'),
  body('chatHistory.*.id')
    .optional()
    .isString()
    .withMessage('Message ID must be a string'),
  body('chatHistory.*.role')
    .optional()
    .isIn(['user', 'assistant'])
    .withMessage('Role must be either "user" or "assistant"'),
  body('chatHistory.*.content')
    .optional()
    .isString()
    .withMessage('Message content must be a string'),
  body('reportContent')
    .optional()
    .isString()
    .withMessage('Report content must be a string'),
  body('evidenceTags')
    .optional()
    .isArray()
    .withMessage('Evidence tags must be an array'),
  body('status')
    .optional()
    .isIn(['draft', 'completed'])
    .withMessage('Status must be either "draft" or "completed"'),
];

/**
 * Validation rules for updating a report
 */
const updateReportValidation = [
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('chatHistory')
    .optional()
    .isArray()
    .withMessage('Chat history must be an array'),
  body('reportContent')
    .optional()
    .isString()
    .withMessage('Report content must be a string'),
  body('evidenceTags')
    .optional()
    .isArray()
    .withMessage('Evidence tags must be an array'),
  body('status')
    .optional()
    .isIn(['draft', 'completed'])
    .withMessage('Status must be either "draft" or "completed"'),
];

/**
 * @route   POST /api/v1/reports
 * @desc    Create a new report
 * @access  Private
 */
router.post('/', createReportValidation, validate, createReport);

/**
 * @route   GET /api/v1/reports/stats
 * @desc    Get report statistics
 * @access  Private
 * Note: This must come before /:id route to avoid conflict
 */
router.get('/stats', getReportStats);

/**
 * @route   GET /api/v1/reports
 * @desc    Get all reports for authenticated user
 * @access  Private
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 * @query   status - Filter by status (draft/completed)
 * @query   search - Search in caseId, summary, or tags
 */
router.get('/', getReports);

/**
 * @route   GET /api/v1/reports/:id
 * @desc    Get single report by ID
 * @access  Private
 */
router.get('/:id', getReportById);

/**
 * @route   PUT /api/v1/reports/:id
 * @desc    Update a report
 * @access  Private
 */
router.put('/:id', updateReportValidation, validate, updateReport);

/**
 * @route   DELETE /api/v1/reports/:id
 * @desc    Delete a report
 * @access  Private
 */
router.delete('/:id', deleteReport);

module.exports = router;
