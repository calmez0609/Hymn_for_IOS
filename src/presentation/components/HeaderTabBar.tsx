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
    <div className="w-full bg-[#009688] text-white shadow-md select-none shrink-0">
      <div className="flex items-center justify-around h-14 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
                isActive ? 'text-white font-medium' : 'text-teal-100/70 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[11px] leading-none">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-white rounded-t-full shadow" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
