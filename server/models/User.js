import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, hyphens, and underscores',
      ],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      index: true, // For faster queries
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [12, 'Password must be at least 12 characters'],
      select: false, // Never return password in queries by default
      validate: {
        validator: function (v) {
          // Password must contain uppercase, lowercase, number, and special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(
            v
          );
        },
        message:
          'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)',
      },
    },

    // ============================================
    // Security Fields
    // ============================================

    // Failed login attempts tracking
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },

    // Password change history (prevent reuse)
    passwordHistory: [
      {
        password: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Last password change timestamp
    passwordChangedAt: Date,

    // JWT Token blacklist for logout
    tokenBlacklist: [
      {
        token: String,
        blacklistedAt: {
          type: Date,
          default: Date.now,
          expires: 604800, // TTL: 7 days (auto-delete after expiry)
        },
      },
    ],

    // Account status
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },

    // IP address whitelist for enhanced security (optional)
    trustedIPs: [
      {
        ipAddress: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Last login details (for security audit)
    lastLogin: {
      timestamp: Date,
      ipAddress: String,
      userAgent: String,
    },

    // Account recovery
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },

    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better performance on queries
userSchema.index({ username: 1, email: 1, mobile: 1 });
userSchema.index({ lastLogin: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();

  try {
    // Hash password with bcrypt (salt rounds: 12)
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(this.password, salt);

    // Keep password history (last 5 passwords)
    if (!this.passwordHistory) {
      this.passwordHistory = [];
    }

    this.passwordHistory.push({
      password: this.password, // Store old plaintext temporarily
      changedAt: new Date(),
    });

    // Keep only last 5 passwords
    if (this.passwordHistory.length > 5) {
      this.passwordHistory = this.passwordHistory.slice(-5);
    }

    this.password = hashedPassword;
    this.passwordChangedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to check if account is locked
userSchema.methods.isLocked = function () {
  // If lockUntil doesn't exist, account is not locked
  if (!this.lockUntil) return false;

  // If lockUntil is in the past, unlock the account
  if (this.lockUntil < Date.now()) {
    this.loginAttempts = 0;
    this.lockUntil = null;
    return false;
  }

  // Account is locked
  return true;
};

// Method to increment failed login attempts
userSchema.methods.incLoginAttempts = function () {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  // Increment login attempts
  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 15 minutes
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + 15 * 60 * 1000) };
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

// Method to add token to blacklist
userSchema.methods.blacklistToken = function (token) {
  if (!this.tokenBlacklist) {
    this.tokenBlacklist = [];
  }

  this.tokenBlacklist.push({
    token,
    blacklistedAt: new Date(),
  });

  return this.save();
};

// Method to check if token is blacklisted
userSchema.methods.isTokenBlacklisted = function (token) {
  if (!this.tokenBlacklist) return false;
  return this.tokenBlacklist.some((entry) => entry.token === token);
};

// Method to record last login
userSchema.methods.recordLoginSuccess = function (ipAddress, userAgent) {
  return this.updateOne({
    $set: {
      lastLogin: {
        timestamp: new Date(),
        ipAddress,
        userAgent,
      },
      loginAttempts: 0,
    },
    $unset: { lockUntil: 1 },
  });
};

export default mongoose.model('User', userSchema);
