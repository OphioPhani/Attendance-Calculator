import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services/attendanceService.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = useCallback(async (identifier, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ identifier, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMsg = err?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (username, email, mobile, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signup({
        username,
        email,
        mobile,
        password,
        confirmPassword,
      });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMsg = err?.message || 'Signup failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAuthenticated = !!localStorage.getItem('token');

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
  };
};

export default useAuth;
