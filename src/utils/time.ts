import type { Language } from '@/types';
import { getCopy, getLocale, getTimeUnitLabel } from '@/i18n';

/**
 * Форматує залишок часу в читабельний вигляд
 */
export function formatTimeLeft(targetTime: number, language: Language = 'ru'): string {
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return getCopy(language).time.now;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours === 0 && minutes === 0) {
    return formatSecondsShort(seconds, language);
  }

  if (hours === 0) {
    return formatMinutesShort(minutes, language);
  }

  if (minutes === 0) {
    return `${hours} ${getTimeUnitLabel(language, 'hour')}`;
  }

  return `${hours} ${getTimeUnitLabel(language, 'hour')} ${minutes} ${getTimeUnitLabel(language, 'minute')}`;
}

/**
 * Форматує час у форматі HH:MM
 */
export function formatTime(timestamp: number, language: Language = 'ru'): string {
  return new Date(timestamp).toLocaleTimeString(getLocale(language), {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Форматує дату у форматі "5 січ."
 */
export function formatDateShort(timestamp: number, language: Language = 'ru'): string {
  return new Date(timestamp).toLocaleDateString(getLocale(language), {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Короткий формат для хвилин/годин
 */
export function formatMinutesShort(totalMinutes: number, language: Language = 'ru'): string {
  if (totalMinutes < 60) {
    return `${totalMinutes} ${getTimeUnitLabel(language, 'minute')}`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} ${getTimeUnitLabel(language, 'hour')}`;
  }

  return `${hours} ${getTimeUnitLabel(language, 'hour')} ${minutes} ${getTimeUnitLabel(language, 'minute')}`;
}

/**
 * Короткий формат для секунд
 */
export function formatSecondsShort(seconds: number, language: Language = 'ru'): string {
  return `${seconds} ${getTimeUnitLabel(language, 'second')}`;
}

/**
 * Конвертує години та хвилини в загальну кількість хвилин
 */
export function toMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

/**
 * Конвертує хвилини в години та хвилини
 */
export function fromMinutes(totalMinutes: number): { hours: number; minutes: number } {
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

/**
 * Генерує масив годин (0-23)
 */
export function generateHours(max: number = 23): number[] {
  return Array.from({ length: max + 1 }, (_, i) => i);
}

/**
 * Генерує масив хвилин з кроком
 */
export function generateMinutes(step: number = 5): number[] {
  return Array.from({ length: 60 / step }, (_, i) => i * step);
}
