import { useState } from 'react';
import { useAppStore } from '@/store';
import { Bell, Zap, Shield, HelpCircle, Share2, Star, Globe } from 'lucide-react';
import { LEVEL_THRESHOLDS, APP_VERSION } from '@/constants';
import { BottomSheet } from '@/components/ui/Modal';
import { useI18n } from '@/hooks/useI18n';

export function ProfilePage() {
  const { userStats, settings, updateSettings, isPremium } = useAppStore();
  const { copy, formatMessage, getLanguageLabel, languageOptions, getLevelName } = useI18n();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // Calculate level progress
  const currentLevelThreshold = LEVEL_THRESHOLDS[userStats.level - 1] || 0;
  const nextLevelThreshold =
    LEVEL_THRESHOLDS[userStats.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const levelProgress =
    ((userStats.totalCP - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
  const levelName = getLevelName(userStats.level);

  const handlePremiumClick = () => {
    alert(copy.alerts.premium);
  };

  const handleDarkModeClick = () => {
    alert(copy.alerts.darkModePro);
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: copy.share.title,
          text: copy.share.text,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert(formatMessage(copy.alerts.shareCopied, { url: window.location.href }));
    }
  };

  const handleGenericClick = (label: string) => {
    alert(formatMessage(copy.alerts.openSection, { label }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">{copy.profile.title}</h1>

      <div className="space-y-6">
        {/* User Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-5xl mb-4 shadow-inner">
            👤
          </div>
          <h2 className="text-xl font-black mb-1">{levelName}</h2>
          <p className="text-blue-600 font-bold text-sm mb-6">
            {formatMessage(copy.profile.levelLabel, { level: userStats.level })}
          </p>

          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(levelProgress, 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {formatMessage(copy.profile.levelProgress, {
              current: userStats.totalCP,
              next: nextLevelThreshold,
              level: userStats.level + 1,
            })}
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
                <h3 className="text-lg font-bold">{copy.profile.premiumTitle}</h3>
              </div>
              <p className="text-white/80 text-xs mb-4 max-w-[200px]">
                {copy.profile.premiumDescription}
              </p>
              <div className="bg-white text-indigo-600 font-bold px-6 py-2.5 rounded-2xl text-sm shadow-lg inline-block">
                {copy.profile.premiumPrice}
              </div>
            </div>
            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          </button>
        )}

        {/* Settings List */}
        <div className="space-y-1">
          <SectionHeader title={copy.profile.settingsHeader} />
          <SettingsRow
            icon={<Bell size={20} className="text-blue-500" />}
            label={copy.settings.notificationSound}
            toggle={settings.notificationSound}
            onToggle={() => updateSettings({ notificationSound: !settings.notificationSound })}
          />
          <SettingsRow
            icon={<Zap size={20} className="text-orange-500" />}
            label={copy.settings.vibration}
            toggle={settings.vibrationEnabled}
            onToggle={() => updateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
          />
          <SettingsRow
            icon={<Globe size={20} className="text-emerald-500" />}
            label={copy.settings.language}
            value={getLanguageLabel(settings.language)}
            onClick={() => setIsLanguageOpen(true)}
          />
          <SettingsRow
            icon={<Shield size={20} className="text-purple-500" />}
            label={copy.settings.darkMode}
            value="🔒 PRO"
            onClick={handleDarkModeClick}
          />

          <div className="pt-4">
            <SectionHeader title={copy.profile.otherHeader} />
            <SettingsRow
              icon={<Share2 size={20} />}
              label={copy.settings.shareApp}
              onClick={handleShareClick}
            />
            <SettingsRow
              icon={<Star size={20} />}
              label={copy.settings.rateApp}
              onClick={() => handleGenericClick(copy.settings.rateApp)}
            />
            <SettingsRow
              icon={<HelpCircle size={20} />}
              label={copy.settings.feedback}
              onClick={() => handleGenericClick(copy.settings.feedback)}
            />
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">
            {copy.profile.versionLabel} {APP_VERSION} (BUILD 1)
          </p>
        </div>
      </div>

      <BottomSheet
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
        title={copy.language.sheetTitle}
      >
        <div className="p-4 space-y-2">
          {languageOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                updateSettings({ language: option.value });
                setIsLanguageOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                settings.language === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{option.label}</span>
              {settings.language === option.value && <span>✓</span>}
            </button>
          ))}
        </div>
      </BottomSheet>
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
