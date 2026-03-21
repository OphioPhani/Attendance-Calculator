import { body, param, validationResult } from 'express-validator';
import validator from 'validator';

/**
 * Input Validation & Sanitization
 * Prevents injection attacks and invalid data
 */

// Validation error handler middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Username validation and sanitization
const usernameValidation = () => [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, hyphens, and underscores')
    .escape(),
];

// Email validation and sanitization
const emailValidation = () => [
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .custom(value => {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email format');
      }
      return true;
    }),
];

// Mobile validation
const mobileValidation = () => [
  body('mobile')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Mobile number must be exactly 10 digits'),
];

// Password validation - Strong password requirements
const passwordValidation = () => [
  body('password')
    .isLength({ min: 12 })
    .withMessage('Password must be at least 12 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character (!@#$%^&*)'),
];

// Password confirmation validation
const passwordConfirmValidation = () => [
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Signup validation
export const validateSignup = [
  ...usernameValidation(),
  ...emailValidation(),
  ...mobileValidation(),
  ...passwordValidation(),
  ...passwordConfirmValidation(),
  handleValidationErrors,
];

// Login validation
export const validateLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Username, email, or mobile is required')
    .isLength({ min: 3 })
    .withMessage('Invalid identifier'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Invalid password'),
  handleValidationErrors,
];

// Attendance validation
export const validateAttendance = [
  param('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Invalid year'),
  body('semester')
    .trim()
    .isIn(['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2',
           'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'])
    .withMessage('Invalid semester'),
  body('date')
    .optional()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format')
    .custom(value => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      if (date > new Date()) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    }),
  body('type')
    .trim()
    .isIn(['present', 'absent', 'holiday'])
    .withMessage('Invalid attendance type'),
  handleValidationErrors,
];

// Date range validation
export const validateDateRange = [
  body('startDate')
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Start date must be in YYYY-MM-DD format')
    .custom(value => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid start date');
      }
      if (date > new Date()) {
        throw new Error('Start date cannot be in the future');
      }
      return true;
    }),
  body('endDate')
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('End date must be in YYYY-MM-DD format')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      if (isNaN(endDate.getTime())) {
        throw new Error('Invalid end date');
      }
      if (endDate > new Date()) {
        throw new Error('End date cannot be in the future');
      }
      if (endDate < startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('type')
    .trim()
    .isIn(['present', 'absent', 'holiday'])
    .withMessage('Invalid attendance type'),
  handleValidationErrors,
];

export default {
  validateSignup,
  validateLogin,
  validateAttendance,
  validateDateRange,
  handleValidationErrors,
};
