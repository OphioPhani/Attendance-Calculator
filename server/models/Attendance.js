import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      enum: [
        '1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2',
        'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8',
      ],
    },
    attendedDates: [
      {
        type: String,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      },
    ],
    absentDates: [
      {
        type: String,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      },
    ],
    customHolidays: [
      {
        type: String,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      },
    ],
  },
  {
    timestamps: true,
    // Ensure no duplicate dates
    strict: true,
  }
);

// Index for faster queries
attendanceSchema.index({ userId: 1, semester: 1 }, { unique: true });

// Pre-save middleware to remove duplicates
attendanceSchema.pre('save', function (next) {
  // Remove duplicates from attendedDates
  this.attendedDates = [...new Set(this.attendedDates)];
  // Remove duplicates from absentDates
  this.absentDates = [...new Set(this.absentDates)];
  // Remove duplicates from customHolidays
  this.customHolidays = [...new Set(this.customHolidays)];
  next();
});

export default mongoose.model('Attendance', attendanceSchema);
