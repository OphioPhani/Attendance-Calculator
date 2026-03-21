import { motion } from 'framer-motion';
import { GradientButton } from './GradientButton.jsx';

export const GlassCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`glass-card ${className}`}
  >
    {children}
  </motion.div>
);

export const InputField = ({ label, type = 'text', value, onChange, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium mb-2 text-secondary">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 bg-primary border rounded-lg text-tertiary placeholder-secondary focus:outline-none transition-all duration-200 ${
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
      }`}
      {...props}
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

export const Button = ({ children, isLoading = false, className = '', variant = 'default', ...props }) => (
  <GradientButton
    className={`w-full min-w-0 ${className}`}
    variant={variant}
    disabled={isLoading}
    {...props}
  >
    {isLoading ? 'Loading...' : children}
  </GradientButton>
);

export default { GlassCard, InputField, Button };
