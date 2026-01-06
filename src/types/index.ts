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
  completedAt?: number;
  completedOnTime?: boolean;    // ±5 хв від targetTime
  sourceCommandId?: string;     // Якщо створено з Quick Command
}

export type ReminderStatus = 'pending' | 'completed' | 'missed' | 'cancelled';

export interface ReminderInput {
  text: string;
  minutes: number;
  icon?: string;
  targetDate?: string;
  sourceCommandId?: string;
}

// ====== QUICK COMMAND ======
export interface QuickCommand {
  id: string;
  icon: string;
  name: string;
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

// ====== SETTINGS ======
export interface AppSettings {
  notificationSound: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  language: 'uk' | 'en';
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
