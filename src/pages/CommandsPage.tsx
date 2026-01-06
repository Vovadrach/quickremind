import { useState } from 'react';
import { useAppStore } from '@/store';
import { Play, Plus, X, Trash2, Clock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuickCommand, TimeOption } from '@/types';
import { EMOJI_OPTIONS } from '@/constants';
import { useI18n } from '@/hooks/useI18n';
import { formatMinutesShort } from '@/utils/time';

export function CommandsPage() {
  const {
    commands,
    categories,
    executeCommand,
    addCommand,
    updateCommand,
    deleteCommand,
    showToast
  } = useAppStore();
  const { copy } = useI18n();

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | null>(null);
  const [editingCommand, setEditingCommand] = useState<QuickCommand | null>(null);

  // Filter commands
  const filteredCommands = commands.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCommand(null);
    setModalType('create');
  };

  const handleOpenEdit = (command: QuickCommand) => {
    if (isEditMode) return;
    setEditingCommand(command);
    setModalType('edit');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setEditingCommand(null);
  };

  const handleSaveCommand = (data: CommandFormData) => {
    if (modalType === 'edit' && editingCommand) {
      updateCommand(editingCommand.id, {
        name: data.name,
        icon: data.icon,
        categoryId: data.categoryId,
        timeOptions: data.timeOptions,
      });
      showToast(copy.toasts.commandUpdated, 'success', '✅');
    } else {
      addCommand({
        name: data.name,
        icon: data.icon,
        categoryId: data.categoryId,
        timeOptions: data.timeOptions,
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteCommand(id);
    showToast(copy.toasts.commandDeleted, 'info', '🗑️');
  };

  return (
    <div className="p-6 pb-24">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{copy.commands.title}</h1>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`font-bold text-2xl w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isEditMode
              ? 'bg-blue-600 text-white'
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          {isEditMode ? <Check size={20} /> : '✏️'}
        </button>
      </header>

      <div className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={copy.commands.searchPlaceholder}
          className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-5 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="space-y-6">
        {categories.map((cat) => {
          const catCommands = filteredCommands.filter((c) => c.categoryId === cat.id);
          if (catCommands.length === 0) return null;
          return (
            <CategorySection key={cat.id} title={cat.name.toUpperCase()}>
              <AnimatePresence mode="popLayout">
                {catCommands.map((cmd) => (
                  <CommandCard
                    key={cmd.id}
                    command={cmd}
                    isEditMode={isEditMode}
                    onExecute={() => executeCommand(cmd.id)}
                    onEdit={() => handleOpenEdit(cmd)}
                    onDelete={() => handleDelete(cmd.id)}
                  />
                ))}
              </AnimatePresence>
            </CategorySection>
          );
        })}

        {filteredCommands.length === 0 && searchTerm && (
          <div className="text-center py-10 text-gray-400 font-medium">
            {copy.commands.emptySearch}
          </div>
        )}

        {filteredCommands.length === 0 && !searchTerm && (
          <div className="text-center py-10 text-gray-400 font-medium">
            <p className="mb-4">{copy.commands.emptyTitle}</p>
            <p className="text-sm">{copy.commands.emptySubtitle}</p>
          </div>
        )}

        <button
          onClick={handleOpenCreate}
          className="w-full border-2 border-dashed border-gray-200 rounded-3xl py-6 flex flex-col items-center gap-2 text-gray-400 font-bold transition-all hover:border-blue-200 hover:text-blue-400 hover:bg-blue-50/30 active:scale-[0.98]"
        >
          <Plus size={24} />
          {copy.commands.newCommand}
        </button>
      </div>

      {/* Command Editor Modal */}
      <AnimatePresence>
        {modalType && (
          <CommandEditorModal
            mode={modalType}
            command={editingCommand}
            categories={categories}
            onSave={handleSaveCommand}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ CATEGORY SECTION ============
function CategorySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ============ COMMAND CARD ============
interface CommandCardProps {
  command: QuickCommand;
  isEditMode: boolean;
  onExecute: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function CommandCard({ command, isEditMode, onExecute, onEdit, onDelete }: CommandCardProps) {
  const { selectCommandTime, selectedCommandTimeIndex } = useAppStore();
  const { copy } = useI18n();
  const selectedIdx = selectedCommandTimeIndex[command.id] ?? 0;
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExecute = () => {
    onExecute();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleCardClick = () => {
    if (!isEditMode) {
      onEdit();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -100 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden"
    >
      <div
        className="flex-1 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{command.icon}</span>
          <span className="font-bold text-gray-800">{command.name}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {command.timeOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                selectCommandTime(command.id, idx);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedIdx === idx
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isEditMode ? (
        <button
          onClick={onDelete}
          className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all hover:bg-red-600"
        >
          <Trash2 size={20} />
        </button>
      ) : (
        <button
          onClick={handleExecute}
          className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all hover:bg-blue-700"
        >
          <Play size={20} fill="currentColor" />
        </button>
      )}

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-600 flex items-center justify-center text-white font-bold"
          >
            {copy.commands.successOverlay}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ COMMAND EDITOR MODAL ============
interface CommandFormData {
  name: string;
  icon: string;
  categoryId: string;
  timeOptions: TimeOption[];
}

interface CommandEditorModalProps {
  mode: 'create' | 'edit';
  command: QuickCommand | null;
  categories: { id: string; name: string; icon?: string }[];
  onSave: (data: CommandFormData) => void;
  onClose: () => void;
}

function CommandEditorModal({ mode, command, categories, onSave, onClose }: CommandEditorModalProps) {
  const { copy, language } = useI18n();
  const [name, setName] = useState(command?.name || '');
  const [icon, setIcon] = useState(command?.icon || '⚡');
  const [categoryId, setCategoryId] = useState(command?.categoryId || categories[0]?.id || 'daily');
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>(
    command?.timeOptions || [{ type: 'relative', value: 15, label: `+${formatMinutesShort(15, language)}` }]
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTimeAdder, setShowTimeAdder] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (timeOptions.length === 0) return;

    onSave({ name: name.trim(), icon, categoryId, timeOptions });
  };

  const addTimeOption = (opt: TimeOption) => {
    if (timeOptions.length >= 4) return;
    setTimeOptions([...timeOptions, opt]);
    setShowTimeAdder(false);
  };

  const removeTimeOption = (index: number) => {
    setTimeOptions(timeOptions.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6">
          {mode === 'create' ? copy.commands.modalTitleCreate : copy.commands.modalTitleEdit}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Icon & Name Row */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl hover:bg-gray-100 transition-colors shrink-0"
            >
              {icon}
            </button>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                {copy.commands.labelName}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.commands.placeholderName}
                className="w-full bg-gray-50 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded-2xl">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setIcon(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        icon === emoji ? 'bg-blue-100 scale-110' : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              {copy.commands.labelCategory}
            </label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    categoryId === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Time Options */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              {copy.commands.labelTimeOptions}
            </label>
            <div className="flex gap-2 flex-wrap mb-3">
              {timeOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="bg-blue-100 text-blue-600 px-3 py-2 rounded-full text-sm font-bold flex items-center gap-2"
                >
                  <Clock size={14} />
                  {opt.label}
                  <button
                    type="button"
                    onClick={() => removeTimeOption(idx)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {timeOptions.length < 4 && (
                <button
                  type="button"
                  onClick={() => setShowTimeAdder(true)}
                  className="border-2 border-dashed border-gray-200 px-3 py-2 rounded-full text-sm font-bold text-gray-400 hover:border-blue-200 hover:text-blue-400 transition-all"
                >
                  <Plus size={14} className="inline mr-1" />
                  {copy.commands.addTime}
                </button>
              )}
            </div>

            {/* Time Adder */}
            <AnimatePresence>
              {showTimeAdder && (
                <TimeOptionAdder
                  onAdd={addTimeOption}
                  onCancel={() => setShowTimeAdder(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name.trim() || timeOptions.length === 0}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'create' ? copy.commands.create : copy.commands.save}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ============ TIME OPTION ADDER ============
interface TimeOptionAdderProps {
  onAdd: (option: TimeOption) => void;
  onCancel: () => void;
}

function TimeOptionAdder({ onAdd, onCancel }: TimeOptionAdderProps) {
  const { copy, language } = useI18n();
  const [type, setType] = useState<'relative' | 'absolute'>('relative');
  const [relativeMinutes, setRelativeMinutes] = useState(30);
  const [absoluteTime, setAbsoluteTime] = useState('12:00');

  const handleAdd = () => {
    if (type === 'relative') {
      const label = `+${formatMinutesShort(relativeMinutes, language)}`;
      onAdd({ type: 'relative', value: relativeMinutes, label });
    } else {
      onAdd({ type: 'absolute', value: absoluteTime, label: absoluteTime });
    }
  };

  const relativeOptions = [5, 10, 15, 30, 45, 60, 90, 120];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
        {/* Type Selector */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('relative')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              type === 'relative'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {copy.commands.timeTypeRelative}
          </button>
          <button
            type="button"
            onClick={() => setType('absolute')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              type === 'absolute'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {copy.commands.timeTypeAbsolute}
          </button>
        </div>

        {/* Options */}
        {type === 'relative' ? (
          <div className="grid grid-cols-4 gap-2">
            {relativeOptions.map((min) => {
              const label = formatMinutesShort(min, language);
              return (
                <button
                  key={min}
                  type="button"
                  onClick={() => setRelativeMinutes(min)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    relativeMinutes === min
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          <input
            type="time"
            value={absoluteTime}
            onChange={(e) => setAbsoluteTime(e.target.value)}
            className="w-full bg-white rounded-xl py-3 px-4 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 bg-white rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {copy.commands.cancel}
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-2 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-colors"
          >
            {copy.commands.add}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
