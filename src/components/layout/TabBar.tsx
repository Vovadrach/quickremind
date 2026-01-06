import { Zap, List, PlusCircle, BarChart3, User } from 'lucide-react';
import { useAppStore } from '@/store';
import { useI18n } from '@/hooks/useI18n';

export function TabBar() {
  const { activeTab, setActiveTab } = useAppStore();
  const { copy } = useI18n();

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 flex items-center justify-around py-3 px-2 z-50">
      <TabButton
        active={activeTab === 'commands'}
        onClick={() => setActiveTab('commands')}
        icon={<Zap size={24} />}
        label={copy.tabs.commands}
      />
      <TabButton
        active={activeTab === 'active'}
        onClick={() => setActiveTab('active')}
        icon={<List size={24} />}
        label={copy.tabs.active}
      />
      <TabButton
        active={activeTab === 'capture'}
        onClick={() => setActiveTab('capture')}
        icon={<PlusCircle size={36} className="text-blue-600" />}
        label={copy.tabs.capture}
        large
      />
      <TabButton
        active={activeTab === 'stats'}
        onClick={() => setActiveTab('stats')}
        icon={<BarChart3 size={24} />}
        label={copy.tabs.stats}
      />
      <TabButton
        active={activeTab === 'profile'}
        onClick={() => setActiveTab('profile')}
        icon={<User size={24} />}
        label={copy.tabs.profile}
      />
    </nav>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  large?: boolean;
}

function TabButton({ active, onClick, icon, label, large }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition-all duration-200 ${
        active ? (large ? 'scale-110' : 'text-blue-600') : 'text-gray-400'
      }`}
    >
      <div className={`${large ? '-mt-6 mb-1 bg-white rounded-full p-1 shadow-lg' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-medium mt-0.5 ${large ? 'mt-0 font-bold' : ''}`}>
        {label}
      </span>
    </button>
  );
}
