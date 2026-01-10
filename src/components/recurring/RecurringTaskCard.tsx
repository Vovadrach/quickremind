import { useMemo } from 'react';
import { Pause, Play, Trash2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { formatDateShort, formatTime } from '@/utils/time';
import { getNextOccurrence } from '@/utils/recurrence';
import type { RecurringTask } from '@/types';
import { formatMessage } from '@/i18n';

interface RecurringTaskCardProps {
  task: RecurringTask;
  isEditMode: boolean;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecurringTaskCard({
  task,
  isEditMode,
  onToggleActive,
  onEdit,
  onDelete,
}: RecurringTaskCardProps) {
  const { copy, language, getWeekdaysShort } = useI18n();
  const weekdays = getWeekdaysShort();

  const summary = useMemo(() => {
    const timeLabel = task.time;
    switch (task.recurrence.type) {
      case 'weekly': {
        const days = [...(task.recurrence.daysOfWeek ?? [])].sort((a, b) => a - b).map((day) => {
          const index = day === 0 ? 6 : day - 1;
          return weekdays[index];
        });
        return formatMessage(copy.recurring.summaryWeekly, {
          days: days.length ? days.join(', ') : copy.recurring.repeatWeekly,
          time: timeLabel,
        });
      }
      case 'monthly': {
        if (task.recurrence.isLastDayOfMonth) {
          return formatMessage(copy.recurring.summaryMonthlyLast, { time: timeLabel });
        }
        return formatMessage(copy.recurring.summaryMonthly, {
          day: task.recurrence.dayOfMonth ?? 1,
          time: timeLabel,
        });
      }
      case 'custom':
        return formatMessage(copy.recurring.summaryCustom, {
          count: task.recurrence.intervalValue ?? 1,
          unit: getUnitLabel(task.recurrence.intervalUnit ?? 'days', copy),
          time: timeLabel,
        });
      case 'daily':
      default:
        return formatMessage(copy.recurring.summaryDaily, { time: timeLabel });
    }
  }, [task, copy, weekdays]);

  const nextOccurrence = useMemo(() => {
    if (!task.isActive) return null;
    const baseline = new Date(Math.max(Date.now(), new Date(task.startDate).getTime()));
    return getNextOccurrence(task, baseline);
  }, [task]);

  const nextLabel = nextOccurrence
    ? formatMessage(copy.recurring.nextLabel, {
      date: formatDateShort(nextOccurrence.getTime(), language),
      time: formatTime(nextOccurrence.getTime(), language),
    })
    : copy.recurring.pause;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 notion-shadow flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={isEditMode ? undefined : onEdit}
        className="flex-1 text-left min-w-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-xl">
            {task.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <p className="font-semibold text-neutral-900 truncate">{task.name}</p>
              {task.beeModeEnabled && <span className="text-xs">🐝</span>}
            </div>
            {task.note && (
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                {task.note}
              </p>
            )}
            <p className="text-xs text-neutral-500 font-medium mt-1">🔄 {summary}</p>
            <p className="text-xs text-neutral-400 font-medium mt-1">{nextLabel}</p>
          </div>
        </div>
      </button>

      {isEditMode ? (
        <button
          type="button"
          onClick={onDelete}
          className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all hover:bg-rose-600"
        >
          <Trash2 size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onToggleActive}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all ${
            task.isActive ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'
          }`}
        >
          {task.isActive ? <Pause size={18} /> : <Play size={18} />}
        </button>
      )}
    </div>
  );
}

function getUnitLabel(unit: 'days' | 'weeks' | 'months', copy: ReturnType<typeof useI18n>['copy']) {
  switch (unit) {
    case 'weeks':
      return copy.recurring.unitWeeks;
    case 'months':
      return copy.recurring.unitMonths;
    case 'days':
    default:
      return copy.recurring.unitDays;
  }
}
