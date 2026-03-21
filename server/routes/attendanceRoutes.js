import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getAttendance,
  updateAttendance,
  addHoliday,
  removeHoliday,
  calculateMetrics,
} from '../controllers/attendanceController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/calculate/:semester', calculateMetrics);
router.get('/:semester', getAttendance);
router.post('/update', updateAttendance);
router.post('/add-holiday', addHoliday);
router.delete('/remove-holiday', removeHoliday);

export default router;
