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
      <header className="flex flex-col items-center mb-6">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full flex items-center gap-2 font-bold text-sm shadow-sm"
        >
          <span>🔥</span> {formatCount(userStats.currentStreak, 'day')}
        </motion.div>
        <p className="text-gray-400 text-xs font-medium mt-2">
          {formatMessage(copy.capture.todayCp, { count: todayCP })}
        </p>
      </header>

      <div className="space-y-6">
        {/* Input */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={copy.capture.placeholder}
            className="w-full bg-white border-2 border-gray-100 rounded-3xl p-6 text-lg font-medium focus:outline-none focus:border-blue-400 transition-colors shadow-sm resize-none h-32"
          />
        </div>

        {/* Quick Times */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            {copy.capture.quickHeader}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {quickTimes.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedRelative(t.value === selectedRelative ? null : t.value)}
                className={`py-3 rounded-2xl text-sm font-semibold transition-all ${
                  selectedRelative === t.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border border-gray-100 text-gray-600 shadow-sm active:scale-95'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Picker */}
        <div className={selectedRelative ? 'opacity-30 pointer-events-none' : ''}>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            {copy.capture.customHeader}
          </h3>
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex justify-center gap-8 items-center relative overflow-hidden h-32">
            <div className="flex flex-col items-center">
              <span className="text-gray-300 text-[10px] font-bold uppercase mb-1">
                {copy.capture.hoursLabel}
              </span>
              <WheelPicker value={hours} onChange={setHours} max={24} />
            </div>
            <div className="text-4xl font-light text-gray-200 mt-4">:</div>
            <div className="flex flex-col items-center">
              <span className="text-gray-300 text-[10px] font-bold uppercase mb-1">
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
            className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 shadow-sm active:bg-gray-50 active:scale-95 transition-all"
          >
            <Calendar size={18} className="text-blue-500" />
            {copy.capture.todayButton}
          </button>
          <button
            onClick={() => alert(copy.capture.otherDateAlert)}
            className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 shadow-sm active:bg-gray-50 active:scale-95 transition-all"
          >
            <Calendar size={18} className="text-purple-500" />
            {copy.capture.otherDateButton}
          </button>
        </div>

        {/* Main Action */}
        <div className="mt-4">
        <button
          onClick={handleCapture}
          disabled={!text.trim()}
          className={`w-full py-5 rounded-3xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all ${
            text.trim() ? 'bg-blue-600 text-white active:scale-95 hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {showSuccess ? <CheckCircle2 /> : '✨'}
          {showSuccess ? copy.capture.successAction : copy.capture.action}
        </button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-xl z-[100]"
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
