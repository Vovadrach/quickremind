import { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Check, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/hooks/useI18n';
import { formatMinutesShort, formatTime } from '@/utils/time';

export function ActivePage() {
  const { reminders, completeReminder, removeReminder } = useAppStore();
  const { copy, formatCount } = useI18n();
  const activeReminders = useMemo(
    () => reminders.filter((r) => r.status === 'pending'),
    [reminders]
  );

  const now = Date.now();
  const sorted = [...activeReminders].sort((a, b) => a.targetTime - b.targetTime);

  const nearest = sorted.filter((r) => r.targetTime - now < 3600000); // next hour
  const today = sorted.filter(
    (r) => r.targetTime - now >= 3600000 && r.targetTime - now < 86400000
  );
  const later = sorted.filter((r) => r.targetTime - now >= 86400000);

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{copy.active.title}</h1>
        <p className="text-gray-400 font-medium">
          {formatCount(activeReminders.length, 'thought')}
        </p>
      </header>

      <div className="space-y-8">
        {activeReminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <span className="text-6xl mb-4">🌙</span>
            <p className="font-bold">{copy.active.emptyTitle}</p>
          </div>
        ) : (
          <>
            {nearest.length > 0 && (
              <Section title={copy.active.sections.nearest}>
                {nearest.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onComplete={completeReminder}
                    onDelete={removeReminder}
                  />
                ))}
              </Section>
            )}

            {today.length > 0 && (
              <Section title={copy.active.sections.today}>
                {today.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onComplete={completeReminder}
                    onDelete={removeReminder}
                  />
                ))}
              </Section>
            )}

            {later.length > 0 && (
              <Section title={copy.active.sections.later}>
                {later.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onComplete={completeReminder}
                    onDelete={removeReminder}
                  />
                ))}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface ReminderCardProps {
  reminder: {
    id: string;
    text: string | null;
    icon: string;
    targetTime: number;
  };
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

function ReminderCard({ reminder, onComplete, onDelete }: ReminderCardProps) {
  const { copy, language } = useI18n();
  const [timeLeft, setTimeLeft] = useState(reminder.targetTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(reminder.targetTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [reminder.targetTime]);

  const minutesLeft = Math.floor(timeLeft / 60000);

  const getTimeLabel = () => {
    if (timeLeft < 0) return copy.active.missed;
    return formatMinutesShort(minutesLeft, language);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: 100 }}
      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
          {reminder.icon}
        </div>
        <div>
          <h4 className="font-bold text-gray-800 leading-tight mb-1">
            {reminder.text || copy.active.reminderFallback}
          </h4>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Clock size={12} />
            <span>{formatTime(reminder.targetTime, language)}</span>
            <span>·</span>
            <span className={timeLeft < 15 * 60000 ? 'text-orange-500' : ''}>
              {timeLeft < 0 ? getTimeLabel() : `${copy.active.inPrefix} ${getTimeLabel()}`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDelete(reminder.id)}
          className="w-10 h-10 rounded-2xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={() => onComplete(reminder.id)}
          className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-transform"
        >
          <Check size={20} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
}
