import { motion } from 'framer-motion';
import { BottomSheet } from '@/components/ui/Modal';
import { useAppStore } from '@/store';

interface PostponeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  reminderId: string;
}

const POSTPONE_OPTIONS = [
  { minutes: 5, label: '+5 хв', icon: '⏱️' },
  { minutes: 15, label: '+15 хв', icon: '⏰' },
  { minutes: 30, label: '+30 хв', icon: '🕐' },
  { minutes: 60, label: '+1 год', icon: '🕑' },
  { minutes: 120, label: '+2 год', icon: '🕓' },
  { minutes: 1440, label: 'Завтра', icon: '📅' },
];

export function PostponeSheet({ isOpen, onClose, reminderId }: PostponeSheetProps) {
  const { postponeReminder } = useAppStore();

  const handlePostpone = (minutes: number) => {
    postponeReminder(reminderId, minutes);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Відкласти на">
      <div className="p-4 grid grid-cols-3 gap-3">
        {POSTPONE_OPTIONS.map((option) => (
          <motion.button
            key={option.minutes}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePostpone(option.minutes)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] transition-colors"
          >
            <span className="text-2xl">{option.icon}</span>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {option.label}
            </span>
          </motion.button>
        ))}
      </div>
    </BottomSheet>
  );
}
