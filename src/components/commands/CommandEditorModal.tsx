import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store';
import { EMOJI_OPTIONS } from '@/constants';
import { cn } from '@/utils/cn';
import type { TimeOption } from '@/types';

interface CommandEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCommandId: string | null;
}

const TIME_PRESETS: TimeOption[] = [
  { type: 'relative', value: 15, label: '+15хв' },
  { type: 'relative', value: 30, label: '+30хв' },
  { type: 'relative', value: 60, label: '+1год' },
  { type: 'relative', value: 120, label: '+2год' },
  { type: 'absolute', value: '09:00', label: '09:00' },
  { type: 'absolute', value: '12:00', label: '12:00' },
  { type: 'absolute', value: '15:00', label: '15:00' },
  { type: 'absolute', value: '18:00', label: '18:00' },
];

export function CommandEditorModal({ isOpen, onClose, editingCommandId }: CommandEditorModalProps) {
  const { commands, categories, addCommand, updateCommand, deleteCommand } = useAppStore();

  const editingCommand = editingCommandId ? commands.find((c) => c.id === editingCommandId) : null;

  const [icon, setIcon] = useState('⏰');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [selectedTimeOptions, setSelectedTimeOptions] = useState<TimeOption[]>([]);

  useEffect(() => {
    if (editingCommand) {
      setIcon(editingCommand.icon);
      setName(editingCommand.name);
      setCategoryId(editingCommand.categoryId);
      setSelectedTimeOptions(editingCommand.timeOptions);
    } else {
      setIcon('⏰');
      setName('');
      setCategoryId(categories[0]?.id || '');
      setSelectedTimeOptions([]);
    }
  }, [editingCommand, categories, isOpen]);

  const toggleTimeOption = (option: TimeOption) => {
    const exists = selectedTimeOptions.find(
      (t) => t.type === option.type && t.value === option.value
    );

    if (exists) {
      setSelectedTimeOptions(
        selectedTimeOptions.filter(
          (t) => !(t.type === option.type && t.value === option.value)
        )
      );
    } else if (selectedTimeOptions.length < 4) {
      setSelectedTimeOptions([...selectedTimeOptions, option]);
    }
  };

  const isTimeSelected = (option: TimeOption) => {
    return selectedTimeOptions.some(
      (t) => t.type === option.type && t.value === option.value
    );
  };

  const handleSave = () => {
    if (!name.trim() || selectedTimeOptions.length === 0) return;

    if (editingCommand) {
      updateCommand(editingCommand.id, {
        icon,
        name: name.trim(),
        categoryId,
        timeOptions: selectedTimeOptions,
      });
    } else {
      addCommand({
        icon,
        name: name.trim(),
        categoryId,
        timeOptions: selectedTimeOptions,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (editingCommand) {
      deleteCommand(editingCommand.id);
      onClose();
    }
  };

  const isValid = name.trim().length > 0 && selectedTimeOptions.length >= 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCommand ? 'Редагувати команду' : 'Нова команда'}
    >
      <div className="p-4 space-y-6">
        {/* Emoji Picker */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Іконка
          </label>
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_OPTIONS.slice(0, 24).map((emoji) => (
              <motion.button
                key={emoji}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIcon(emoji)}
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all',
                  icon === emoji
                    ? 'bg-[var(--color-accent)] ring-2 ring-[var(--color-accent)]'
                    : 'bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)]'
                )}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <Input
            label="Назва"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть назву команди..."
            maxLength={50}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Категорія
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryId(category.id)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
                  categoryId === category.id
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                )}
              >
                <span>{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Time Options */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Варіанти часу (оберіть 1-4)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TIME_PRESETS.map((option, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTimeOption(option)}
                disabled={!isTimeSelected(option) && selectedTimeOptions.length >= 4}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  isTimeSelected(option)
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]',
                  !isTimeSelected(option) && selectedTimeOptions.length >= 4 && 'opacity-50 cursor-not-allowed'
                )}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
            Обрано: {selectedTimeOptions.length}/4
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {editingCommand && (
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex-shrink-0"
            >
              Видалити
            </Button>
          )}
          <Button
            fullWidth
            onClick={handleSave}
            disabled={!isValid}
          >
            {editingCommand ? 'Зберегти' : 'Створити'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
