import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlassCard, InputField, Button } from '../components/FormComponents.jsx';
import useAuth from '../hooks/useAuth.js';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await signup(
        formData.username,
        formData.email,
        formData.mobile,
        formData.password,
        formData.confirmPassword
      );
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error?.message || 'Signup failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-300">Join Attendance Calculator</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                placeholder="Choose a username"
              />

              <InputField
                label="Email (optional)"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="your@email.com"
              />

              <InputField
                label="Mobile (optional)"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                error={errors.mobile}
                placeholder="10-digit mobile number"
              />

              <InputField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="At least 6 characters"
              />

              <InputField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
              />

              {errors.submit && (
                <p className="text-red-400 text-sm p-2 bg-red-500/10 rounded-lg">{errors.submit}</p>
              )}

              <Button isLoading={isLoading} type="submit">
                Create Account
              </Button>
            </form>

            <p className="text-center text-gray-300 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign in
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
