/**
 * Форматує залишок часу в читабельний вигляд
 */
export function formatTimeLeft(targetTime: number): string {
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return 'зараз';
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours === 0 && minutes === 0) {
    return `${seconds} сек`;
  }

  if (hours === 0) {
    return `${minutes} хв`;
  }

  if (minutes === 0) {
    return `${hours} год`;
  }

  return `${hours} год ${minutes} хв`;
}

/**
 * Форматує час у форматі HH:MM
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
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
