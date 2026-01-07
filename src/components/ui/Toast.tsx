import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { ToastType } from '@/types';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  icon?: string;
  cpAmount?: number;
}

const icons: Record<ToastType, ReactNode> = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  achievement: <span className="text-xl">🏆</span>,
};

const colors: Record<ToastType, string> = {
  success: 'bg-[var(--color-success)] text-white',
  error: 'bg-[var(--color-danger)] text-white',
  info: 'bg-[var(--color-accent)] text-white',
  warning: 'bg-[var(--color-warning)] text-white',
  achievement: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white',
};

export function Toast({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 2500,
  icon,
  cpAmount,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-24 left-4 right-4 z-[200] flex justify-center pointer-events-none"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-2xl notion-shadow pointer-events-auto',
              'max-w-sm w-full',
              colors[type]
            )}
          >
            {icon ? <span className="text-xl">{icon}</span> : icons[type]}
            <span className="flex-1 text-sm font-medium">{message}</span>
            {cpAmount !== undefined && cpAmount > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm font-bold">
                +{cpAmount} CP
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
