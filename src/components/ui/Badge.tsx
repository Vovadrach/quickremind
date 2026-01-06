import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'streak' | 'cp' | 'achievement';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]',
  success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  streak: 'bg-orange-100 text-orange-600',
  cp: 'bg-purple-100 text-purple-600',
  achievement: 'bg-amber-100 text-amber-600',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

interface StatBadgeProps {
  value: number | string;
  label: string;
  icon?: string;
  variant?: BadgeVariant;
  className?: string;
}

export function StatBadge({
  value,
  label,
  icon,
  variant = 'default',
  className,
}: StatBadgeProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center p-3 rounded-xl',
        variant === 'streak' && 'bg-orange-50',
        variant === 'cp' && 'bg-purple-50',
        variant === 'achievement' && 'bg-amber-50',
        variant === 'success' && 'bg-emerald-50',
        variant === 'default' && 'bg-[var(--color-bg-secondary)]',
        className
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-lg">{icon}</span>}
        <span
          className={cn(
            'text-2xl font-bold',
            variant === 'streak' && 'text-orange-600',
            variant === 'cp' && 'text-purple-600',
            variant === 'achievement' && 'text-amber-600',
            variant === 'success' && 'text-emerald-600',
            variant === 'default' && 'text-[var(--color-text-primary)]'
          )}
        >
          {value}
        </span>
      </div>
      <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
    </div>
  );
}
