import type { RecurringTask, RecurrenceRule } from '@/types';

export function isSameDay(dateA: Date, dateB: Date): boolean {
  return dateA.toISOString().split('T')[0] === dateB.toISOString().split('T')[0];
}

export function getNextOccurrence(
  task: RecurringTask,
  fromDate: Date = new Date()
): Date | null {
  const { recurrence, time } = task;
  const [hours, minutes] = time.split(':').map(Number);

  switch (recurrence.type) {
    case 'daily':
      return getNextDailyOccurrence(fromDate, hours, minutes);
    case 'weekly':
      return getNextWeeklyOccurrence(fromDate, recurrence.daysOfWeek ?? [], hours, minutes);
    case 'monthly':
      return getNextMonthlyOccurrence(
        fromDate,
        recurrence.dayOfMonth ?? 1,
        Boolean(recurrence.isLastDayOfMonth),
        hours,
        minutes
      );
    case 'custom':
      return getNextCustomOccurrence(
        fromDate,
        recurrence.intervalValue ?? 1,
        recurrence.intervalUnit ?? 'days',
        hours,
        minutes,
        task.startDate
      );
    default:
      return null;
  }
}

export function getNextDailyOccurrence(fromDate: Date, hours: number, minutes: number): Date {
  const next = new Date(fromDate);
  next.setHours(hours, minutes, 0, 0);
  if (next <= fromDate) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

export function getNextWeeklyOccurrence(
  fromDate: Date,
  daysOfWeek: number[],
  hours: number,
  minutes: number
): Date {
  if (daysOfWeek.length === 0) {
    return getNextDailyOccurrence(fromDate, hours, minutes);
  }
  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
  const currentDay = fromDate.getDay();
  const currentTime = fromDate.getHours() * 60 + fromDate.getMinutes();
  const targetTime = hours * 60 + minutes;

  for (const day of sortedDays) {
    if (day > currentDay || (day === currentDay && targetTime > currentTime)) {
      const daysUntil = day - currentDay;
      const next = new Date(fromDate);
      next.setDate(next.getDate() + daysUntil);
      next.setHours(hours, minutes, 0, 0);
      return next;
    }
  }

  const daysUntilNextWeek = 7 - currentDay + sortedDays[0];
  const next = new Date(fromDate);
  next.setDate(next.getDate() + daysUntilNextWeek);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

export function getNextMonthlyOccurrence(
  fromDate: Date,
  dayOfMonth: number,
  isLastDay: boolean,
  hours: number,
  minutes: number
): Date {
  let year = fromDate.getFullYear();
  let month = fromDate.getMonth();

  const makeCandidate = (targetYear: number, targetMonth: number) => {
    const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
    const day = isLastDay ? lastDay : Math.min(dayOfMonth, lastDay);
    return new Date(targetYear, targetMonth, day, hours, minutes, 0, 0);
  };

  let candidate = makeCandidate(year, month);
  if (candidate <= fromDate) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    candidate = makeCandidate(year, month);
  }

  return candidate;
}

export function getNextCustomOccurrence(
  fromDate: Date,
  intervalValue: number,
  intervalUnit: RecurrenceRule['intervalUnit'],
  hours: number,
  minutes: number,
  startDate: string
): Date {
  const start = new Date(startDate);
  start.setHours(hours, minutes, 0, 0);

  if (start > fromDate) return start;

  const next = new Date(start);
  const safeInterval = Math.max(1, intervalValue);

  while (next <= fromDate) {
    switch (intervalUnit) {
      case 'weeks':
        next.setDate(next.getDate() + safeInterval * 7);
        break;
      case 'months':
        next.setMonth(next.getMonth() + safeInterval);
        break;
      case 'days':
      default:
        next.setDate(next.getDate() + safeInterval);
        break;
    }
  }

  return next;
}
