import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Reminder,
  ReminderInput,
  QuickCommand,
  Category,
  DailyStats,
  UserStats,
  AppSettings,
  ToastState,
  ToastType,
  TabId,
  ModalState,
} from '@/types';
import { generateId } from '@/utils/id';
import { formatMinutesShort } from '@/utils/time';
import { LIMITS, STORAGE_KEYS, TIME } from '@/constants';
import { DEFAULT_CATEGORIES, DEFAULT_COMMANDS, CP_REWARDS, ACHIEVEMENTS, LEVEL_THRESHOLDS } from '@/constants';
import { scheduleNotification, cancelNotification } from '@/services/notifications';
import { formatMessage, formatCount, getCopy, getAchievementCopy } from '@/i18n';

// ====== HELPER FUNCTIONS ======
const getTodayDate = () => new Date().toISOString().split('T')[0];

const getTargetDate = (targetTime: number) => new Date(targetTime).toISOString().split('T')[0];

const calculateLevel = (totalCP: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalCP >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

// ====== STORE INTERFACE ======
interface AppStore {
  // ====== UI STATE ======
  activeTab: TabId;
  inputText: string;
  selectedDate: string | null;
  isLoading: boolean;
  toast: ToastState;
  modals: ModalState;
  captureStartTime: number | null;

  // ====== REMINDERS ======
  reminders: Reminder[];

  // ====== QUICK COMMANDS ======
  commands: QuickCommand[];
  categories: Category[];
  selectedCommandTimeIndex: Record<string, number>;

  // ====== STATS ======
  dailyStats: Record<string, DailyStats>;
  userStats: UserStats;

  // ====== SETTINGS ======
  settings: AppSettings;
  isPremium: boolean;

  // ====== UI ACTIONS ======
  setActiveTab: (tab: TabId) => void;
  setInputText: (text: string) => void;
  setSelectedDate: (date: string | null) => void;
  showToast: (message: string, type?: ToastType, icon?: string, cpAmount?: number) => void;
  hideToast: () => void;
  openModal: (modal: keyof ModalState, value?: string | boolean) => void;
  closeModal: (modal: keyof ModalState) => void;
  setCaptureStartTime: (time: number | null) => void;

  // ====== REMINDER ACTIONS ======
  addReminder: (input: ReminderInput) => Reminder | null;
  completeReminder: (id: string) => void;
  removeReminder: (id: string) => void;
  postponeReminder: (id: string, minutes: number) => void;
  clearExpired: () => void;

  // ====== COMMAND ACTIONS ======
  selectCommandTime: (commandId: string, timeIndex: number) => void;
  executeCommand: (commandId: string) => Reminder | null;
  addCommand: (command: Omit<QuickCommand, 'id' | 'createdAt' | 'usageCount'>) => void;
  updateCommand: (id: string, updates: Partial<QuickCommand>) => void;
  deleteCommand: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'order'>) => void;

  // ====== STATS ACTIONS ======
  addCP: (amount: number, reason?: string) => void;
  updateStreak: () => void;
  checkAchievements: () => string[];

  // ====== SETTINGS ACTIONS ======
  updateSettings: (updates: Partial<AppSettings>) => void;
}

// ====== DEFAULT VALUES ======
const defaultUserStats: UserStats = {
  totalCaptured: 0,
  totalCompleted: 0,
  totalCP: 0,
  currentStreak: 0,
  longestStreak: 0,
  bestDayCP: 0,
  level: 1,
  achievements: [],
  lastActiveDate: '',
};

const defaultSettings: AppSettings = {
  notificationSound: true,
  vibrationEnabled: true,
  darkMode: false,
  language: 'ru',
};

const defaultToast: ToastState = {
  message: '',
  type: 'success',
  isVisible: false,
};

const defaultModals: ModalState = {
  commandEditor: false,
  datePicker: false,
  reminderDetail: null,
  achievementDetail: null,
  allAchievements: false,
  postponeOptions: null,
};

// ====== STORE ======
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ====== INITIAL STATE ======
      activeTab: 'capture',
      inputText: '',
      selectedDate: null,
      isLoading: false,
      toast: defaultToast,
      modals: defaultModals,
      captureStartTime: null,
      reminders: [],
      commands: DEFAULT_COMMANDS,
      categories: DEFAULT_CATEGORIES,
      selectedCommandTimeIndex: {},
      dailyStats: {},
      userStats: defaultUserStats,
      settings: defaultSettings,
      isPremium: false,

      // ====== UI ACTIONS ======
      setActiveTab: (tab) => set({ activeTab: tab }),

      setInputText: (text) => {
        set({
          inputText: text.slice(0, LIMITS.MAX_TEXT_LENGTH),
          captureStartTime: get().captureStartTime || Date.now(),
        });
      },

      setSelectedDate: (date) => set({ selectedDate: date }),

      showToast: (message, type = 'success', icon, cpAmount) => {
        set({
          toast: { message, type, isVisible: true, icon, cpAmount },
        });
      },

      hideToast: () => {
        set((state) => ({
          toast: { ...state.toast, isVisible: false },
        }));
      },

      openModal: (modal, value = true) => {
        set((state) => ({
          modals: { ...state.modals, [modal]: value },
        }));
      },

      closeModal: (modal) => {
        set((state) => ({
          modals: { ...state.modals, [modal]: modal.includes('Detail') || modal === 'postponeOptions' ? null : false },
        }));
      },

      setCaptureStartTime: (time) => set({ captureStartTime: time }),

      // ====== REMINDER ACTIONS ======
      addReminder: (input) => {
        const {
          reminders,
          showToast,
          addCP,
          updateStreak,
          checkAchievements,
          captureStartTime,
          userStats,
          settings,
        } = get();
        const language = settings.language;
        const copy = getCopy(language);

        if (reminders.filter(r => r.status === 'pending').length >= LIMITS.MAX_REMINDERS) {
          showToast(
            formatMessage(copy.toasts.maxReminders, {
              count: formatCount(language, LIMITS.MAX_REMINDERS, 'reminder'),
            }),
            'warning'
          );
          return null;
        }

        if (input.minutes < LIMITS.MIN_MINUTES) {
          showToast(copy.toasts.minMinutes, 'error');
          return null;
        }

        const now = Date.now();
        const targetTime = now + input.minutes * 60 * 1000;
        const targetDate = input.targetDate || getTargetDate(targetTime);

        const notificationId = scheduleNotification({
          title: input.text || copy.notifications.title,
          body: copy.notifications.body,
          scheduledTime: targetTime,
        });

        const reminder: Reminder = {
          id: generateId(),
          text: input.text || null,
          icon: input.icon || '⏰',
          targetTime,
          targetDate,
          createdAt: now,
          notificationId,
          status: 'pending',
          sourceCommandId: input.sourceCommandId,
        };

        set((state) => ({
          reminders: [...state.reminders, reminder].sort((a, b) => a.targetTime - b.targetTime),
          inputText: '',
          selectedDate: null,
          captureStartTime: null,
        }));

        // Update stats
        const today = getTodayDate();
        set((state) => ({
          dailyStats: {
            ...state.dailyStats,
            [today]: {
              ...state.dailyStats[today] || { date: today, captured: 0, completed: 0, completedOnTime: 0, missed: 0, cpEarned: 0 },
              captured: (state.dailyStats[today]?.captured || 0) + 1,
            },
          },
          userStats: {
            ...state.userStats,
            totalCaptured: state.userStats.totalCaptured + 1,
          },
        }));

        // Add CP for creating reminder
        addCP(CP_REWARDS.createReminder);

        // Check for speed capture achievement
        if (captureStartTime && (now - captureStartTime) <= 3000) {
          const hasSpeedAchievement = userStats.achievements.includes('speed_demon');
          if (!hasSpeedAchievement) {
            // Will be checked in checkAchievements
          }
        }

        updateStreak();
        checkAchievements();

        const timeLabel = formatMinutesShort(input.minutes, language);
        showToast(
          formatMessage(copy.toasts.captureSuccess, { time: timeLabel }),
          'success',
          '🎯',
          CP_REWARDS.createReminder
        );

        return reminder;
      },

      completeReminder: (id) => {
        const { reminders, showToast, addCP, updateStreak, checkAchievements, settings } = get();
        const copy = getCopy(settings.language);
        const reminder = reminders.find((r) => r.id === id);
        if (!reminder || reminder.status !== 'pending') return;

        const now = Date.now();
        const isOnTime = Math.abs(now - reminder.targetTime) <= TIME.ON_TIME_THRESHOLD;
        const cpEarned = isOnTime ? CP_REWARDS.completeOnTime : CP_REWARDS.completeReminder;

        if (reminder.notificationId) {
          cancelNotification(reminder.notificationId);
        }

        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id
              ? { ...r, status: 'completed' as const, completedAt: now, completedOnTime: isOnTime }
              : r
          ),
        }));

        // Update stats
        const today = getTodayDate();
        set((state) => ({
          dailyStats: {
            ...state.dailyStats,
            [today]: {
              ...state.dailyStats[today] || { date: today, captured: 0, completed: 0, completedOnTime: 0, missed: 0, cpEarned: 0 },
              completed: (state.dailyStats[today]?.completed || 0) + 1,
              completedOnTime: (state.dailyStats[today]?.completedOnTime || 0) + (isOnTime ? 1 : 0),
            },
          },
          userStats: {
            ...state.userStats,
            totalCompleted: state.userStats.totalCompleted + 1,
          },
        }));

        addCP(cpEarned);
        updateStreak();
        checkAchievements();

        showToast(
          isOnTime ? copy.toasts.completedOnTime : copy.toasts.completed,
          'success',
          '✅',
          cpEarned
        );
      },

      removeReminder: (id) => {
        const { reminders } = get();
        const reminder = reminders.find((r) => r.id === id);

        if (reminder?.notificationId) {
          cancelNotification(reminder.notificationId);
        }

        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },

      postponeReminder: (id, minutes) => {
        const { reminders, showToast, settings } = get();
        const language = settings.language;
        const copy = getCopy(language);
        const reminder = reminders.find((r) => r.id === id);
        if (!reminder) return;

        if (reminder.notificationId) {
          cancelNotification(reminder.notificationId);
        }

        const newTargetTime = Date.now() + minutes * 60 * 1000;
        const newNotificationId = scheduleNotification({
          title: reminder.text || copy.notifications.title,
          body: copy.notifications.body,
          scheduledTime: newTargetTime,
        });

        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id
              ? { ...r, targetTime: newTargetTime, targetDate: getTargetDate(newTargetTime), notificationId: newNotificationId }
              : r
          ).sort((a, b) => a.targetTime - b.targetTime),
          modals: { ...state.modals, postponeOptions: null },
        }));

        const timeLabel = formatMinutesShort(minutes, language);
        showToast(formatMessage(copy.toasts.postponed, { time: timeLabel }), 'info', '⏰');
      },

      clearExpired: () => {
        const now = Date.now();
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.status === 'pending' && r.targetTime < now - TIME.ON_TIME_THRESHOLD * 6
              ? { ...r, status: 'missed' as const }
              : r
          ),
        }));
      },

      // ====== COMMAND ACTIONS ======
      selectCommandTime: (commandId, timeIndex) => {
        set((state) => ({
          selectedCommandTimeIndex: { ...state.selectedCommandTimeIndex, [commandId]: timeIndex },
        }));
      },

      executeCommand: (commandId) => {
        const { commands, selectedCommandTimeIndex, addReminder, addCP } = get();
        const command = commands.find((c) => c.id === commandId);
        if (!command) return null;

        const timeIndex = selectedCommandTimeIndex[commandId] ?? 0;
        const timeOption = command.timeOptions[timeIndex];
        if (!timeOption) return null;

        let minutes: number;
        if (timeOption.type === 'relative') {
          minutes = timeOption.value as number;
        } else {
          const [hours, mins] = (timeOption.value as string).split(':').map(Number);
          const now = new Date();
          const target = new Date();
          target.setHours(hours, mins, 0, 0);
          if (target <= now) target.setDate(target.getDate() + 1);
          minutes = Math.round((target.getTime() - now.getTime()) / 60000);
        }

        // Update usage count
        set((state) => ({
          commands: state.commands.map((c) =>
            c.id === commandId ? { ...c, usageCount: c.usageCount + 1 } : c
          ),
        }));

        addCP(CP_REWARDS.useQuickCommand);

        return addReminder({
          text: command.name,
          minutes,
          icon: command.icon,
          sourceCommandId: commandId,
        });
      },

      addCommand: (command) => {
        const { commands, showToast, addCP, checkAchievements, settings } = get();
        const language = settings.language;
        const copy = getCopy(language);

        if (commands.length >= LIMITS.MAX_COMMANDS) {
          showToast(
            formatMessage(copy.toasts.maxCommands, {
              count: formatCount(language, LIMITS.MAX_COMMANDS, 'command'),
            }),
            'warning'
          );
          return;
        }

        const newCommand: QuickCommand = {
          ...command,
          id: generateId(),
          createdAt: Date.now(),
          usageCount: 0,
        };

        set((state) => ({
          commands: [...state.commands, newCommand],
        }));

        addCP(CP_REWARDS.createQuickCommand);
        checkAchievements();
        showToast(copy.toasts.commandCreated, 'success', '⚡', CP_REWARDS.createQuickCommand);
      },

      updateCommand: (id, updates) => {
        set((state) => ({
          commands: state.commands.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCommand: (id) => {
        set((state) => ({
          commands: state.commands.filter((c) => c.id !== id),
        }));
      },

      addCategory: (category) => {
        const { categories } = get();
        if (categories.length >= LIMITS.MAX_CATEGORIES) return;

        const newCategory: Category = {
          ...category,
          id: generateId(),
          order: categories.length,
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      // ====== STATS ACTIONS ======
      addCP: (amount, _reason) => {
        const today = getTodayDate();

        set((state) => {
          const newTotalCP = state.userStats.totalCP + amount;
          const todayStats = state.dailyStats[today] || { date: today, captured: 0, completed: 0, completedOnTime: 0, missed: 0, cpEarned: 0 };
          const newDayCP = todayStats.cpEarned + amount;

          return {
            dailyStats: {
              ...state.dailyStats,
              [today]: { ...todayStats, cpEarned: newDayCP },
            },
            userStats: {
              ...state.userStats,
              totalCP: newTotalCP,
              level: calculateLevel(newTotalCP),
              bestDayCP: Math.max(state.userStats.bestDayCP, newDayCP),
            },
          };
        });
      },

      updateStreak: () => {
        const today = getTodayDate();
        const { userStats, addCP } = get();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = userStats.currentStreak;

        if (userStats.lastActiveDate === today) {
          // Already active today
          return;
        } else if (userStats.lastActiveDate === yesterdayStr) {
          // Continuing streak
          newStreak = userStats.currentStreak + 1;

          // Streak rewards
          if (newStreak === 7) addCP(CP_REWARDS.streak7);
          else if (newStreak === 14) addCP(CP_REWARDS.streak14);
          else if (newStreak === 30) addCP(CP_REWARDS.streak30);
        } else if (userStats.lastActiveDate) {
          // Streak broken
          newStreak = 1;
        } else {
          // First day
          newStreak = 1;
        }

        set((state) => ({
          userStats: {
            ...state.userStats,
            currentStreak: newStreak,
            longestStreak: Math.max(state.userStats.longestStreak, newStreak),
            lastActiveDate: today,
          },
        }));
      },

      checkAchievements: () => {
        const { userStats, commands, dailyStats, showToast, addCP, settings } = get();
        const language = settings.language;
        const copy = getCopy(language);
        const today = getTodayDate();
        const todayStats = dailyStats[today];
        const unlockedIds: string[] = [];

        ACHIEVEMENTS.forEach((achievement) => {
          if (userStats.achievements.includes(achievement.id)) return;

          let unlocked = false;
          const { condition } = achievement;

          switch (condition.type) {
            case 'totalCaptured':
              unlocked = userStats.totalCaptured >= condition.value;
              break;
            case 'totalCompleted':
              unlocked = userStats.totalCompleted >= condition.value;
              break;
            case 'streak':
              unlocked = userStats.currentStreak >= condition.value;
              break;
            case 'commandsCreated':
              const userCommands = commands.filter((c) => !c.id.startsWith('cmd_'));
              unlocked = userCommands.length >= condition.value;
              break;
            case 'dailyCP':
              unlocked = (todayStats?.cpEarned || 0) >= condition.value;
              break;
            case 'totalCP':
              unlocked = userStats.totalCP >= condition.value;
              break;
          }

          if (unlocked) {
            unlockedIds.push(achievement.id);
          }
        });

        if (unlockedIds.length > 0) {
          set((state) => ({
            userStats: {
              ...state.userStats,
              achievements: [...state.userStats.achievements, ...unlockedIds],
            },
          }));

          // Show achievement toast for first one
          const firstAchievement = ACHIEVEMENTS.find((a) => a.id === unlockedIds[0]);
          if (firstAchievement) {
            const achievementCopy = getAchievementCopy(language, firstAchievement.id);
            addCP(firstAchievement.cpReward);
            showToast(
              formatMessage(copy.toasts.achievementUnlocked, { name: achievementCopy.name }),
              'achievement',
              firstAchievement.icon,
              firstAchievement.cpReward
            );
          }
        }

        return unlockedIds;
      },

      // ====== SETTINGS ACTIONS ======
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
    }),
    {
      name: STORAGE_KEYS.reminders,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reminders: state.reminders,
        commands: state.commands,
        categories: state.categories,
        dailyStats: state.dailyStats,
        userStats: state.userStats,
        settings: state.settings,
        isPremium: state.isPremium,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.reminders) {
          const now = Date.now();
          const language = state.settings?.language ?? 'ru';
          const copy = getCopy(language);
          state.reminders = state.reminders
            .filter((r) => r.status === 'pending' && r.targetTime > now)
            .map((reminder) => {
              const notificationId = scheduleNotification({
                title: reminder.text || copy.notifications.title,
                body: copy.notifications.body,
                scheduledTime: reminder.targetTime,
              });
              return { ...reminder, notificationId };
            });
        }
        // Update streak on load
        if (state) {
          state.updateStreak();
          state.clearExpired();
        }
      },
    }
  )
);

// Backward compatibility export
export const useReminderStore = useAppStore;
