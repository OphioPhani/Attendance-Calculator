import api from './api.js';

// Auth endpoints
export const authService = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Attendance endpoints
export const attendanceService = {
  getAttendance: (semester) => api.get(`/attendance/${semester}`),
  updateAttendance: (data) => api.post('/attendance/update', data),
  addHoliday: (data) => api.post('/attendance/add-holiday', data),
  removeHoliday: (data) => api.delete('/attendance/remove-holiday', { data }),
  calculateMetrics: (semester, startDate, endDate) =>
    api.get(`/attendance/calculate/${semester}`, {
      params: { startDate, endDate },
    }),
};

export default { authService, attendanceService };
