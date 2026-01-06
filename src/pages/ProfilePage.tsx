import { useAppStore } from '@/store';
import { Bell, Zap, Shield, HelpCircle, Share2, Star } from 'lucide-react';
import { LEVEL_THRESHOLDS, LEVEL_NAMES, APP_VERSION } from '@/constants';

export function ProfilePage() {
  const { userStats, settings, updateSettings, isPremium } = useAppStore();

  // Calculate level progress
  const currentLevelThreshold = LEVEL_THRESHOLDS[userStats.level - 1] || 0;
  const nextLevelThreshold =
    LEVEL_THRESHOLDS[userStats.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const levelProgress =
    ((userStats.totalCP - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
  const levelName = LEVEL_NAMES[userStats.level - 1] || LEVEL_NAMES[LEVEL_NAMES.length - 1];

  const handlePremiumClick = () => {
    alert("Дякуємо за інтерес! Оплата в тестовому режимі недоступна. Ви вже PRO в нашому серці! ❤️");
  };

  const handleRowClick = (label: string) => {
    if (label === 'Темна тема') {
      alert('Функція Dark Mode доступна лише в PRO версії.');
    } else if (label === 'Поділитися застосунком') {
      if (navigator.share) {
        navigator
          .share({
            title: 'QuickRemind 2.0',
            text: 'Спробуй цей крутий застосунок для нагадувань!',
            url: window.location.href,
          })
          .catch(console.error);
      } else {
        alert('Скопійовано посилання: ' + window.location.href);
      }
    } else {
      alert(`Відкриваємо: ${label}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Профіль</h1>

      <div className="space-y-6">
        {/* User Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-5xl mb-4 shadow-inner">
            👤
          </div>
          <h2 className="text-xl font-black mb-1">{levelName}</h2>
          <p className="text-blue-600 font-bold text-sm mb-6">Level {userStats.level}</p>

          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(levelProgress, 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {userStats.totalCP} / {nextLevelThreshold} CP до Level {userStats.level + 1}
          </p>
        </div>

        {/* Premium Banner */}
        {!isPremium && (
          <button
            onClick={handlePremiumClick}
            className="w-full text-left bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden transition-transform active:scale-[0.98]"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} fill="currentColor" />
                <h3 className="text-lg font-bold">QuickRemind PRO</h3>
              </div>
              <p className="text-white/80 text-xs mb-4 max-w-[200px]">
                Необмежені команди, віджети та темна тема
              </p>
              <div className="bg-white text-indigo-600 font-bold px-6 py-2.5 rounded-2xl text-sm shadow-lg inline-block">
                $2.99 одноразово
              </div>
            </div>
            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          </button>
        )}

        {/* Settings List */}
        <div className="space-y-1">
          <SectionHeader title="НАЛАШТУВАННЯ" />
          <SettingsRow
            icon={<Bell size={20} className="text-blue-500" />}
            label="Звук нотифікацій"
            toggle={settings.notificationSound}
            onToggle={() => updateSettings({ notificationSound: !settings.notificationSound })}
          />
          <SettingsRow
            icon={<Zap size={20} className="text-orange-500" />}
            label="Вібрація"
            toggle={settings.vibrationEnabled}
            onToggle={() => updateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
          />
          <SettingsRow
            icon={<Shield size={20} className="text-purple-500" />}
            label="Темна тема"
            value="🔒 PRO"
            onClick={() => handleRowClick('Темна тема')}
          />

          <div className="pt-4">
            <SectionHeader title="ІНШЕ" />
            <SettingsRow
              icon={<Share2 size={20} />}
              label="Поділитися застосунком"
              onClick={() => handleRowClick('Поділитися застосунком')}
            />
            <SettingsRow
              icon={<Star size={20} />}
              label="Оцінити в App Store"
              onClick={() => handleRowClick('Оцінити в App Store')}
            />
            <SettingsRow
              icon={<HelpCircle size={20} />}
              label="Надіслати відгук"
              onClick={() => handleRowClick('Надіслати відгук')}
            />
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">
            ВЕРСІЯ {APP_VERSION} (BUILD 1)
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-3 mt-4 px-2">{title}</h3>
  );
}

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  toggle?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}

function SettingsRow({ icon, label, value, toggle, onToggle, onClick }: SettingsRowProps) {
  return (
    <div
      onClick={onClick || onToggle}
      className="bg-white border-b border-gray-50 last:border-0 p-4 flex items-center justify-between group cursor-pointer active:bg-gray-50 transition-colors rounded-2xl"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">{icon}</div>
        <span className="font-bold text-gray-700 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs font-bold text-gray-400">{value}</span>}
        {onToggle !== undefined ? (
          <div
            className={`w-10 h-6 rounded-full p-1 flex transition-colors duration-200 ${
              toggle ? 'bg-green-500 justify-end' : 'bg-gray-200 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        ) : (
          <span className="text-gray-300 text-xl">›</span>
        )}
      </div>
    </div>
  );
}
