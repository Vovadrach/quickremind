import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Reminder, ReminderInput, ToastState, ToastType } from '@/types/reminder';
import { generateId } from '@/utils/id';
import { LIMITS, STORAGE_KEY } from '@/utils/constants';
import { scheduleNotification, cancelNotification } from '@/services/notifications';

interface ReminderState {
  reminders: Reminder[];
  inputText: string;
  isLoading: boolean;
  toast: ToastState;

  // Actions
  setInputText: (text: string) => void;
  addReminder: (input: ReminderInput) => Reminder | null;
  removeReminder: (id: string) => void;
  clearExpired: () => void;
  clearAll: () => void;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      inputText: '',
      isLoading: false,
      toast: {
        message: '',
        type: 'success',
        isVisible: false,
      },

      setInputText: (text: string) => {
        set({ inputText: text.slice(0, LIMITS.MAX_TEXT_LENGTH) });
      },

      addReminder: (input: ReminderInput) => {
        const { reminders, showToast } = get();

        // Check limit
        if (reminders.length >= LIMITS.MAX_REMINDERS) {
          showToast(`Максимум ${LIMITS.MAX_REMINDERS} нагадувань`, 'warning');
          return null;
        }

        // Validate time
        if (input.minutes < LIMITS.MIN_MINUTES) {
          showToast('Мінімум 1 хвилина', 'error');
          return null;
        }

        const now = Date.now();
        const targetTime = now + input.minutes * 60 * 1000;

        // Schedule notification
        const notificationId = scheduleNotification({
          title: input.text || 'Нагадування',
          body: 'Час настав!',
          scheduledTime: targetTime,
        });

        const reminder: Reminder = {
          id: generateId(),
          text: input.text,
          targetTime,
          createdAt: now,
          notificationId,
        };

        set((state) => ({
          reminders: [...state.reminders, reminder].sort(
            (a, b) => a.targetTime - b.targetTime
          ),
          inputText: '',
        }));

        // Show success toast
        const timeLabel = input.minutes >= 60
          ? `${Math.floor(input.minutes / 60)} год${input.minutes % 60 > 0 ? ` ${input.minutes % 60} хв` : ''}`
          : `${input.minutes} хв`;
        showToast(`Нагадування через ${timeLabel}`, 'success');

        return reminder;
      },

      removeReminder: (id: string) => {
        const { reminders } = get();
        const reminder = reminders.find((r) => r.id === id);

        if (reminder?.notificationId) {
          cancelNotification(reminder.notificationId);
        }

        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },

      clearExpired: () => {
        const now = Date.now();
        set((state) => ({
          reminders: state.reminders.filter((r) => r.targetTime > now),
        }));
      },

      clearAll: () => {
        const { reminders } = get();

        // Cancel all notifications
        reminders.forEach((reminder) => {
          if (reminder.notificationId) {
            cancelNotification(reminder.notificationId);
          }
        });

        set({ reminders: [] });
      },

      showToast: (message: string, type: ToastType = 'success') => {
        set({
          toast: {
            message,
            type,
            isVisible: true,
          },
        });
      },

      hideToast: () => {
        set((state) => ({
          toast: {
            ...state.toast,
            isVisible: false,
          },
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reminders: state.reminders,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-schedule notifications on load
        if (state?.reminders) {
          const now = Date.now();
          state.reminders = state.reminders
            .filter((r) => r.targetTime > now)
            .map((reminder) => {
              const notificationId = scheduleNotification({
                title: reminder.text || 'Нагадування',
                body: 'Час настав!',
                scheduledTime: reminder.targetTime,
              });
              return { ...reminder, notificationId };
            });
        }
      },
    }
  )
);
