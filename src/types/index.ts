// ====== REMINDER ======
export interface Reminder {
  id: string;
  text: string | null;
  icon: string;
  targetTime: number;           // Unix timestamp
  targetDate: string;           // YYYY-MM-DD
  createdAt: number;
  notificationId: string;
  status: ReminderStatus;
  note?: string | null;
  completedAt?: number;
  completedOnTime?: boolean;    // ±5 хв від targetTime
  sourceCommandId?: string;     // Якщо створено з Quick Command
  beeModeEnabled: boolean;
  beeNotificationIds: string[];
  beeCurrentStage: number;
  beeLastNotificationAt: number | null;
  recurringTaskId?: string;
  isRecurringInstance?: boolean;
}

export type ReminderStatus = 'pending' | 'completed' | 'missed' | 'cancelled';

export interface ReminderInput {
  text: string;
  minutes: number;
  icon?: string;
  targetTime?: number;
  targetDate?: string;
  sourceCommandId?: string;
  note?: string;
  beeModeEnabled?: boolean;
  recurringTaskId?: string;
  isRecurringInstance?: boolean;
  silent?: boolean;
}

// ====== QUICK COMMAND ======
export interface QuickCommand {
  id: string;
  icon: string;
  name: string;
  note?: string | null;
  categoryId: string;
  timeOptions: TimeOption[];
  createdAt: number;
  usageCount: number;
}

export interface TimeOption {
  type: 'relative' | 'absolute';
  value: number | string;       // minutes for relative, "HH:MM" for absolute
  label: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

// ====== STATS ======
export interface DailyStats {
  date: string;                 // YYYY-MM-DD
  captured: number;
  completed: number;
  completedOnTime: number;
  missed: number;
  cpEarned: number;
}

export interface UserStats {
  totalCaptured: number;
  totalCompleted: number;
  totalCP: number;
  currentStreak: number;
  longestStreak: number;
  bestDayCP: number;
  level: number;
  achievements: string[];       // Achievement IDs
  lastActiveDate: string;       // YYYY-MM-DD for streak calculation
}

// ====== ACHIEVEMENT ======
export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  cpReward: number;
  condition: AchievementCondition;
  unlockedAt?: number;
}

export type AchievementCondition =
  | { type: 'totalCaptured'; value: number }
  | { type: 'totalCompleted'; value: number }
  | { type: 'streak'; value: number }
  | { type: 'commandsCreated'; value: number }
  | { type: 'speedCapture'; value: number }    // seconds
  | { type: 'dailyCP'; value: number }
  | { type: 'totalCP'; value: number };

export type Language = 'ru' | 'uk' | 'en';

// ====== SETTINGS ======
export interface AppSettings {
  notificationSound: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  language: Language;
}

// ====== BEE MODE ======
export interface BeeModeSettings {
  enabled: boolean;
  intervals: number[];
  repeatInterval: number;
  repeatEnabled: boolean;
  quietHoursStart: string; // HH:MM
  quietHoursEnd: string;   // HH:MM
}

// ====== RECURRING TASKS ======
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RecurrenceRule {
  type: RecurrenceType;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  isLastDayOfMonth?: boolean;
  intervalValue?: number;
  intervalUnit?: 'days' | 'weeks' | 'months';
}

export interface RecurringTaskStats {
  totalGenerated: number;
  totalCompleted: number;
  totalMissed: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt: number | null;
}

export interface RecurringTask {
  id: string;
  icon: string;
  name: string;
  note?: string | null;
  recurrence: RecurrenceRule;
  time: string; // HH:MM
  beeModeEnabled: boolean;
  isActive: boolean;
  createdAt: number;
  startDate: string; // YYYY-MM-DD
  stats: RecurringTaskStats;
}

// ====== UI STATE ======
export type TabId = 'commands' | 'active' | 'capture' | 'stats' | 'profile';

export interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
  icon?: string;
  cpAmount?: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'achievement';

// ====== MODAL STATE ======
export interface ModalState {
  commandEditor: boolean;
  datePicker: boolean;
  reminderDetail: string | null;  // reminder id
  achievementDetail: string | null;  // achievement id
  allAchievements: boolean;
  postponeOptions: string | null;  // reminder id
}
