export interface Reminder {
  id: string;
  text: string | null;
  targetTime: number;
  createdAt: number;
  notificationId: string | null;
}

export interface ReminderInput {
  text: string | null;
  minutes: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}
