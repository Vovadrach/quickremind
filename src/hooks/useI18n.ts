import { useAppStore } from '@/store';
import {
  getCopy,
  getLocale,
  formatMessage,
  formatCount,
  getLanguageLabel,
  getAchievementCopy,
  getLevelName,
  getWeekdaysShort,
  LANGUAGE_OPTIONS,
} from '@/i18n';
import type { Language } from '@/types';

type NounKey = 'day' | 'thought' | 'reminder' | 'command';

export function useI18n() {
  const language = useAppStore((state) => state.settings.language) as Language;
  const copy = getCopy(language);

  return {
    language,
    copy,
    locale: getLocale(language),
    languageOptions: LANGUAGE_OPTIONS,
    formatMessage,
    formatCount: (count: number, noun: NounKey) => formatCount(language, count, noun),
    getLanguageLabel,
    getAchievementCopy: (id: string) => getAchievementCopy(language, id),
    getLevelName: (level: number) => getLevelName(language, level),
    getWeekdaysShort: () => getWeekdaysShort(language),
  };
}
