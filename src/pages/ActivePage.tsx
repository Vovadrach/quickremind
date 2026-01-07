import { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Check, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/hooks/useI18n';
import { formatDateShort, formatMinutesShort, formatTime } from '@/utils/time';

export function ActivePage() {
  const { reminders, completeReminder, removeReminder } = useAppStore();
  const { copy, formatCount } = useI18n();
  const activeReminders = useMemo(
    () => reminders.filter((r) => r.status === 'pending'),
    [reminders]
  );
  const completedReminders = useMemo(
    () => reminders.filter((r) => r.status === 'completed'),
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
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{copy.active.title}</h1>
        <p className="text-sm text-neutral-500 font-medium">
          {formatCount(activeReminders.length, 'thought')}
        </p>
      </header>

      <div className="space-y-8">
        {activeReminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <span className="text-5xl">📆</span>
            <p className="mt-4 font-medium">{copy.active.emptyTitle}</p>
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

        <section className="pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              {copy.active.completedTitle}
            </h3>
            <span className="text-xs font-bold text-neutral-400">{completedReminders.length}</span>
          </div>
          <div className="space-y-2 opacity-50">
            {completedReminders.slice(0, 3).map((rem) => (
              <div key={rem.id} className="flex items-center gap-3 py-1">
                <span className="text-lg grayscale">{rem.icon}</span>
                <span className="text-sm font-medium line-through">
                  {rem.text || copy.active.reminderFallback}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface ReminderCardProps {
  reminder: {
    id: string;
    text: string | null;
    icon: string;
    targetTime: number;
    targetDate: string;
  };
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

function ReminderCard({ reminder, onComplete, onDelete }: ReminderCardProps) {
  const { copy, language, formatCount } = useI18n();
  const [timeLeft, setTimeLeft] = useState(reminder.targetTime - Date.now());
  const todayStr = new Date().toISOString().split('T')[0];
  const showDate = reminder.targetDate && reminder.targetDate !== todayStr;
  const timeLabel = formatTime(reminder.targetTime, language);
  const dateLabel = formatDateShort(reminder.targetTime, language);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(reminder.targetTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [reminder.targetTime]);

  const minutesLeft = Math.floor(timeLeft / 60000);

  const getTimeLabel = () => {
    if (timeLeft < 0) return copy.active.missed;

    const totalMinutes = Math.max(0, minutesLeft);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    if (days > 0) {
      const dayLabel = formatCount(days, 'day');
      if (hours === 0) return dayLabel;
      return `${dayLabel} ${formatMinutesShort(hours * 60, language)}`;
    }

    return formatMinutesShort(totalMinutes, language);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: 100 }}
      className="bg-white border border-neutral-200 rounded-2xl p-4 notion-shadow flex items-center gap-4 group transition-all hover:border-neutral-300"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-xl">
          {reminder.icon}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-neutral-900 truncate">
            {reminder.text || copy.active.reminderFallback}
          </h4>
          <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1 font-medium">
            <Clock size={12} />
            <span>{showDate ? `${dateLabel} · ${timeLabel}` : timeLabel}</span>
            <span>·</span>
            <span className={timeLeft < 15 * 60000 ? 'text-orange-500' : ''}>
              {timeLeft < 0 ? getTimeLabel() : `${copy.active.inPrefix} ${getTimeLabel()}`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onComplete(reminder.id)}
          className="p-2 text-neutral-300 hover:text-emerald-500 transition-colors"
        >
          <Check size={22} />
        </button>
        <button
          onClick={() => onDelete(reminder.id)}
          className="p-2 text-neutral-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
