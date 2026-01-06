import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface QuickTimeButtonProps {
  label: string;
  sublabel?: string;
  minutes?: number;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export function QuickTimeButton({
  label,
  sublabel,
  onPress,
  disabled = false,
  className,
}: QuickTimeButtonProps) {
  const handlePress = () => {
    if (disabled) return;

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    onPress();
  };

  return (
    <motion.button
      className={cn(
        'flex flex-col items-center justify-center',
        'bg-[var(--color-bg-elevated)] rounded-xl p-4',
        'shadow-md hover:shadow-lg',
        'transition-shadow duration-200',
        'min-h-[72px] w-full',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handlePress}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled}
    >
      <span className="text-lg font-semibold text-[var(--color-text-primary)]">
        {label}
      </span>
      {sublabel && (
        <span className="text-xs text-[var(--color-text-secondary)] mt-0.5">
          {sublabel}
        </span>
      )}
    </motion.button>
  );
}
