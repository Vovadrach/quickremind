import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { TabBar } from '@/components/layout/TabBar';
import { Toast } from '@/components/ui/Toast';
import { CapturePage, CommandsPage, ActivePage, StatsPage, ProfilePage } from '@/pages';
import { useNotifications } from '@/hooks/useNotifications';
import { useI18n } from '@/hooks/useI18n';

export default function App() {
  const { activeTab, toast, hideToast, clearExpired, updateStreak } = useAppStore();
  const { isSupported, permission, requestPermission } = useNotifications();
  const { copy } = useI18n();

  // Clear expired reminders and update streak on mount
  useEffect(() => {
    clearExpired();
    updateStreak();
    const interval = setInterval(clearExpired, 60000);
    return () => clearInterval(interval);
  }, [clearExpired, updateStreak]);

  const renderPage = () => {
    switch (activeTab) {
      case 'commands':
        return <CommandsPage />;
      case 'active':
        return <ActivePage />;
      case 'capture':
        return <CapturePage />;
      case 'stats':
        return <StatsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <CapturePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-screen-sm mx-auto relative overflow-hidden">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Tab Navigation */}
      <TabBar />

      {/* Notification permission banner */}
      {isSupported && permission === 'default' && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-24 left-0 right-0 p-4 bg-neutral-900 text-white z-[300]"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-bold">{copy.permissions.notificationsTitle}</p>
              <p className="text-sm text-white/80">
                {copy.permissions.notificationsDescription}
              </p>
            </div>
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-white text-neutral-900 font-bold rounded-2xl
                hover:bg-white/90 transition-colors"
            >
              {copy.permissions.notificationsAction}
            </button>
          </div>
        </motion.div>
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        icon={toast.icon}
        cpAmount={toast.cpAmount}
        onClose={hideToast}
      />
    </div>
  );
}
