import type { BeeModeSettings, Reminder, Language } from '@/types';
import { scheduleNotification, cancelNotification } from '@/services/notifications';
import { getCopy, formatMessage } from '@/i18n';

export const DEFAULT_BEE_MODE_SETTINGS: BeeModeSettings = {
  enabled: true,
  intervals: [10, 30, 60, 120],
  repeatInterval: 120,
  repeatEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};

export function isInQuietHours(timestamp: number, settings: BeeModeSettings): boolean {
  const date = new Date(timestamp);
  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  const [startH, startM] = settings.quietHoursStart.split(':').map(Number);
  const [endH, endM] = settings.quietHoursEnd.split(':').map(Number);

  const quietStart = startH * 60 + startM;
  const quietEnd = endH * 60 + endM;

  if (quietStart === quietEnd) return false;

  if (quietStart < quietEnd) {
    return currentMinutes >= quietStart && currentMinutes < quietEnd;
  }

  return currentMinutes >= quietStart || currentMinutes < quietEnd;
}

export function getValidIntervalsForDay(
  baseTime: number,
  settings: BeeModeSettings
): number[] {
  const baseIntervals = Array.from(
    new Set(settings.intervals.filter((interval) => interval > 0))
  ).sort((a, b) => a - b);

  if (!settings.repeatEnabled || settings.repeatInterval <= 0) {
    return baseIntervals;
  }

  const [quietHours, quietMinutes] = settings.quietHoursStart.split(':').map(Number);
  const endOfDay = new Date(baseTime);
  endOfDay.setHours(quietHours, quietMinutes, 0, 0);
  if (endOfDay.getTime() <= baseTime) {
    endOfDay.setDate(endOfDay.getDate() + 1);
  }

  const result = [...baseIntervals];
  let lastInterval = baseIntervals.length > 0 ? baseIntervals[baseIntervals.length - 1] : 0;

  while (true) {
    const nextInterval = lastInterval + settings.repeatInterval;
    const nextTime = baseTime + nextInterval * 60 * 1000;
    if (nextTime >= endOfDay.getTime()) break;
    result.push(nextInterval);
    lastInterval = nextInterval;
  }

  return result;
}

function getBeeNotificationContent(
  reminder: Reminder,
  stage: number,
  totalStages: number,
  intervalMinutes: number,
  language: Language
): { title: string; body: string } {
  const copy = getCopy(language);
  const reminderText = reminder.text || copy.notifications.title;

  if (stage === totalStages - 1) {
    return {
      title: copy.beeMode.notificationLastTitle,
      body: formatMessage(copy.beeMode.notificationLastBody, { text: reminderText }),
    };
  }

  const messages = [
    {
      title: formatMessage(copy.beeMode.notificationReminderTitle, { text: reminderText }),
      body: formatMessage(copy.beeMode.notificationReminderBody, { minutes: intervalMinutes }),
    },
    {
      title: formatMessage(copy.beeMode.notificationStillTitle, { text: reminderText }),
      body: formatMessage(copy.beeMode.notificationStillBody, { minutes: intervalMinutes }),
    },
    {
      title: formatMessage(copy.beeMode.notificationHourTitle, { text: reminderText }),
      body: copy.beeMode.notificationHourBody,
    },
    {
      title: formatMessage(copy.beeMode.notificationTwoHoursTitle, { text: reminderText }),
      body: copy.beeMode.notificationTwoHoursBody,
    },
  ];

  const messageIndex = Math.min(stage, messages.length - 1);
  return messages[messageIndex];
}

export function scheduleBeeNotifications(
  reminder: Reminder,
  settings: BeeModeSettings,
  language: Language
): string[] {
  if (!settings.enabled || !reminder.beeModeEnabled) return [];

  const intervals = getValidIntervalsForDay(reminder.targetTime, settings);
  const now = Date.now();
  const ids: string[] = [];

  intervals.forEach((intervalMinutes, index) => {
    const triggerTime = reminder.targetTime + intervalMinutes * 60 * 1000;
    if (triggerTime <= now) return;
    if (isInQuietHours(triggerTime, settings)) return;

    const { title, body } = getBeeNotificationContent(
      reminder,
      index,
      intervals.length,
      intervalMinutes,
      language
    );

    ids.push(
      scheduleNotification({
        title,
        body,
        scheduledTime: triggerTime,
      })
    );
  });

  return ids;
}

export function cancelBeeNotifications(notificationIds: string[]): void {
  notificationIds.forEach((id) => cancelNotification(id));
}

export function getNextBeeNotificationTime(
  reminder: Reminder,
  settings: BeeModeSettings
): number | null {
  if (!settings.enabled || !reminder.beeModeEnabled) return null;

  const intervals = getValidIntervalsForDay(reminder.targetTime, settings);
  const now = Date.now();

  for (const interval of intervals) {
    const triggerTime = reminder.targetTime + interval * 60 * 1000;
    if (triggerTime <= now) continue;
    if (isInQuietHours(triggerTime, settings)) continue;
    return triggerTime;
  }

  return null;
}
