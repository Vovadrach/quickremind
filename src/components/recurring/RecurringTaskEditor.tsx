import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { BottomSheet } from '@/components/ui/Modal';
import { TimePickerWheel } from '@/components/ui/TimePickerWheel';
import { useI18n } from '@/hooks/useI18n';
import { EMOJI_OPTIONS } from '@/constants';
import type { RecurringTask, RecurrenceRule, RecurrenceType } from '@/types';

export type RecurringTaskInput = Omit<RecurringTask, 'id' | 'createdAt' | 'stats'>;

interface RecurringTaskEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: RecurringTaskInput) => void;
  task?: RecurringTask | null;
  defaultBeeEnabled: boolean;
}

export function RecurringTaskEditor({
  isOpen,
  onClose,
  onSave,
  task,
  defaultBeeEnabled,
}: RecurringTaskEditorProps) {
  const { copy, getWeekdaysShort } = useI18n();
  const weekdays = getWeekdaysShort();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📝');
  const [note, setNote] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [isLastDay, setIsLastDay] = useState(false);
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [beeModeEnabled, setBeeModeEnabled] = useState(defaultBeeEnabled);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (task) {
      setName(task.name);
      setIcon(task.icon);
      setNote(task.note || '');
      setRecurrenceType(task.recurrence.type);
      const [hours, minutes] = task.time.split(':').map(Number);
      setSelectedHour(hours);
      setSelectedMinute(minutes);
      setDaysOfWeek(task.recurrence.daysOfWeek ?? [1, 2, 3, 4, 5]);
      setDayOfMonth(task.recurrence.dayOfMonth ?? 1);
      setIsLastDay(Boolean(task.recurrence.isLastDayOfMonth));
      setIntervalValue(task.recurrence.intervalValue ?? 1);
      setIntervalUnit(task.recurrence.intervalUnit ?? 'days');
      setBeeModeEnabled(task.beeModeEnabled);
      setStartDate(task.startDate);
    } else {
      setName('');
      setIcon('📝');
      setNote('');
      setRecurrenceType('daily');
      setSelectedHour(9);
      setSelectedMinute(0);
      setDaysOfWeek([1, 2, 3, 4, 5]);
      setDayOfMonth(1);
      setIsLastDay(false);
      setIntervalValue(1);
      setIntervalUnit('days');
      setBeeModeEnabled(defaultBeeEnabled);
      setStartDate(new Date().toISOString().split('T')[0]);
    }
    setShowEmojiPicker(false);
  }, [isOpen, task, defaultBeeEnabled]);

  const timeValue = useMemo(
    () => `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`,
    [selectedHour, selectedMinute]
  );

  const handleToggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const recurrence: RecurrenceRule = {
      type: recurrenceType,
      ...(recurrenceType === 'weekly' && { daysOfWeek }),
      ...(recurrenceType === 'monthly' && { dayOfMonth, isLastDayOfMonth: isLastDay }),
      ...(recurrenceType === 'custom' && { intervalValue, intervalUnit }),
    };

    onSave({
      icon,
      name: name.trim(),
      note: note.trim() || undefined,
      recurrence,
      time: timeValue,
      beeModeEnabled,
      isActive: task?.isActive ?? true,
      startDate,
    });
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={task ? copy.recurring.modalTitleEdit : copy.recurring.modalTitleCreate}
    >
      <div className="p-4 space-y-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-2"
        >
          <X size={20} />
        </button>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            {copy.recurring.labelName}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-3xl hover:bg-neutral-100 transition-colors shrink-0"
            >
              {icon}
            </button>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={copy.recurring.placeholderName}
              className="flex-1 bg-neutral-50 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
              {copy.recurring.noteLabel}
            </label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={copy.recurring.notePlaceholder}
              className="w-full bg-neutral-50 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-neutral-900/5 text-sm resize-none min-h-[72px]"
            />
          </div>
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-8 gap-2 p-3 bg-neutral-50 rounded-2xl">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setIcon(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        icon === emoji ? 'bg-neutral-900 text-white scale-110' : 'hover:bg-neutral-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            {copy.recurring.labelRepeat}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['daily', 'weekly', 'monthly', 'custom'] as RecurrenceType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setRecurrenceType(type)}
                className={`py-2 rounded-xl text-sm font-bold transition-all ${
                  recurrenceType === type ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-600'
                }`}
              >
                {type === 'daily' && copy.recurring.repeatDaily}
                {type === 'weekly' && copy.recurring.repeatWeekly}
                {type === 'monthly' && copy.recurring.repeatMonthly}
                {type === 'custom' && copy.recurring.repeatCustom}
              </button>
            ))}
          </div>
        </div>

        {recurrenceType === 'weekly' && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              {copy.recurring.labelWeekdays}
            </label>
            <div className="flex gap-2 flex-wrap">
              {weekdays.map((day, index) => {
                const dayIndex = index === 6 ? 0 : index + 1;
                const isSelected = daysOfWeek.includes(dayIndex);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(dayIndex)}
                    className={`w-10 h-10 rounded-full text-xs font-bold transition-colors ${
                      isSelected ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-500'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {recurrenceType === 'monthly' && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              {copy.recurring.labelMonthDay}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={dayOfMonth}
                onChange={(event) => setDayOfMonth(Number(event.target.value))}
                className="flex-1 bg-neutral-50 rounded-xl py-2 px-3 text-sm font-semibold"
              >
                {Array.from({ length: 31 }, (_, idx) => idx + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
                <input
                  type="checkbox"
                  checked={isLastDay}
                  onChange={(event) => setIsLastDay(event.target.checked)}
                  className="accent-neutral-900"
                />
                {copy.recurring.labelLastDay}
              </label>
            </div>
          </div>
        )}

        {recurrenceType === 'custom' && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              {copy.recurring.labelCustomEvery}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                value={intervalValue}
                onChange={(event) => setIntervalValue(Math.max(1, Number(event.target.value)))}
                className="w-20 bg-neutral-50 rounded-xl py-2 px-3 text-sm font-semibold text-center"
              />
              <select
                value={intervalUnit}
                onChange={(event) => setIntervalUnit(event.target.value as typeof intervalUnit)}
                className="flex-1 bg-neutral-50 rounded-xl py-2 px-3 text-sm font-semibold"
              >
                <option value="days">{copy.recurring.unitDays}</option>
                <option value="weeks">{copy.recurring.unitWeeks}</option>
                <option value="months">{copy.recurring.unitMonths}</option>
              </select>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            {copy.recurring.labelTime}
          </label>
          <div className="bg-neutral-50 rounded-2xl p-4">
            <TimePickerWheel
              selectedHour={selectedHour}
              selectedMinute={selectedMinute}
              onHourChange={setSelectedHour}
              onMinuteChange={setSelectedMinute}
              minuteStep={5}
              visibleItems={3}
              itemHeight={40}
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-2xl px-4 py-3">
          <span className="text-sm font-semibold text-neutral-700">{copy.recurring.labelBeeMode}</span>
          <button
            type="button"
            onClick={() => setBeeModeEnabled((prev) => !prev)}
            className={`w-10 h-6 rounded-full p-1 flex transition-colors duration-200 ${
              beeModeEnabled ? 'bg-emerald-500 justify-end' : 'bg-neutral-200 justify-start'
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            {copy.recurring.labelStartDate}
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full bg-neutral-50 rounded-xl py-2 px-3 text-sm font-semibold"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full bg-neutral-900 text-white font-bold py-3 rounded-2xl notion-shadow active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {task ? copy.recurring.save : copy.recurring.create}
        </button>
      </div>
    </BottomSheet>
  );
}
