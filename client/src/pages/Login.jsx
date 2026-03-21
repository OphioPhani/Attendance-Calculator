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

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!identifier) {
      setErrors({ identifier: 'Username, email, or mobile is required' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    try {
      await login(identifier, password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error?.message || 'Login failed' });
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
            Attendance Calculator
          </h1>
          <p className="text-gray-300">Sign in to your account</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Username, Email, or Mobile"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                error={errors.identifier}
                placeholder="Enter your username, email, or mobile"
              />

              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
              />

              {errors.submit && (
                <p className="text-red-400 text-sm p-2 bg-red-500/10 rounded-lg">{errors.submit}</p>
              )}

              <Button isLoading={isLoading} type="submit">
                Sign In
              </Button>
            </form>

            <p className="text-center text-gray-300 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign up
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
