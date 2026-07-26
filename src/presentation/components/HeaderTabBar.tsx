import React from 'react';
import { Home, Search, History, Settings } from 'lucide-react';

interface HeaderTabBarProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export const HeaderTabBar: React.FC<HeaderTabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 0, label: '主頁', icon: Home },
    { id: 1, label: '搜尋', icon: Search },
    { id: 2, label: '歷史紀錄', icon: History },
    { id: 3, label: '設置', icon: Settings },
  ];

  return (
    <div className="w-full bg-[#009688] text-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] select-none shrink-0 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14 sm:h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
                isActive ? 'text-white font-semibold' : 'text-teal-100/70 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] sm:text-xs leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
