import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const variantStyles = {
  elevated: 'bg-[var(--color-bg-elevated)] shadow-md',
  outlined: 'bg-[var(--color-bg-elevated)] border border-[var(--color-border-light)]',
  filled: 'bg-[var(--color-bg-secondary)]',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileTap={interactive ? { scale: 0.98 } : undefined}
      className={cn(
        'rounded-xl transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        interactive && 'cursor-pointer hover:shadow-lg active:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ children, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      <div className="font-semibold text-[var(--color-text-primary)]">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}
