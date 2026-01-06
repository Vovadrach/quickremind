interface NotificationOptions {
  title: string;
  body: string;
  scheduledTime: number;
}

// Store scheduled timeouts for cancellation
const scheduledNotifications = new Map<string, number>();

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
}

/**
 * Schedule a notification
 */
export function scheduleNotification(options: NotificationOptions): string {
  const id = crypto.randomUUID();
  const delay = options.scheduledTime - Date.now();

  if (delay <= 0) {
    showNotification(options.title, options.body);
    return id;
  }

  const timerId = window.setTimeout(() => {
    showNotification(options.title, options.body);
    scheduledNotifications.delete(id);
  }, delay);

  scheduledNotifications.set(id, timerId);

  return id;
}

/**
 * Cancel a scheduled notification
 */
export function cancelNotification(id: string): void {
  const timerId = scheduledNotifications.get(id);
  if (timerId) {
    window.clearTimeout(timerId);
    scheduledNotifications.delete(id);
  }
}

/**
 * Show a notification immediately
 */
function showNotification(title: string, body: string): void {
  if (Notification.permission !== 'granted') {
    return;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: '/icons/icon-192x192.svg',
      tag: 'quickremind',
      requireInteraction: true,
    });

    // Play sound
    playNotificationSound();

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

/**
 * Play notification sound
 */
function playNotificationSound(): void {
  try {
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch {
    // Silently fail if audio can't be played
  }
}

/**
 * Clear all scheduled notifications
 */
export function clearAllScheduledNotifications(): void {
  scheduledNotifications.forEach((timerId) => {
    window.clearTimeout(timerId);
  });
  scheduledNotifications.clear();
}
