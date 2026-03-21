// Predefined holidays for Telangana region
const TELANGANA_HOLIDAYS = [
  '2024-01-26', // Republic Day
  '2024-03-08', // Maha Shivaratri
  '2024-03-25', // Holi
  '2024-04-11', // Eid ul-Fitr
  '2024-04-21', // Ram Navami
  '2024-04-17', // Ram Navami (alternative)
  '2024-05-23', // Buddha Purnima
  '2024-06-17', // Eid ul-Adha
  '2024-07-17', // Muharram
  '2024-08-15', // Independence Day
  '2024-08-26', // Janmashtami
  '2024-09-16', // Milad un-Nabi
  '2024-10-02', // Gandhi Jayanti
  '2024-10-12', // Dussehra
  '2024-10-31', // Diwali
  '2024-11-01', // Diwali (alternative)
  '2024-11-15', // Guru Nanak Jayanti
  '2024-12-25', // Christmas
];

// Helper function to get all Sundays in a date range
const getSundays = (startDate, endDate) => {
  const sundays = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    if (current.getDay() === 0) {
      sundays.push(current.toISOString().split('T')[0]);
    }
    current.setDate(current.getDate() + 1);
  }

  return sundays;
};

// Helper function to get all second Saturdays in a date range
const getSecondSaturdays = (startDate, endDate) => {
  const secondSaturdays = [];
  let currentMonth = new Date(startDate);

  while (currentMonth <= endDate) {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get all Saturdays in the month
    const saturdays = [];
    const temp = new Date(year, month, 1);

    while (temp.getMonth() === month) {
      if (temp.getDay() === 6) {
        saturdays.push(new Date(temp));
      }
      temp.setDate(temp.getDate() + 1);
    }

    // Add second Saturday if it exists and is within range
    if (saturdays.length > 1) {
      const secondSaturday = saturdays[1];
      if (secondSaturday >= startDate && secondSaturday <= endDate) {
        secondSaturdays.push(secondSaturday.toISOString().split('T')[0]);
      }
    }

    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  return secondSaturdays;
};

/**
 * Calculate attendance metrics
 * @param {Date} startDate - Start date of semester
 * @param {Date} endDate - End date of semester
 * @param {Array} attendedDates - Array of attended dates (YYYY-MM-DD format)
 * @param {Array} absentDates - Array of absent dates (YYYY-MM-DD format)
 * @param {Array} customHolidays - Array of custom holidays (YYYY-MM-DD format)
 * @returns {Object} - Attendance metrics
 */
export const calculateAttendance = (
  startDate,
  endDate,
  attendedDates = [],
  absentDates = [],
  customHolidays = []
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Get all holidays to exclude (Sundays are automatically holidays)
  const sundays = new Set(getSundays(start, end));
  const secondSaturdays = new Set(getSecondSaturdays(start, end));
  const allHolidays = new Set([
    ...sundays,
    ...secondSaturdays,
    ...TELANGANA_HOLIDAYS,
    ...customHolidays,
  ]);

  // Count attended days (exclude holidays)
  let attendedDays = 0;
  attendedDates.forEach((date) => {
    if (!allHolidays.has(date)) {
      attendedDays++;
    }
  });

  // Count absent days (exclude holidays)
  let daysAbsent = 0;
  absentDates.forEach((date) => {
    if (!allHolidays.has(date)) {
      daysAbsent++;
    }
  });

  // Days conducted = attended + absent (days on which attendance was recorded)
  const daysRecorded = attendedDays + daysAbsent;

  // Calculate percentage using: days attended / days recorded
  const percentage =
    daysRecorded > 0 ? ((attendedDays / daysRecorded) * 100).toFixed(2) : 0;

  return {
    attendedDays,
    daysAbsent,
    daysRecorded,
    percentage: parseFloat(percentage),
  };
};

/**
 * Calculate classes needed to reach target attendance
 * @param {number} currentPercentage - Current attendance percentage
 * @param {number} attendedDays - Already attended days
 * @param {number} targetPercentage - Target attendance percentage (default: 75)
 * @returns {Object} - Classes needed and safe misses
 */
export const calculatePrediction = (
  currentPercentage,
  attendedDays,
  targetPercentage = 75
) => {
  // If already above target, return 0 classes needed
  if (currentPercentage >= targetPercentage) {
    return {
      classesNeeded: 0,
      safeMisses: attendedDays, // Can miss any number of remaining classes
      messageType: 'success',
      message: `You're already at ${currentPercentage}% attendance!`,
    };
  }

  // Calculate classes needed using formula:
  // (attended + x) / (working + x) = target / 100
  // x = (target * working - 100 * attended) / (100 - target)

  let classesNeeded = 0;
  let safeMisses = 0;

  // Assuming average 50 working days per semester remaining
  const remainingWorkingDays = 50;

  // Calculate classes needed
  const numerator = targetPercentage * (attendedDays + remainingWorkingDays) - 100 * attendedDays;
  const denominator = 100 - targetPercentage;

  if (denominator > 0) {
    classesNeeded = Math.ceil(numerator / denominator);
  }

  // Ensure non-negative
  classesNeeded = Math.max(0, classesNeeded);
  safeMisses = Math.max(0, remainingWorkingDays - classesNeeded);

  return {
    classesNeeded,
    safeMisses,
    targetPercentage,
    messageType: classesNeeded <= 5 ? 'warning' : classesNeeded <= 10 ? 'info' : 'error',
    message:
      classesNeeded === 0
        ? `You're already above ${targetPercentage}%`
        : `Attend ${classesNeeded} more classes to reach ${targetPercentage}%`,
  };
};

export default { calculateAttendance, calculatePrediction };
