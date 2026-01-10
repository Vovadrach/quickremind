export * from './design';
export * from './achievements';
export * from './commands';

// App constants
export const APP_NAME = 'QuickRemind';
export const APP_VERSION = '2.0.0';

export const STORAGE_KEYS = {
  reminders: 'quickremind-reminders',
  commands: 'quickremind-commands',
  stats: 'quickremind-stats',
  settings: 'quickremind-settings',
} as const;

export const LIMITS = {
  MAX_REMINDERS: 50,
  MAX_COMMANDS: 20,
  MAX_TEXT_LENGTH: 100,
  MIN_MINUTES: 1,
  MAX_CATEGORIES: 10,
  MAX_TIME_OPTIONS: 4,
} as const;

// Time constants
export const TIME = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  ON_TIME_THRESHOLD: 5 * 60 * 1000, // ±5 minutes
} as const;

// Tab configuration
export const TABS = [
  { id: 'commands', label: 'Команды', icon: '📝' },
  { id: 'active', label: 'Активные', icon: '📋' },
  { id: 'capture', label: 'Создать', icon: '➕' },
  { id: 'stats', label: 'Стат.', icon: '📊' },
  { id: 'profile', label: 'Профиль', icon: '👤' },
] as const;
