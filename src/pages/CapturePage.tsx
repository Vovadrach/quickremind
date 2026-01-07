import { useState } from 'react';
import { useAppStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { formatDateShort, formatMinutesShort } from '@/utils/time';
import { TimePickerWheel } from '@/components/ui/TimePickerWheel';
import { DatePickerSheet } from '@/components/capture/DatePickerSheet';

export function CapturePage() {
  const { addReminder, userStats, dailyStats } = useAppStore();
  const { copy, formatCount, formatMessage, language } = useI18n();
  const [text, setText] = useState('');
  const [selectedRelative, setSelectedRelative] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Simulated Wheel Picker State
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const [hours, setHours] = useState(now.getHours());
  const [minutes, setMinutes] = useState(Math.ceil(now.getMinutes() / 5) * 5 % 60);
  const [minuteStep, setMinuteStep] = useState<1 | 5>(5);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const today = todayStr;
  const todayCP = dailyStats[today]?.cpEarned || 0;

  const handleCapture = () => {
    if (!text.trim()) return;

    let targetMinutes: number;
    let targetDateOverride: string | undefined;
    if (selectedRelative) {
      targetMinutes = selectedRelative;
    } else {
      const baseDate = selectedDate || todayStr;
      const [year, month, day] = baseDate.split('-').map(Number);
      const target = new Date(year, month - 1, day, hours, minutes, 0, 0);
      if (baseDate === todayStr && target.getTime() < Date.now()) {
        target.setDate(target.getDate() + 1);
      }
      targetMinutes = Math.round((target.getTime() - Date.now()) / 60000);
      targetDateOverride = target.toISOString().split('T')[0];
    }

    if (targetMinutes < 1) targetMinutes = 1;

    addReminder({
      text: text.trim(),
      minutes: targetMinutes,
      icon: '💭',
      targetDate: targetDateOverride,
    });

    setText('');
    setSelectedRelative(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const quickTimes = [5, 15, 30, 60].map((value) => ({
    value,
    label: formatMinutesShort(value, language),
  }));

  const snapMinutes = (value: number, step: number) => {
    const snapped = Math.round(value / step) * step;
    const max = 60 - step;
    return Math.max(0, Math.min(max, snapped));
  };

  const handleMinuteStepChange = (step: 1 | 5) => {
    setMinuteStep(step);
    setMinutes((prev) => snapMinutes(prev, step));
  };

  const selectedDateLabel =
    selectedDate === todayStr
      ? copy.capture.dateButtonToday
      : formatDateShort(new Date(`${selectedDate}T00:00:00`).getTime(), language);

  return (
    <div className="p-4 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
          <span className="text-orange-500">🔥</span>
          <span className="text-xs font-semibold text-orange-700">
            {formatCount(userStats.currentStreak, 'day')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
          <span className="text-blue-500">🎯</span>
          <span className="text-xs font-semibold text-blue-700">
            {formatMessage(copy.capture.todayCp, { count: todayCP })}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={copy.capture.placeholder}
            className="w-full h-32 bg-white border border-neutral-200 rounded-3xl p-5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all resize-none notion-shadow placeholder:text-neutral-300"
          />
        </div>

        {/* Quick Times */}
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
            {copy.capture.quickHeader}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {quickTimes.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedRelative(t.value === selectedRelative ? null : t.value)}
                className={`h-12 rounded-2xl border transition-all duration-200 text-xs font-semibold ${
                  selectedRelative === t.value
                    ? 'bg-neutral-900 text-white border-neutral-900 notion-shadow scale-95'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Picker */}
        <div className={selectedRelative ? 'opacity-30 pointer-events-none' : ''}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              {copy.capture.customHeader}
            </h3>
            <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full p-1">
              <button
                type="button"
                onClick={() => handleMinuteStepChange(5)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors ${
                  minuteStep === 5 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {copy.capture.minuteStepRounded}
              </button>
              <button
                type="button"
                onClick={() => handleMinuteStepChange(1)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors ${
                  minuteStep === 1 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {copy.capture.minuteStepExact}
              </button>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-3xl p-3 notion-shadow">
            <div className="flex justify-between text-[10px] font-bold text-neutral-300 uppercase mb-1 px-4">
              <span>{copy.capture.hoursLabel}</span>
              <span>{copy.capture.minutesLabel}</span>
            </div>
            <TimePickerWheel
              selectedHour={hours}
              selectedMinute={minutes}
              onHourChange={setHours}
              onMinuteChange={setMinutes}
              minuteStep={minuteStep}
              itemHeight={40}
              className="w-full"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsDatePickerOpen(true)}
            className="mt-3 w-full h-14 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between px-3 text-neutral-600 notion-shadow"
          >
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-neutral-400" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-bold uppercase text-neutral-400">
                  {copy.capture.dateButtonLabel}
                </span>
                <span className="text-sm font-semibold text-neutral-800">{selectedDateLabel}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-neutral-300" />
          </button>
        </div>

        {/* Main Action */}
        <button
          onClick={handleCapture}
          disabled={!text.trim()}
          className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 ${
            showSuccess
              ? 'bg-emerald-500 text-white'
              : !text.trim()
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 notion-shadow'
          }`}
        >
          {showSuccess ? (
            <>
              <CheckCircle2 size={22} />
              <span className="font-bold">{copy.capture.successAction}</span>
            </>
          ) : (
            <span className="font-bold text-base tracking-tight">{copy.capture.action}</span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-xl z-[100]"
          >
            {copy.capture.cpToast}
          </motion.div>
        )}
      </AnimatePresence>

      <DatePickerSheet
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
      />
    </div>
  );
}
