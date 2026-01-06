import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

type ProgressVariant = 'default' | 'success' | 'warning' | 'streak' | 'cp' | 'level';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const variantColors: Record<ProgressVariant, string> = {
  default: 'bg-[var(--color-accent)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  streak: 'bg-gradient-to-r from-orange-400 to-orange-600',
  cp: 'bg-gradient-to-r from-purple-400 to-purple-600',
  level: 'bg-gradient-to-r from-cyan-400 to-cyan-600',
};

const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1.5 rounded-full',
  md: 'h-2.5 rounded-full',
  lg: 'h-4 rounded-full',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm text-[var(--color-text-secondary)]">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-[var(--color-bg-secondary)] overflow-hidden',
          sizeStyles[size]
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full', variantColors[variant], sizeStyles[size])}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: ProgressVariant;
  showValue?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'default',
  showValue = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap: Record<ProgressVariant, string> = {
    default: 'var(--color-accent)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    streak: '#f97316',
    cp: '#8b5cf6',
    level: '#06b6d4',
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg-secondary)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-[var(--color-text-primary)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
