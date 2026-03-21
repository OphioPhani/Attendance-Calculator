import Attendance from '../models/Attendance.js';
import expressAsyncHandler from 'express-async-handler';
import { calculateAttendance, calculatePrediction } from '../utils/attendanceCalculator.js';

// Helper function to validate dates
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Helper function to check if date is in future
const isFutureDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

// @desc    Get attendance for a semester
// @route   GET /api/attendance/:semester
// @access  Private
export const getAttendance = expressAsyncHandler(async (req, res, next) => {
  const { semester } = req.params;
  const userId = req.user.id;

  const attendance = await Attendance.findOne({ userId, semester });

  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: 'No attendance record found for this semester',
    });
  }

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc    Update attendance (add attended dates)
// @route   POST /api/attendance/update
// @access  Private
export const updateAttendance = expressAsyncHandler(async (req, res, next) => {
  const { semester, dates, action } = req.body;
  const userId = req.user.id;

  // Validation
  if (!semester || !dates || !Array.isArray(dates) || !action) {
    return res.status(400).json({
      success: false,
      message: 'Semester, dates array, and action are required',
    });
  }

  if (!['add', 'remove', 'addAbsent', 'removeAbsent'].includes(action)) {
    return res.status(400).json({
      success: false,
      message: 'Action must be "add", "remove", "addAbsent", or "removeAbsent"',
    });
  }

  // Validate all dates
  for (let date of dates) {
    if (!isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: `Invalid date format: ${date}. Use YYYY-MM-DD`,
      });
    }
    if (isFutureDate(date)) {
      return res.status(400).json({
        success: false,
        message: `Cannot add future dates: ${date}`,
      });
    }
  }

  // Find or create attendance record
  let attendance = await Attendance.findOne({ userId, semester });

  if (!attendance) {
    attendance = new Attendance({ userId, semester, attendedDates: [], absentDates: [], customHolidays: [] });
  }

  if (action === 'add') {
    // Add dates to attendedDates, remove from absentDates if present
    attendance.attendedDates = [...new Set([...attendance.attendedDates, ...dates])];
    attendance.absentDates = attendance.absentDates.filter(d => !dates.includes(d));
  } else if (action === 'remove') {
    // Remove dates from attendedDates
    attendance.attendedDates = attendance.attendedDates.filter(
      (date) => !dates.includes(date)
    );
  } else if (action === 'addAbsent') {
    // Add dates to absentDates, remove from attendedDates if present
    attendance.absentDates = [...new Set([...attendance.absentDates, ...dates])];
    attendance.attendedDates = attendance.attendedDates.filter(d => !dates.includes(d));
  } else if (action === 'removeAbsent') {
    // Remove dates from absentDates
    attendance.absentDates = attendance.absentDates.filter(
      (date) => !dates.includes(date)
    );
  }

  await attendance.save();

  res.status(200).json({
    success: true,
    message: `Attendance ${action === 'add' ? 'updated' : 'removed'} successfully`,
    data: attendance,
  });
});

// @desc    Add custom holiday
// @route   POST /api/attendance/add-holiday
// @access  Private
export const addHoliday = expressAsyncHandler(async (req, res, next) => {
  const { semester, dates } = req.body;
  const userId = req.user.id;

  // Validation
  if (!semester || !dates || !Array.isArray(dates)) {
    return res.status(400).json({
      success: false,
      message: 'Semester and dates array are required',
    });
  }

  // Validate all dates
  for (let date of dates) {
    if (!isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: `Invalid date format: ${date}. Use YYYY-MM-DD`,
      });
    }
    if (isFutureDate(date)) {
      return res.status(400).json({
        success: false,
        message: `Cannot add future dates as holidays: ${date}`,
      });
    }
  }

  // Find or create attendance record
  let attendance = await Attendance.findOne({ userId, semester });

  if (!attendance) {
    attendance = new Attendance({
      userId,
      semester,
      attendedDates: [],
      absentDates: [],
      customHolidays: dates,
    });
  } else {
    // Add to customHolidays
    attendance.customHolidays = [...new Set([...attendance.customHolidays, ...dates])];
  }

  await attendance.save();

  res.status(200).json({
    success: true,
    message: 'Holiday(s) added successfully',
    data: attendance,
  });
});

// @desc    Remove custom holiday
// @route   DELETE /api/attendance/remove-holiday
// @access  Private
export const removeHoliday = expressAsyncHandler(async (req, res, next) => {
  const { semester, dates } = req.body;
  const userId = req.user.id;

  // Validation
  if (!semester || !dates || !Array.isArray(dates)) {
    return res.status(400).json({
      success: false,
      message: 'Semester and dates array are required',
    });
  }

  // Find attendance record
  const attendance = await Attendance.findOne({ userId, semester });

  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: 'No attendance record found for this semester',
    });
  }

  // Remove dates from customHolidays
  attendance.customHolidays = attendance.customHolidays.filter(
    (date) => !dates.includes(date)
  );

  await attendance.save();

  res.status(200).json({
    success: true,
    message: 'Holiday(s) removed successfully',
    data: attendance,
  });
});

// @desc    Calculate attendance metrics
// @route   GET /api/attendance/calculate/:semester
// @access  Private
export const calculateMetrics = expressAsyncHandler(async (req, res, next) => {
  const { semester } = req.params;
  const { startDate, endDate } = req.query;
  const userId = req.user.id;

  // Validation
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'startDate and endDate query parameters are required (YYYY-MM-DD format)',
    });
  }

  // Get attendance record
  let attendance = await Attendance.findOne({ userId, semester });

  if (!attendance) {
    attendance = new Attendance({
      userId,
      semester,
      attendedDates: [],
      absentDates: [],
      customHolidays: [],
    });
  }

  // Calculate metrics
  const metrics = calculateAttendance(
    startDate,
    endDate,
    attendance.attendedDates,
    attendance.absentDates,
    attendance.customHolidays
  );

  // Calculate prediction
  const prediction = calculatePrediction(
    metrics.percentage,
    metrics.attendedDays,
    75 // Target 75% attendance
  );

  res.status(200).json({
    success: true,
    data: {
      ...metrics,
      prediction,
      semester,
      startDate,
      endDate,
    },
  });
});
