import { useState } from 'react';
import { useAppStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { formatMinutesShort } from '@/utils/time';
import { TimePickerWheel } from '@/components/ui/TimePickerWheel';

export function CapturePage() {
  const { addReminder, userStats, dailyStats } = useAppStore();
  const { copy, formatCount, formatMessage, language } = useI18n();
  const [text, setText] = useState('');
  const [selectedRelative, setSelectedRelative] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Simulated Wheel Picker State
  const [hours, setHours] = useState(new Date().getHours());
  const [minutes, setMinutes] = useState(Math.ceil(new Date().getMinutes() / 5) * 5 % 60);
  const [minuteStep, setMinuteStep] = useState<1 | 5>(5);

  const today = new Date().toISOString().split('T')[0];
  const todayCP = dailyStats[today]?.cpEarned || 0;

  const handleCapture = () => {
    if (!text.trim()) return;

    let targetMinutes: number;
    if (selectedRelative) {
      targetMinutes = selectedRelative;
    } else {
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
      targetMinutes = Math.round((d.getTime() - Date.now()) / 60000);
    }

    if (targetMinutes < 1) targetMinutes = 1;

    addReminder({
      text: text.trim(),
      minutes: targetMinutes,
      icon: '💭',
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

  return (
    <div className="p-6 flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
          <span className="text-orange-500">🔥</span>
          <span className="text-sm font-semibold text-orange-700">
            {formatCount(userStats.currentStreak, 'day')}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <span className="text-blue-500">🎯</span>
          <span className="text-sm font-semibold text-blue-700">
            {formatMessage(copy.capture.todayCp, { count: todayCP })}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={copy.capture.placeholder}
            className="w-full h-40 bg-white border border-neutral-200 rounded-3xl p-6 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all resize-none notion-shadow placeholder:text-neutral-300"
          />
        </div>

        {/* Quick Times */}
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
            {copy.capture.quickHeader}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {quickTimes.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedRelative(t.value === selectedRelative ? null : t.value)}
                className={`h-14 rounded-2xl border transition-all duration-200 text-sm font-semibold ${
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              {copy.capture.customHeader}
            </h3>
            <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full p-1">
              <button
                type="button"
                onClick={() => handleMinuteStepChange(5)}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors ${
                  minuteStep === 5 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {copy.capture.minuteStepRounded}
              </button>
              <button
                type="button"
                onClick={() => handleMinuteStepChange(1)}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors ${
                  minuteStep === 1 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {copy.capture.minuteStepExact}
              </button>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-3xl p-4 notion-shadow">
            <div className="flex justify-between text-[10px] font-bold text-neutral-300 uppercase mb-2 px-6">
              <span>{copy.capture.hoursLabel}</span>
              <span>{copy.capture.minutesLabel}</span>
            </div>
            <TimePickerWheel
              selectedHour={hours}
              selectedMinute={minutes}
              onHourChange={setHours}
              onMinuteChange={setMinutes}
              minuteStep={minuteStep}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => alert(copy.capture.todayAlert)}
            className="flex-1 h-14 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-neutral-600"
          >
            <Calendar size={18} className="text-neutral-400" />
            {copy.capture.todayButton}
          </button>
          <button
            onClick={() => alert(copy.capture.otherDateAlert)}
            className="flex-1 h-14 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-neutral-600"
          >
            <Calendar size={18} className="text-neutral-400" />
            {copy.capture.otherDateButton}
          </button>
        </div>

        {/* Main Action */}
        <button
          onClick={handleCapture}
          disabled={!text.trim()}
          className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 ${
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
            <span className="font-bold text-lg tracking-tight">{copy.capture.action}</span>
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
    </div>
  );
}
