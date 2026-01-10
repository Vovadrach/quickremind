import { useState } from 'react';
import { useAppStore } from '@/store';
import { Bell, Zap, Shield, HelpCircle, Share2, Globe, Star } from 'lucide-react';
import { LEVEL_THRESHOLDS, APP_VERSION } from '@/constants';
import { BottomSheet } from '@/components/ui/Modal';
import { useI18n } from '@/hooks/useI18n';
import { BeeModeSettingsCard } from '@/components/settings/BeeModeSettingsCard';

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
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-8">{copy.profile.title}</h1>

      <div className="space-y-6">
        {/* User Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 notion-shadow flex flex-col items-center">
          <div className="w-24 h-24 bg-neutral-100 rounded-3xl flex items-center justify-center text-5xl notion-shadow mb-4">
            👤
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">{levelName}</h2>
          <div className="bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            {formatMessage(copy.profile.levelLabel, { level: userStats.level })}
          </div>

          <div className="w-full mt-8">
            <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase mb-2">
              <span>{copy.profile.levelProgressLabel}</span>
              <span>{userStats.totalCP} / {nextLevelThreshold} CP</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="bg-neutral-900 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(levelProgress, 100)}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2">
              {formatMessage(copy.profile.levelProgress, {
                current: userStats.totalCP,
                next: nextLevelThreshold,
                level: userStats.level + 1,
              })}
            </p>
          </div>
        </div>

        {/* Premium Banner */}
        {!isPremium && (
          <button
            onClick={handlePremiumClick}
            className="w-full text-left bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white notion-shadow relative overflow-hidden transition-transform active:scale-[0.98]"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} fill="currentColor" />
                <span className="text-xs font-bold uppercase tracking-widest">{copy.profile.premiumTitle}</span>
              </div>
              <p className="text-lg font-bold mb-4">
                {copy.profile.premiumDescription}
              </p>
              <div className="bg-white text-neutral-900 font-bold px-6 py-2.5 rounded-xl text-sm shadow-xl inline-block">
                {copy.profile.premiumPrice}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <StarIcon size={120} className="fill-white" />
            </div>
          </button>
        )}

        {/* Settings List */}
        <div className="space-y-1">
          <SectionHeader title={copy.profile.settingsHeader} />
          <div className="bg-white border border-neutral-200 rounded-3xl notion-shadow overflow-hidden">
            <SettingsRow
              icon={<Bell size={18} />}
              label={copy.settings.notificationSound}
              toggle={settings.notificationSound}
              onToggle={() => updateSettings({ notificationSound: !settings.notificationSound })}
            />
            <SettingsRow
              icon={<Zap size={18} />}
              label={copy.settings.vibration}
              toggle={settings.vibrationEnabled}
              onToggle={() => updateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
            />
            <SettingsRow
              icon={<Globe size={18} />}
              label={copy.settings.language}
              value={getLanguageLabel(settings.language)}
              onClick={() => setIsLanguageOpen(true)}
            />
            <SettingsRow
              icon={<Shield size={18} />}
              label={copy.settings.darkMode}
              value="🔒 PRO"
              onClick={handleDarkModeClick}
            />
          </div>

          <div className="pt-4">
            <BeeModeSettingsCard />
          </div>

          <div className="pt-4">
            <SectionHeader title={copy.profile.otherHeader} />
            <div className="bg-white border border-neutral-200 rounded-3xl notion-shadow overflow-hidden">
              <SettingsRow
                icon={<Share2 size={18} />}
                label={copy.settings.shareApp}
                onClick={handleShareClick}
              />
              <SettingsRow
                icon={<Star size={18} />}
                label={copy.settings.rateApp}
                onClick={() => handleGenericClick(copy.settings.rateApp)}
              />
              <SettingsRow
                icon={<HelpCircle size={18} />}
                label={copy.settings.feedback}
                onClick={() => handleGenericClick(copy.settings.feedback)}
              />
            </div>
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
    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 px-2">{title}</h3>
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
      className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors cursor-pointer border-b border-neutral-100 last:border-0"
    >
      <div className="flex items-center gap-4">
        <div className="text-neutral-400">{icon}</div>
        <span className="font-semibold text-neutral-800 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm font-medium text-neutral-400">{value}</span>}
        {onToggle !== undefined ? (
          <div
            className={`w-10 h-6 rounded-full p-1 flex transition-colors duration-200 ${
              toggle ? 'bg-emerald-500 justify-end' : 'bg-neutral-200 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        ) : (
          <span className="text-neutral-300 text-xl">›</span>
        )}
      </div>
    </div>
  );
}

function StarIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
