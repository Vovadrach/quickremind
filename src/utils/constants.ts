export interface QuickTime {
  id: string;
  minutes: number;
  label: string;
  sublabel: string;
}

export const QUICK_TIMES: QuickTime[] = [
  { id: '5min',   minutes: 5,   label: '5 хв',   sublabel: 'через 5 хвилин' },
  { id: '10min',  minutes: 10,  label: '10 хв',  sublabel: 'через 10 хвилин' },
  { id: '15min',  minutes: 15,  label: '15 хв',  sublabel: 'через 15 хвилин' },
  { id: '30min',  minutes: 30,  label: '30 хв',  sublabel: 'через 30 хвилин' },
  { id: '45min',  minutes: 45,  label: '45 хв',  sublabel: 'через 45 хвилин' },
  { id: '1hr',    minutes: 60,  label: '1 год',  sublabel: 'через 1 годину' },
  { id: '2hr',    minutes: 120, label: '2 год',  sublabel: 'через 2 години' },
  { id: '3hr',    minutes: 180, label: '3 год',  sublabel: 'через 3 години' },
];

export const LIMITS = {
  MAX_REMINDERS: 10,
  MAX_TEXT_LENGTH: 100,
  MAX_HOURS: 23,
  MIN_MINUTES: 1,
  MINUTE_STEP: 5,
} as const;

export const STORAGE_KEY = 'quickremind-reminders';
