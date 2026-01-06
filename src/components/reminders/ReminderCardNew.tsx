import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useAppStore } from '@/store';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { PostponeSheet } from './PostponeSheet';
import { cn } from '@/utils/cn';
import type { Reminder } from '@/types';

interface ReminderCardNewProps {
  reminder: Reminder;
}

export function ReminderCardNew({ reminder }: ReminderCardNewProps) {
  const { completeReminder, removeReminder, openModal, modals, closeModal } = useAppStore();
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['rgb(239, 68, 68)', 'rgb(255, 255, 255)', 'rgb(16, 185, 129)']
  );
  const leftIconOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1]);
  const rightIconOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  // Countdown timer
  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const diff = reminder.targetTime - now;

      if (diff <= 0) {
        setIsOverdue(true);
        const overdueMinutes = Math.floor(Math.abs(diff) / 60000);
        if (overdueMinutes < 60) {
          setTimeLeft(`${overdueMinutes} хв тому`);
        } else {
          setTimeLeft(`${Math.floor(overdueMinutes / 60)} год тому`);
        }
        return;
      }

      setIsOverdue(false);
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (minutes < 1) {
        setTimeLeft(`${seconds} сек`);
      } else if (minutes < 60) {
        setTimeLeft(`${minutes} хв`);
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
          setTimeLeft(`${hours} год`);
        } else {
          setTimeLeft(`${hours} год ${remainingMinutes} хв`);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [reminder.targetTime]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return '';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра, ';
    } else {
      return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }) + ', ';
    }
  };

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x > 100) {
        // Swipe right - complete
        completeReminder(reminder.id);
      } else if (info.offset.x < -100) {
        // Swipe left - delete
        removeReminder(reminder.id);
      }
    },
    [reminder.id, completeReminder, removeReminder]
  );

  const handlePostpone = () => {
    openModal('postponeOptions', reminder.id);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-xl">
        {/* Background actions */}
        <motion.div
          className="absolute inset-0 flex items-center justify-between px-6"
          style={{ background }}
        >
          <motion.span style={{ opacity: leftIconOpacity }} className="text-2xl text-white">
            ✓
          </motion.span>
          <motion.span style={{ opacity: rightIconOpacity }} className="text-2xl text-white">
            🗑️
          </motion.span>
        </motion.div>

        {/* Card */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x }}
          whileTap={{ cursor: 'grabbing' }}
        >
          <Card variant="elevated" padding="md" className="cursor-grab">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <span className="text-2xl">{reminder.icon}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[var(--color-text-primary)] truncate">
                  {reminder.text || 'Нагадування'}
                </h3>
                <p
                  className={cn(
                    'text-sm mt-0.5',
                    isOverdue
                      ? 'text-[var(--color-danger)] font-medium'
                      : 'text-[var(--color-text-secondary)]'
                  )}
                >
                  {formatDate(reminder.targetTime)}
                  {formatTime(reminder.targetTime)} · {isOverdue ? '' : 'через '}
                  {timeLeft}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <IconButton
                  icon="⏰"
                  variant="ghost"
                  size="sm"
                  onClick={handlePostpone}
                  label="Відкласти"
                />
                <IconButton
                  icon="✓"
                  variant="success"
                  size="sm"
                  onClick={() => completeReminder(reminder.id)}
                  label="Виконано"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Postpone Sheet */}
      <PostponeSheet
        isOpen={modals.postponeOptions === reminder.id}
        onClose={() => closeModal('postponeOptions')}
        reminderId={reminder.id}
      />
    </>
  );
}
