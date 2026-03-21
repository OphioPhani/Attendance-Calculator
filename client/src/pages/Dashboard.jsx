import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, InputField, Button } from '../components/FormComponents.jsx';
import { GradientButton } from '../components/GradientButton.jsx';
import { GlowCard } from '../components/GlowCard.jsx';
import { EnhancedGlowCard } from '../components/EnhancedGlowCard.jsx';
import HolographicCard from '../components/HolographicCard.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useAttendance } from '../hooks/useAttendance.js';
import { useNavigate } from 'react-router-dom';
import CrystalShader from '../components/CrystalShader.jsx';
import TextShimmer from '../components/TextShimmer.jsx';

const SEMESTERS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

const pad = (value) => String(value).padStart(2, '0');

const isoToDisplay = (isoDate) => {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

const displayToIso = (displayDate) => {
  if (!displayDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(displayDate)) {
    return null;
  }

  const [dayStr, monthStr, yearStr] = displayDate.split('/');
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  const parsed = new Date(year, month - 1, day);
  const isValid =
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day;

  if (!isValid) return null;

  return `${year}-${pad(month)}-${pad(day)}`;
};

const todayIso = () => new Date().toISOString().slice(0, 10);
const yesterdayIso = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
};

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const {
    attendance,
    metrics,
    isLoading,
    error,
    fetchAttendance,
    calculateMetrics,
    updateAttendance,
    addHoliday,
    removeHoliday,
  } = useAttendance();
  const navigate = useNavigate();
  const [semester, setSemester] = useState('1-1');
  const [dateInput, setDateInput] = useState('');
  const [bulkDatesInput, setBulkDatesInput] = useState('');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [status, setStatus] = useState('');
  const [isAutoCalculating, setIsAutoCalculating] = useState(false);

  useEffect(() => {
    const now = new Date();
    const end = todayIso();
    const monthStartIso = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    setDateInput(isoToDisplay(end));
    setEndDateInput(isoToDisplay(end));
    setStartDateInput(isoToDisplay(monthStartIso));
  }, []);

  const sortedAttendedDates = useMemo(
    () => [...(attendance?.attendedDates || [])].sort().reverse(),
    [attendance]
  );

  const sortedAbsentDates = useMemo(
    () => [...(attendance?.absentDates || [])].sort().reverse(),
    [attendance]
  );

  const sortedHolidayDates = useMemo(
    () => [...(attendance?.customHolidays || [])].sort().reverse(),
    [attendance]
  );

  const startDateIso = useMemo(() => displayToIso(startDateInput), [startDateInput]);
  const endDateIso = useMemo(() => displayToIso(endDateInput), [endDateInput]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getFormattedApiMessage = (fallbackMessage) => {
    if (typeof error === 'string' && error.trim()) return error;
    if (error?.message) return error.message;
    return fallbackMessage;
  };

  const parseBulkDates = (value) => {
    const values = value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    const isoDates = [];
    for (const entry of values) {
      const iso = displayToIso(entry);
      if (!iso) return null;
      isoDates.push(iso);
    }

    return [...new Set(isoDates)];
  };

  const handleLoadAttendance = async () => {
    setStatus('');
    try {
      await fetchAttendance(semester);
      setStatus('Attendance loaded successfully.');
    } catch (err) {
      const message = err?.message || err?.error || '';
      if (message.includes('No attendance record found')) {
        setStatus('No attendance record yet for this semester. Start by adding attendance dates.');
        return;
      }
      setStatus(message || 'Could not load attendance for this semester.');
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchAttendance(semester);
      } catch {
        // no record yet for selected semester
      }
    };

    load();
  }, [semester, fetchAttendance]);

  useEffect(() => {
    if (!startDateIso || !endDateIso || startDateIso > endDateIso) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsAutoCalculating(true);
        await calculateMetrics(semester, startDateIso, endDateIso);
      } catch {
        // keep silent for auto-calc to avoid noisy UX
      } finally {
        setIsAutoCalculating(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    semester,
    startDateIso,
    endDateIso,
    attendance?.attendedDates?.length,
    attendance?.customHolidays?.length,
    calculateMetrics,
  ]);

  const handleCalculate = async () => {
    const startIso = startDateIso;
    const endIso = endDateIso;

    if (!startIso || !endIso) {
      setStatus('Use valid range dates in dd/mm/yyyy format.');
      return;
    }

    if (startIso > endIso) {
      setStatus('Start date must be before end date.');
      return;
    }

    setStatus('');
    try {
      await calculateMetrics(semester, startIso, endIso);
      setStatus('Metrics calculated.');
    } catch {
      setStatus(getFormattedApiMessage('Failed to calculate metrics. Check dates and try again.'));
    }
  };

  const handleAttendanceAction = async (action, mode = 'single') => {
    const singleDateIso = displayToIso(dateInput);
    const bulkDatesIso = parseBulkDates(bulkDatesInput);

    const dates = mode === 'bulk' ? bulkDatesIso : singleDateIso ? [singleDateIso] : null;

    if (!dates || dates.length === 0) {
      setStatus(
        mode === 'bulk'
          ? 'Enter valid comma-separated dates in dd/mm/yyyy format.'
          : 'Enter a valid date in dd/mm/yyyy format.'
      );
      return;
    }

    setStatus('');
    try {
      await updateAttendance(semester, dates, action);
      if (mode === 'bulk') {
        const actionLabel = action === 'add' ? 'marked present' : action === 'remove' ? 'removed present' : action === 'addAbsent' ? 'marked absent' : 'removed absent';
        setStatus(`${dates.length} date(s) ${actionLabel}.`);
      } else {
        const actionLabel = action === 'add' ? 'marked present' : action === 'remove' ? 'removed present' : action === 'addAbsent' ? 'marked absent' : 'removed absent';
        setStatus(`Attendance ${actionLabel}.`);
      }
      await fetchAttendance(semester);
    } catch {
      setStatus(getFormattedApiMessage('Unable to update attendance.'));
    }
  };

  const handleHolidayAction = async (action) => {
    const dateIso = displayToIso(dateInput);

    if (!dateIso) {
      setStatus('Enter a valid date in dd/mm/yyyy format.');
      return;
    }

    setStatus('');
    try {
      if (action === 'add') {
        await addHoliday(semester, [dateIso]);
        setStatus('Holiday added.');
      } else {
        await removeHoliday(semester, [dateIso]);
        setStatus('Holiday removed.');
      }
      await fetchAttendance(semester);
    } catch {
      setStatus(getFormattedApiMessage('Unable to update holidays.'));
    }
  };

  const handleQuickDate = (isoDate) => {
    setDateInput(isoToDisplay(isoDate));
  };

  const applyDatePreset = (preset) => {
    const end = todayIso();

    if (preset === 'thisMonth') {
      const now = new Date();
      const startIso = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      setStartDateInput(isoToDisplay(startIso));
      setEndDateInput(isoToDisplay(end));
      return;
    }

    if (preset === 'last30') {
      const start = new Date();
      start.setDate(start.getDate() - 29);
      setStartDateInput(isoToDisplay(start.toISOString().slice(0, 10)));
      setEndDateInput(isoToDisplay(end));
    }
  };

  const attendanceCount = attendance?.attendedDates?.length || 0;
  const absentCount = attendance?.absentDates?.length || 0;
  const holidaysCount = attendance?.customHolidays?.length || 0;
  const daysRecorded = metrics?.daysRecorded || 0;
  const attendedDays = metrics?.attendedDays || 0;
  const daysAbsent = metrics?.daysAbsent || 0;
  const percentage = metrics?.percentage || 0;
  const prediction = metrics?.prediction;

  return (
    <div className="relative min-h-screen">
      {/* Crystal Shader Background */}
      <CrystalShader
        cellDensity={6.0}
        animationSpeed={0.15}
        warpFactor={0.5}
        mouseInfluence={0.12}
      />

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <TextShimmer
                duration={2}
                spread={80}
                className="text-3xl font-bold"
              >
                Attendance Dashboard
              </TextShimmer>
            </motion.div>
            <div className="flex items-center gap-4">
              <p className="text-gray-300">Welcome, <span className="text-cyan-400 font-semibold">{user?.username}</span></p>
              <GradientButton
                onClick={handleLogout}
                color="red"
                className="px-4 py-2 min-w-auto"
              >
                Logout
              </GradientButton>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
          {/* Semester Selector and Quick Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <GlassCard>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-200">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:bg-white/20 focus:border-cyan-400"
              >
                {SEMESTERS.map((entry) => (
                  <option key={entry} value={entry}>{entry}</option>
                ))}
              </select>
            </GlassCard>

            <HolographicCard className="flex flex-col justify-between p-4 sm:p-6 min-h-fit">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2">Present Days</h3>
              <p className="text-2xl sm:text-3xl font-bold text-cyan-300">{attendanceCount}</p>
            </HolographicCard>

            <HolographicCard className="flex flex-col justify-between p-4 sm:p-6 min-h-fit">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2">Absent Days</h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-300">{absentCount}</p>
            </HolographicCard>

            <HolographicCard className="flex flex-col justify-between p-4 sm:p-6 min-h-fit">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2">Attendance</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-300">{percentage}%</p>
            </HolographicCard>
          </div>

          {/* Attendance Actions */}
          <GlassCard>
            <TextShimmer
              duration={2.5}
              spread={75}
              className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5"
            >
              Attendance Actions
            </TextShimmer>

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-200">Single Date (dd/mm/yyyy)</label>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <InputField
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  placeholder="dd/mm/yyyy"
                />
                <div className="flex gap-2">
                  <GradientButton
                    onClick={() => handleQuickDate(todayIso())}
                    color="blue"
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm min-w-auto"
                  >
                    Today
                  </GradientButton>
                  <GradientButton
                    onClick={() => handleQuickDate(yesterdayIso())}
                    color="blue"
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm min-w-auto"
                  >
                    Yesterday
                  </GradientButton>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
              <GradientButton
                onClick={() => handleAttendanceAction('add')}
                disabled={isLoading}
                color="green"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-auto"
              >
                Mark Present
              </GradientButton>
              <GradientButton
                onClick={() => handleAttendanceAction('remove')}
                disabled={isLoading}
                color="red"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-auto"
              >
                Remove Present
              </GradientButton>
              <GradientButton
                onClick={() => handleAttendanceAction('addAbsent')}
                disabled={isLoading}
                color="green"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-auto"
              >
                Mark Absent
              </GradientButton>
              <GradientButton
                onClick={() => handleAttendanceAction('removeAbsent')}
                disabled={isLoading}
                color="red"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-auto"
              >
                Remove Absent
              </GradientButton>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
              <GradientButton
                onClick={() => handleHolidayAction('add')}
                disabled={isLoading}
                color="green"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-auto"
              >
                Add Holiday
              </GradientButton>
              <GradientButton
                onClick={() => handleHolidayAction('remove')}
                disabled={isLoading}
                color="red"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-auto"
              >
                Remove Holiday
              </GradientButton>
            </div>

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-200">Bulk Dates (dd/mm/yyyy, comma-separated)</label>
              <InputField
                value={bulkDatesInput}
                onChange={(e) => setBulkDatesInput(e.target.value)}
                placeholder="01/03/2026, 02/03/2026, 03/03/2026"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
              <GradientButton
                onClick={() => handleAttendanceAction('add', 'bulk')}
                disabled={isLoading}
                color="green"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-auto"
              >
                Bulk Mark Present
              </GradientButton>
              <GradientButton
                onClick={() => handleAttendanceAction('remove', 'bulk')}
                disabled={isLoading}
                color="red"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-auto"
              >
                Bulk Remove Present
              </GradientButton>
            </div>

            <GradientButton
              onClick={handleLoadAttendance}
              disabled={isLoading}
              color="blue"
              className="px-4 py-2 text-sm min-w-auto w-full sm:w-auto"
            >
              Load Attendance
            </GradientButton>

            {status && <p className="text-cyan-300 text-sm mt-3">{status}</p>}
            {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
          </GlassCard>

          {/* Attendance Calculator */}
          <GlassCard>
            <TextShimmer
              duration={2.5}
              spread={75}
              className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
            >
              Attendance Calculator
            </TextShimmer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <InputField
                label="Start Date (dd/mm/yyyy)"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                placeholder="dd/mm/yyyy"
              />
              <InputField
                label="End Date (dd/mm/yyyy)"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                placeholder="dd/mm/yyyy"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <GradientButton
                onClick={() => applyDatePreset('thisMonth')}
                color="blue"
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-auto"
              >
                This Month
              </GradientButton>
              <GradientButton
                onClick={() => applyDatePreset('last30')}
                color="blue"
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-auto"
              >
                Last 30 Days
              </GradientButton>
            </div>

            <GradientButton
              onClick={handleCalculate}
              disabled={isLoading}
              color="blue"
              className="px-4 py-2 text-sm min-w-auto w-full sm:w-auto"
            >
              Recalculate Now
            </GradientButton>

            {isAutoCalculating && (
              <p className="text-cyan-300 text-sm mt-2">Auto-calculating attendance...</p>
            )}

            {metrics && (
              <div className="mt-4 sm:mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <HolographicCard className="flex flex-col justify-between p-3 sm:p-4 min-h-fit">
                  <p className="text-xs text-gray-300">Days Recorded</p>
                  <p className="text-base sm:text-lg font-semibold">{daysRecorded}</p>
                </HolographicCard>
                <HolographicCard className="flex flex-col justify-between p-3 sm:p-4 min-h-fit">
                  <p className="text-xs text-gray-300">Attended</p>
                  <p className="text-base sm:text-lg font-semibold">{attendedDays}</p>
                </HolographicCard>
                <HolographicCard className="flex flex-col justify-between p-3 sm:p-4 min-h-fit">
                  <p className="text-xs text-gray-300">Absent</p>
                  <p className="text-base sm:text-lg font-semibold">{daysAbsent}</p>
                </HolographicCard>
                <HolographicCard className="flex flex-col justify-between p-3 sm:p-4 min-h-fit">
                  <p className="text-xs text-gray-300">Percentage</p>
                  <p className="text-base sm:text-lg font-semibold text-green-300">{percentage}%</p>
                </HolographicCard>
              </div>
            )}

            {prediction && (
              <div className="mt-4 bg-white/10 rounded-lg p-3 sm:p-4 border border-white/20">
                <p className="text-xs sm:text-sm text-cyan-300 mb-1">Prediction</p>
                <p className="text-sm sm:text-base text-white font-medium">{prediction.message}</p>
              </div>
            )}
          </GlassCard>

          {/* Date Lists at Bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <GlassCard>
              <TextShimmer
                duration={2.3}
                spread={70}
                className="text-lg sm:text-xl font-semibold mb-4"
              >
                Present Dates
              </TextShimmer>
              <div className="text-xs sm:text-sm">
                {sortedAttendedDates.length ? (
                  <ul className="space-y-1 sm:space-y-2 text-gray-200">
                    {sortedAttendedDates.map((entry) => (
                      <li key={`attended-${entry}`} className="py-1 border-b border-white/10 text-green-300">
                        {isoToDisplay(entry)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No entries yet</p>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <TextShimmer
                duration={2.3}
                spread={70}
                className="text-lg sm:text-xl font-semibold mb-4"
              >
                Absent Dates
              </TextShimmer>
              <div className="text-xs sm:text-sm">
                {sortedAbsentDates.length ? (
                  <ul className="space-y-1 sm:space-y-2 text-gray-200">
                    {sortedAbsentDates.map((entry) => (
                      <li key={`absent-${entry}`} className="py-1 border-b border-white/10 text-red-300">
                        {isoToDisplay(entry)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No absence records yet</p>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <TextShimmer
                duration={2.3}
                spread={70}
                className="text-lg sm:text-xl font-semibold mb-4"
              >
                Holiday Dates
              </TextShimmer>
              <div className="text-xs sm:text-sm">
                {sortedHolidayDates.length ? (
                  <ul className="space-y-1 sm:space-y-2 text-gray-200">
                    {sortedHolidayDates.map((entry) => (
                      <li key={`holiday-${entry}`} className="py-1 border-b border-white/10 text-blue-300">
                        {isoToDisplay(entry)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No holidays yet</p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
