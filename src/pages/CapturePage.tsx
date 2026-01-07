import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { formatMinutesShort } from '@/utils/time';

export function CapturePage() {
  const { addReminder, userStats, dailyStats } = useAppStore();
  const { copy, formatCount, formatMessage, language } = useI18n();
  const [text, setText] = useState('');
  const [selectedRelative, setSelectedRelative] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Simulated Wheel Picker State
  const [hours, setHours] = useState(new Date().getHours());
  const [minutes, setMinutes] = useState(Math.ceil(new Date().getMinutes() / 5) * 5 % 60);

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
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
            {copy.capture.customHeader}
          </h3>
          <div className="bg-white border border-neutral-200 rounded-3xl p-4 notion-shadow flex justify-center gap-8 items-center relative overflow-hidden h-32">
            <div className="flex flex-col items-center">
              <span className="text-neutral-300 text-[10px] font-bold uppercase mb-1">
                {copy.capture.hoursLabel}
              </span>
              <WheelPicker value={hours} onChange={setHours} max={24} />
            </div>
            <div className="text-4xl font-light text-neutral-200 mt-4">:</div>
            <div className="flex flex-col items-center">
              <span className="text-neutral-300 text-[10px] font-bold uppercase mb-1">
                {copy.capture.minutesLabel}
              </span>
              <WheelPicker value={minutes} onChange={setMinutes} max={60} step={5} />
            </div>
            <div className="absolute inset-0 ios-wheel-gradient pointer-events-none"></div>
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

interface WheelPickerProps {
  value: number;
  onChange: (v: number) => void;
  max: number;
  step?: number;
}

function WheelPicker({ value, onChange, max, step = 1 }: WheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = Array.from({ length: Math.ceil(max / step) }, (_, i) => i * step);

  useEffect(() => {
    if (containerRef.current) {
      const itemHeight = 40;
      const index = items.indexOf(value);
      if (index >= 0) {
        containerRef.current.scrollTop = index * itemHeight;
      }
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const itemHeight = 40;
    const index = Math.round(e.currentTarget.scrollTop / itemHeight);
    const newValue = items[index];
    if (newValue !== undefined && newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[120px] w-12 overflow-y-scroll hide-scrollbar snap-y snap-mandatory py-[40px]"
    >
      {items.map((i) => (
        <div
          key={i}
          className="h-[40px] flex items-center justify-center snap-center text-2xl font-bold text-gray-600 transition-colors hover:text-blue-500"
        >
          {i.toString().padStart(2, '0')}
        </div>
      ))}
    </div>
  );
}
