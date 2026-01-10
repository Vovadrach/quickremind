import { useEffect, useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { useAppStore } from '@/store';
import { BottomSheet } from '@/components/ui/Modal';
import { BeeModeInfoSheet } from '@/components/settings/BeeModeInfoSheet';
import { useI18n } from '@/hooks/useI18n';
import { formatMinutesShort } from '@/utils/time';
import type { BeeModeSettings } from '@/types';

export function BeeModeSettingsCard() {
  const { beeModeSettings, toggleBeeMode } = useAppStore();
  const { copy, language, formatMessage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const intervalLabel = useMemo(() => {
    const labels = beeModeSettings.intervals.map((value) =>
      formatMinutesShort(value, language)
    );
    return labels.length ? labels.join(' → ') : '—';
  }, [beeModeSettings.intervals, language]);

  const repeatLabel = beeModeSettings.repeatEnabled
    ? formatMessage(copy.beeMode.repeatEvery, {
      interval: formatMinutesShort(beeModeSettings.repeatInterval, language),
    })
    : copy.beeMode.repeatOff;

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 notion-shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center text-lg">
              🐝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-neutral-900">{copy.beeMode.title}</p>
                <button
                  type="button"
                  onClick={() => setIsInfoOpen(true)}
                  className="text-neutral-300 hover:text-neutral-600 transition-colors"
                  aria-label={copy.beeMode.infoTitle}
                >
                  <Info size={16} />
                </button>
              </div>
              <p className="text-xs text-neutral-500">{copy.beeMode.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleBeeMode}
            className={`w-10 h-6 rounded-full p-1 flex transition-colors duration-200 ${
              beeModeSettings.enabled ? 'bg-emerald-500 justify-end' : 'bg-neutral-200 justify-start'
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        {beeModeSettings.enabled && (
          <div className="mt-4 text-xs text-neutral-500 font-medium space-y-1">
            <p>
              {copy.beeMode.intervalsLabel}: {intervalLabel}
              {beeModeSettings.repeatEnabled && ` → ${repeatLabel}`}
            </p>
            <p>
              {copy.beeMode.quietHoursLabel} {beeModeSettings.quietHoursStart} {copy.beeMode.quietHoursUntil}{' '}
              {beeModeSettings.quietHoursEnd}
            </p>
          </div>
        )}

        {beeModeSettings.enabled && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-4 w-full py-3 rounded-2xl text-sm font-bold bg-neutral-900 text-white transition-colors hover:bg-neutral-800"
          >
            {copy.beeMode.configure}
          </button>
        )}
      </div>

      <BeeModeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <BeeModeInfoSheet isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
}

function BeeModeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { beeModeSettings, updateBeeModeSettings } = useAppStore();
  const { copy, language } = useI18n();
  const [draft, setDraft] = useState<BeeModeSettings>(beeModeSettings);

  useEffect(() => {
    if (isOpen) {
      setDraft(beeModeSettings);
    }
  }, [isOpen, beeModeSettings]);

  const intervalOptions = [
    { minutes: 10, label: copy.beeMode.intervalFirst },
    { minutes: 30, label: copy.beeMode.intervalSecond },
    { minutes: 60, label: copy.beeMode.intervalThird },
    { minutes: 120, label: copy.beeMode.intervalFourth },
  ];

  const repeatOptions = [60, 120, 180];

  const toggleInterval = (minutes: number) => {
    const nextIntervals = draft.intervals.includes(minutes)
      ? draft.intervals.filter((value) => value !== minutes)
      : [...draft.intervals, minutes];

    setDraft({
      ...draft,
      intervals: nextIntervals,
    });
  };

  const handleSave = () => {
    updateBeeModeSettings(draft);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={copy.beeMode.modalTitle}>
      <div className="p-4 space-y-6">
        <p className="text-sm text-neutral-500">{copy.beeMode.modalDescription}</p>

        <div className="space-y-2">
          {intervalOptions.map((option) => {
            const checked = draft.intervals.includes(option.minutes);
            return (
              <button
                key={option.minutes}
                type="button"
                onClick={() => toggleInterval(option.minutes)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold border transition-colors ${
                  checked
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-100'
                }`}
              >
                <span>{option.label}</span>
                <span>{formatMinutesShort(option.minutes, language)}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-700">{copy.beeMode.intervalRepeat}</span>
            <button
              type="button"
              onClick={() => setDraft({ ...draft, repeatEnabled: !draft.repeatEnabled })}
              className={`w-10 h-6 rounded-full p-1 flex transition-colors duration-200 ${
                draft.repeatEnabled ? 'bg-emerald-500 justify-end' : 'bg-neutral-200 justify-start'
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>
          {draft.repeatEnabled && (
            <div className="flex gap-2 flex-wrap">
              {repeatOptions.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDraft({ ...draft, repeatInterval: value })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    draft.repeatInterval === value
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-600'
                  }`}
                >
                  {formatMinutesShort(value, language)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            {copy.beeMode.quietHoursLabel}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={draft.quietHoursStart}
              onChange={(event) => setDraft({ ...draft, quietHoursStart: event.target.value })}
              className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2 text-sm font-semibold"
            />
            <span className="text-xs text-neutral-400">{copy.beeMode.quietHoursUntil}</span>
            <input
              type="time"
              value={draft.quietHoursEnd}
              onChange={(event) => setDraft({ ...draft, quietHoursEnd: event.target.value })}
              className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2 text-sm font-semibold"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-neutral-900 text-white font-bold py-3 rounded-2xl notion-shadow active:scale-[0.98] transition-all"
        >
          {copy.beeMode.save}
        </button>
      </div>
    </BottomSheet>
  );
}
