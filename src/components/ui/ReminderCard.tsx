import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useCountdown } from '@/hooks/useCountdown';
import { formatTime } from '@/utils/time';
import { useI18n } from '@/hooks/useI18n';
import type { Reminder } from '@/types/reminder';

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: () => void;
}

export function ReminderCard({ reminder, onDelete }: ReminderCardProps) {
  const { copy, language } = useI18n();
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const deleteOpacity = useTransform(x, [-100, -50], [1, 0]);
  const cardOpacity = useTransform(x, [-200, -100], [0.5, 1]);

  const { formatted, isExpired } = useCountdown(reminder.targetTime, language);
  const targetTimeStr = formatTime(reminder.targetTime, language);

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleDrag = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - startX.current;
    // Only allow swiping left
    const newX = Math.min(0, deltaX);
    x.set(newX);
  }, [x]);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    const currentX = x.get();

    if (currentX < -100) {
      // Delete
      animate(x, -300, { duration: 0.2 });
      setTimeout(() => {
        onDelete();
        if (navigator.vibrate) {
          navigator.vibrate(20);
        }
      }, 200);
    } else {
      // Snap back
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  }, [x, onDelete]);

  return (
    <div className="relative overflow-hidden rounded-xl mb-2">
      {/* Delete background */}
      <motion.div
        className="absolute inset-y-0 right-0 w-24 bg-danger flex items-center justify-center rounded-xl"
        style={{ opacity: deleteOpacity }}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </motion.div>

      {/* Card */}
      <motion.div
        className={cn(
          'flex items-center gap-3 p-4',
          'bg-bg-elevated rounded-xl shadow-soft-sm',
          'cursor-grab active:cursor-grabbing touch-pan-y'
        )}
        style={{ x, opacity: cardOpacity }}
        onPointerDown={handleDragStart}
        onPointerMove={handleDrag}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        {/* Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            isExpired ? 'bg-danger-bg' : 'bg-accent-bg'
          )}
        >
          <svg
            className={cn('w-5 h-5', isExpired ? 'text-danger' : 'text-accent')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-text-primary truncate">
            {reminder.text || copy.active.reminderFallback}
          </p>
          <p className={cn('text-sm', isExpired ? 'text-danger' : 'text-text-tertiary')}>
            {isExpired ? copy.active.timeExpired : `${copy.active.timeLeftPrefix} ${formatted}`}
          </p>
          {reminder.note && (
            <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
              {reminder.note}
            </p>
          )}
        </div>

        {/* Time */}
        <span className="text-sm font-medium text-text-secondary flex-shrink-0">
          {targetTimeStr}
        </span>
      </motion.div>
    </div>
  );
}
