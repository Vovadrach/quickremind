import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { LIMITS } from '@/utils/constants';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      value,
      onChange,
      placeholder = 'Про що нагадати?',
      maxLength = LIMITS.MAX_TEXT_LENGTH,
      className,
    },
    ref
  ) {
    const showCounter = value.length > maxLength - 20;
    const isNearLimit = value.length > maxLength - 10;

    return (
      <div className={cn('relative', className)}>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            'w-full px-4 py-3',
            'bg-bg-secondary rounded-xl',
            'text-base text-text-primary placeholder:text-text-tertiary',
            'border-2 border-transparent',
            'focus:outline-none focus:border-accent focus:bg-bg-elevated',
            'transition-all duration-200'
          )}
        />

        {/* Clear button */}
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange('')}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'w-6 h-6 rounded-full',
              'bg-text-tertiary/20 hover:bg-text-tertiary/30',
              'flex items-center justify-center',
              'transition-colors duration-150'
            )}
            aria-label="Очистити"
          >
            <svg
              className="w-4 h-4 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Character counter */}
        {showCounter && (
          <span
            className={cn(
              'absolute right-3 -bottom-5 text-xs',
              isNearLimit ? 'text-warning' : 'text-text-tertiary'
            )}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);
