import { useState, useEffect, useCallback } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from '@/services/notifications';

interface UseNotificationsResult {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<boolean>;
  isPermissionGranted: boolean;
}

export function useNotifications(): UseNotificationsResult {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );

  const isSupported = isNotificationSupported();
  const isPermissionGranted = permission === 'granted';

  useEffect(() => {
    // Update permission state when it might have changed
    const checkPermission = () => {
      setPermission(getNotificationPermission());
    };

    // Check on focus (user might have changed settings)
    window.addEventListener('focus', checkPermission);

    return () => {
      window.removeEventListener('focus', checkPermission);
    };
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermission(getNotificationPermission());
    return granted;
  }, []);

  return {
    isSupported,
    permission,
    requestPermission,
    isPermissionGranted,
  };
}
