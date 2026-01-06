import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/utils/cn';
import type { QuickCommand } from '@/types';

interface CommandCardProps {
  command: QuickCommand;
  onLongPress?: () => void;
}

export function CommandCard({ command, onLongPress }: CommandCardProps) {
  const { selectedCommandTimeIndex, selectCommandTime, executeCommand } = useAppStore();
  const [isExecuting, setIsExecuting] = useState(false);

  const selectedIndex = selectedCommandTimeIndex[command.id] ?? 0;

  const handleTimeSelect = useCallback((index: number) => {
    selectCommandTime(command.id, index);
  }, [command.id, selectCommandTime]);

  const handleExecute = useCallback(() => {
    setIsExecuting(true);
    // Vibrate if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setTimeout(() => {
      executeCommand(command.id);
      setIsExecuting(false);
    }, 150);
  }, [command.id, executeCommand]);

  const handleDoubleClick = useCallback((index: number) => {
    selectCommandTime(command.id, index);
    handleExecute();
  }, [command.id, selectCommandTime, handleExecute]);

  let longPressTimer: ReturnType<typeof setTimeout> | null = null;

  const handleTouchStart = () => {
    if (onLongPress) {
      longPressTimer = setTimeout(() => {
        if (navigator.vibrate) navigator.vibrate(100);
        onLongPress();
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <span className="text-2xl">{command.icon}</span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[var(--color-text-primary)] truncate">
              {command.name}
            </h3>

            {/* Time Options */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {command.timeOptions.map((option, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.9 }}
                  onDoubleClick={() => handleDoubleClick(index)}
                  onClick={() => handleTimeSelect(index)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-all',
                    selectedIndex === index
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)]'
                  )}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Execute Button */}
          <motion.div
            animate={isExecuting ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.2 }}
          >
            <IconButton
              icon="▶️"
              variant="primary"
              size="md"
              onClick={handleExecute}
              disabled={isExecuting}
              label="Виконати"
            />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
