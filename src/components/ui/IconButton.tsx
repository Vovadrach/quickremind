import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'danger' | 'success';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends HTMLMotionProps<'button'> {
  icon: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]',
  primary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]',
  ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]',
  danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] hover:bg-red-100',
  success: 'bg-[var(--color-success-bg)] text-[var(--color-success)] hover:bg-emerald-100',
};

const sizeStyles: Record<IconButtonSize, { button: string; icon: string }> = {
  sm: { button: 'w-8 h-8 rounded-lg', icon: 'text-base' },
  md: { button: 'w-10 h-10 rounded-xl', icon: 'text-lg' },
  lg: { button: 'w-12 h-12 rounded-xl', icon: 'text-xl' },
};

export function IconButton({
  icon,
  variant = 'default',
  size = 'md',
  label,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size].button,
        className
      )}
      disabled={disabled}
      aria-label={label}
      {...props}
    >
      <span className={sizeStyles[size].icon}>{icon}</span>
    </motion.button>
  );
}

interface IconButtonWithLabelProps extends IconButtonProps {
  label: string;
}

export function IconButtonWithLabel({
  icon,
  label,
  variant = 'default',
  size = 'md',
  disabled,
  className,
  ...props
}: IconButtonWithLabelProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'default' && 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]',
        variant === 'primary' && 'text-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]',
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
}
