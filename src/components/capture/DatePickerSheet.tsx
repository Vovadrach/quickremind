import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BottomSheet } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useI18n } from '@/hooks/useI18n';

interface DatePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function DatePickerSheet({ isOpen, onClose, selectedDate, onSelectDate }: DatePickerSheetProps) {
  const { copy, getWeekdaysShort, locale } = useI18n();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [tempSelectedDate, setTempSelectedDate] = useState<string | null>(selectedDate);

  const todayStr = today.toISOString().split('T')[0];
  const weekdays = getWeekdaysShort();

  useEffect(() => {
    if (!isOpen) return;
    const baseDate = selectedDate
      ? new Date(`${selectedDate}T00:00:00`)
      : new Date(`${todayStr}T00:00:00`);
    setCurrentMonth(baseDate.getMonth());
    setCurrentYear(baseDate.getFullYear());
    setTempSelectedDate(selectedDate ?? todayStr);
  }, [isOpen, selectedDate, todayStr]);

  const monthLabel = useMemo(() => {
    const label = new Date(currentYear, currentMonth, 1).toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [currentYear, currentMonth, locale]);

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of week for the first day (0 = Sunday, adjust for Monday start)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentMonth, currentYear]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setTempSelectedDate(dateStr);
  };

  const handleConfirm = () => {
    if (tempSelectedDate) {
      onSelectDate(tempSelectedDate);
    }
    onClose();
  };

  const isDateDisabled = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr < todayStr;
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={copy.capture.dateSheetTitle}>
      <div className="p-4">
        {/* Month/Year Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold text-[var(--color-text-primary)]">
            {monthLabel}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-[var(--color-text-tertiary)] py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === tempSelectedDate;
            const isDisabled = isDateDisabled(day);

            return (
              <motion.button
                key={day}
                whileTap={{ scale: isDisabled ? 1 : 0.9 }}
                onClick={() => !isDisabled && handleDayClick(day)}
                disabled={isDisabled}
                className={cn(
                  'aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  isSelected && 'bg-[var(--color-accent)] text-white',
                  isToday && !isSelected && 'ring-2 ring-[var(--color-accent)] text-[var(--color-accent)]',
                  !isSelected && !isToday && !isDisabled && 'hover:bg-[var(--color-bg-secondary)]',
                  isDisabled && 'text-[var(--color-text-tertiary)] opacity-50 cursor-not-allowed'
                )}
              >
                {day}
              </motion.button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <Button
            fullWidth
            onClick={handleConfirm}
            disabled={!tempSelectedDate || tempSelectedDate < todayStr}
          >
            {copy.capture.dateConfirm}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
