import { ListChecks, List, Plus, BarChart3, User } from 'lucide-react';
import { useAppStore } from '@/store';
import { useI18n } from '@/hooks/useI18n';

export function TabBar() {
  const { activeTab, setActiveTab } = useAppStore();
  const { copy } = useI18n();

  const tabs = [
    { id: 'commands', icon: <ListChecks size={20} />, label: copy.tabs.commands },
    { id: 'active', icon: <List size={20} />, label: copy.tabs.active },
    { id: 'capture', icon: <Plus size={24} />, label: copy.tabs.capture },
    { id: 'stats', icon: <BarChart3 size={20} />, label: copy.tabs.stats },
    { id: 'profile', icon: <User size={20} />, label: copy.tabs.profile },
  ] as const;

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-50">
      <div className="relative bg-white/80 backdrop-blur-xl notion-shadow border border-neutral-200/50 rounded-2xl flex items-center justify-between p-1 px-2 h-16">
        <div
          className="absolute h-12 bg-neutral-100 rounded-xl transition-all duration-300 ease-out z-0"
          style={{
            width: `${100 / tabs.length - 2}%`,
            left: `${activeIndex * (100 / tabs.length) + 1}%`,
          }}
        />
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            isCapture={tab.id === 'capture'}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </div>
    </nav>
  );
}

interface TabButtonProps {
  active: boolean;
  isCapture?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, isCapture, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center justify-center transition-colors duration-200 h-full z-10 ${
        active ? 'text-neutral-900' : 'text-neutral-400'
      }`}
    >
      <div className={`${isCapture ? 'bg-neutral-900 text-white p-2 rounded-full -mt-1 notion-shadow' : ''}`}>
        {icon}
      </div>
      {!isCapture && <span className="text-[10px] mt-1 font-medium">{label}</span>}
    </button>
  );
}
