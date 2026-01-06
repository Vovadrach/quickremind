import { useMemo } from 'react';
import { WheelPicker } from './WheelPicker';
import { cn } from '@/utils/cn';

interface TimePickerWheelProps {
  hours?: number;
  minutes?: number;
  selectedHour?: number;
  selectedMinute?: number;
  onHoursChange?: (hours: number) => void;
  onMinutesChange?: (minutes: number) => void;
  onHourChange?: (hours: number) => void;
  onMinuteChange?: (minutes: number) => void;
  className?: string;
}

export function TimePickerWheel({
  hours,
  minutes,
  selectedHour,
  selectedMinute,
  onHoursChange,
  onMinutesChange,
  onHourChange,
  onMinuteChange,
  className,
}: TimePickerWheelProps) {
  // Support both prop naming conventions
  const currentHour = selectedHour ?? hours ?? 0;
  const currentMinute = selectedMinute ?? minutes ?? 0;
  const handleHourChange = onHourChange ?? onHoursChange ?? (() => {});
  const handleMinuteChange = onMinuteChange ?? onMinutesChange ?? (() => {});

  const hourItems = useMemo(
    () => Array.from({ length: 24 }, (_, i) => i),
    []
  );

  const minuteItems = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i * 5),
    []
  );

  const renderHour = (hour: number, isSelected: boolean) => (
    <span
      className={cn(
        'text-3xl font-semibold transition-all duration-150',
        isSelected
          ? 'text-[var(--color-text-primary)] scale-100'
          : 'text-[var(--color-text-tertiary)] scale-90 opacity-60'
      )}
    >
      {hour.toString().padStart(2, '0')}
    </span>
  );

  const renderMinute = (minute: number, isSelected: boolean) => (
    <span
      className={cn(
        'text-3xl font-semibold transition-all duration-150',
        isSelected
          ? 'text-[var(--color-text-primary)] scale-100'
          : 'text-[var(--color-text-tertiary)] scale-90 opacity-60'
      )}
    >
      {minute.toString().padStart(2, '0')}
    </span>
  );

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {/* Hours */}
      <div className="flex-1 max-w-[100px]">
        <WheelPicker
          items={hourItems}
          value={currentHour}
          onChange={handleHourChange}
          renderItem={renderHour}
          itemHeight={52}
          visibleItems={5}
        />
      </div>

      {/* Separator */}
      <div className="text-2xl font-bold text-[var(--color-text-secondary)]">:</div>

      {/* Minutes */}
      <div className="flex-1 max-w-[100px]">
        <WheelPicker
          items={minuteItems}
          value={currentMinute}
          onChange={handleMinuteChange}
          renderItem={renderMinute}
          itemHeight={52}
          visibleItems={5}
        />
      </div>
    </div>
  );
}
