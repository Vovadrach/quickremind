import { useMemo } from 'react';
import { WheelPicker } from './WheelPicker';
import { cn } from '@/utils/cn';

interface TimePickerWheelProps {
  hours?: number;
  minutes?: number;
  selectedHour?: number;
  selectedMinute?: number;
  minuteStep?: number;
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
  minuteStep = 5,
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

  const minuteItems = useMemo(() => {
    const step = Math.max(1, Math.round(minuteStep));
    const count = Math.ceil(60 / step);
    return Array.from({ length: count }, (_, i) => i * step).filter((value) => value < 60);
  }, [minuteStep]);

  const resolvedMinute = useMemo(() => {
    if (!minuteItems.length) return 0;
    if (minuteItems.includes(currentMinute)) return currentMinute;
    return minuteItems.reduce(
      (nearest, item) =>
        Math.abs(item - currentMinute) < Math.abs(nearest - currentMinute) ? item : nearest,
      minuteItems[0]
    );
  }, [minuteItems, currentMinute]);

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
      <div className="flex-1 min-w-0">
        <WheelPicker
          items={hourItems}
          value={currentHour}
          onChange={handleHourChange}
          renderItem={renderHour}
          itemHeight={52}
          visibleItems={5}
          className="w-full"
        />
      </div>

      {/* Separator */}
      <div className="text-2xl font-bold text-[var(--color-text-secondary)]">:</div>

      {/* Minutes */}
      <div className="flex-1 min-w-0">
        <WheelPicker
          items={minuteItems}
          value={resolvedMinute}
          onChange={handleMinuteChange}
          renderItem={renderMinute}
          itemHeight={52}
          visibleItems={5}
          className="w-full"
        />
      </div>
    </div>
  );
}
