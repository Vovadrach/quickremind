import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = 'left', className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]',
              'border border-transparent',
              'placeholder:text-[var(--color-text-tertiary)]',
              'focus:outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)]',
              'transition-all duration-200',
              icon && iconPosition === 'left' && 'pl-11',
              icon && iconPosition === 'right' && 'pr-11',
              error && 'border-[var(--color-danger)]',
              className
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
              {icon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl resize-none',
            'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]',
            'border border-transparent',
            'placeholder:text-[var(--color-text-tertiary)]',
            'focus:outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)]',
            'transition-all duration-200',
            error && 'border-[var(--color-danger)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
