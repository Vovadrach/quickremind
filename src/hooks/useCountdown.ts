import { useState, useEffect } from 'react';
import type { Language } from '@/types';
import { formatTimeLeft } from '@/utils/time';

interface CountdownResult {
  timeLeft: number;
  formatted: string;
  isExpired: boolean;
}

export function useCountdown(targetTime: number, language: Language = 'ru'): CountdownResult {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeLeft = Math.max(0, targetTime - now);
  const isExpired = timeLeft <= 0;
  const formatted = formatTimeLeft(targetTime, language);

  return { timeLeft, formatted, isExpired };
}

export function useCountdownCallback(
  targetTime: number,
  language: Language = 'ru',
  onExpire?: () => void
): CountdownResult {
  const result = useCountdown(targetTime, language);

  useEffect(() => {
    if (result.isExpired && onExpire) {
      onExpire();
    }
  }, [result.isExpired, onExpire]);

  return result;
}
