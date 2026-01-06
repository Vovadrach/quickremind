import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title = 'Немає активних нагадувань',
  description = 'Оберіть час вище, щоб створити нагадування',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6',
        'text-center',
        className
      )}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
        {icon ? (
          <span className="text-3xl">{icon}</span>
        ) : (
          <svg
            className="w-8 h-8 text-[var(--color-text-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {description}
      </p>
    </div>
  );
}
