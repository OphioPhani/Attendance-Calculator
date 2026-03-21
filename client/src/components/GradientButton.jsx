import { cn } from '@/utils/cn';

const GradientButton = ({
  children,
  color = 'default',
  className = '',
  ...props
}) => {
  const colorClass = {
    green: 'btn-success',
    red: 'btn-danger',
    blue: 'btn-info',
    default: 'btn-default',
  }[color];

  return (
    <button
      className={cn(
        'btn-base btn-lg',
        colorClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

GradientButton.displayName = 'GradientButton';

export { GradientButton };
