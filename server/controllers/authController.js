import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';

// Generate JWT Token with expiration
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Short-lived token (15 minutes)
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET + '_refresh', {
    expiresIn: '7d',
  });
};

/**
 * @desc    User Signup
 * @route   POST /api/auth/signup
 * @access  Public
 * @security Input validation, rate limiting, password hashing
 */
export const signup = expressAsyncHandler(async (req, res, next) => {
  const { username, email, mobile, password, confirmPassword } = req.body;

  // Password match validation (already validated in middleware)
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match',
    });
  }

  // Check if user already exists
  const duplicateChecks = [{ username }];
  if (email) duplicateChecks.push({ email });
  if (mobile) duplicateChecks.push({ mobile });

  const existingUser = await User.findOne({
    $or: duplicateChecks,
  });

  if (existingUser) {
    let field = 'Username';
    if (existingUser.email === email) field = 'Email';
    if (existingUser.mobile === mobile) field = 'Mobile number';

    return res.status(409).json({
      success: false,
      message: `${field} already in use`,
    });
  }

  // Create user with encrypted password
  const user = await User.create({
    username,
    email: email || undefined,
    mobile: mobile || undefined,
    password,
    status: 'active',
  });

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Return response (no sensitive data)
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
    },
  });
});

/**
 * @desc    User Login
 * @route   POST /api/auth/login
 * @access  Public
 * @security Rate limiting, account lockout, audit logging
 */
export const login = expressAsyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body;
  const clientIP = req.ip;
  const userAgent = req.get('user-agent');

  // Find user by username, email, or mobile
  const user = await User.findOne({
    $or: [
      { username: identifier },
      { email: identifier },
      { mobile: identifier },
    ],
  }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if account is locked
  if (user.isLocked()) {
    return res.status(429).json({
      success: false,
      message: 'Account locked due to too many failed login attempts. Try again in 15 minutes.',
    });
  }

  // Check if account is suspended
  if (user.status === 'suspended') {
    return res.status(403).json({
      success: false,
      message: 'Account is suspended. Contact administrator.',
    });
  }

  // Verify password
  const isPasswordCorrect = await user.matchPassword(password);

  if (!isPasswordCorrect) {
    // Increment failed login attempts
    await user.incLoginAttempts();

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Account is locked (after failed attempts)
  if (user.isLocked()) {
    return res.status(429).json({
      success: false,
      message: 'Account locked due to too many failed login attempts. Try again in 15 minutes.',
    });
  }

  // Reset failed login attempts on successful login
  await user.recordLoginSuccess(clientIP, userAgent);

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Return response
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
    },
  });
});

/**
 * @desc    Refresh Token
 * @route   POST /api/auth/refresh
 * @access  Public
 * @security Validate refresh token and issue new access token
 */
export const refreshToken = expressAsyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required',
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET + '_refresh');

    // Find user
    const user = await User.findById(decoded.id);

    if (!user || user.status === 'suspended') {
      return res.status(401).json({
        success: false,
        message: 'User not found or account suspended',
      });
    }

    // Generate new access token
    const newToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
});

/**
 * @desc    Logout
 * @route   POST /api/auth/logout
 * @access  Private
 * @security Blacklist token to prevent reuse
 */
export const logout = expressAsyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token && req.user) {
    const user = await User.findById(req.user.id);
    if (user) {
      await user.blacklistToken(token);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Change Password
 * @route   POST /api/auth/change-password
 * @access  Private
 * @security Require old password verification
 */
export const changePassword = expressAsyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Validate new password
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'New passwords do not match',
    });
  }

  // Find user with password field
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Verify old password
  const isPasswordCorrect = await user.matchPassword(oldPassword);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Check if new password was used before (last 5 passwords)
  if (user.passwordHistory && user.passwordHistory.length > 0) {
    for (const oldPass of user.passwordHistory) {
      const wasUsed = await bcryptjs.compare(newPassword, oldPass.password);
      if (wasUsed) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reuse previous passwords. Please choose a different password.',
        });
      }
    }
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Reset login attempts and unlock account
  await user.resetLoginAttempts();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

export default {
  signup,
  login,
  refreshToken,
  logout,
  changePassword,
};
