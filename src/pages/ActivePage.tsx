import { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Check, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function ActivePage() {
  const { reminders, completeReminder, removeReminder } = useAppStore();
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
        <h1 className="text-2xl font-bold">Активні нагадування</h1>
        <p className="text-gray-400 font-medium">{activeReminders.length} думок</p>
      </header>

      <div className="space-y-8">
        {activeReminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <span className="text-6xl mb-4">🌙</span>
            <p className="font-bold">Поки що немає планів</p>
          </div>
        ) : (
          <>
            {nearest.length > 0 && (
              <Section title="НАЙБЛИЖЧІ">
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
              <Section title="СЬОГОДНІ">
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
              <Section title="ПІЗНІШЕ">
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
  const [timeLeft, setTimeLeft] = useState(reminder.targetTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(reminder.targetTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [reminder.targetTime]);

  const minutesLeft = Math.floor(timeLeft / 60000);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeLabel = () => {
    if (timeLeft < 0) return 'Пропущено';
    if (minutesLeft < 60) return `${minutesLeft} хв`;
    return `${(minutesLeft / 60).toFixed(1)} год`;
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
            {reminder.text || 'Нагадування'}
          </h4>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Clock size={12} />
            <span>{formatTime(reminder.targetTime)}</span>
            <span>·</span>
            <span className={timeLeft < 15 * 60000 ? 'text-orange-500' : ''}>
              через {getTimeLabel()}
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
