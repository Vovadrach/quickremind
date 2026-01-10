export interface Reminder {
  id: string;
  text: string | null;
  note?: string | null;
  targetTime: number;
  createdAt: number;
  notificationId: string | null;
}

export interface ReminderInput {
  text: string | null;
  minutes: number;
  note?: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}
