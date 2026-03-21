import { useState, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService.js';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async (semester) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await attendanceService.getAttendance(semester);
      setAttendance(response.data);
      return response.data;
    } catch (err) {
      setAttendance(null);
      const errorMsg = err?.message || 'Failed to fetch attendance';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateMetrics = useCallback(async (semester, startDate, endDate) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await attendanceService.calculateMetrics(semester, startDate, endDate);
      setMetrics(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err?.message || 'Failed to calculate metrics';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAttendance = useCallback(async (semester, dates, action) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await attendanceService.updateAttendance({
        semester,
        dates,
        action,
      });
      setAttendance(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err?.message || 'Failed to update attendance';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addHoliday = useCallback(async (semester, dates) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await attendanceService.addHoliday({ semester, dates });
      setAttendance(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err?.message || 'Failed to add holiday';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeHoliday = useCallback(async (semester, dates) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await attendanceService.removeHoliday({ semester, dates });
      setAttendance(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err?.message || 'Failed to remove holiday';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    attendance,
    metrics,
    isLoading,
    error,
    fetchAttendance,
    calculateMetrics,
    updateAttendance,
    addHoliday,
    removeHoliday,
  };
};

export default useAttendance;
