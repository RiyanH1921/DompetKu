import React from 'react';
import { Home, List, TrendingUp, BarChart3, Settings } from 'lucide-react';

export type TabType = 'beranda' | 'riwayat' | 'investasi' | 'grafik' | 'pengaturan';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'beranda' as TabType, label: 'Beranda', icon: Home },
    { id: 'riwayat' as TabType, label: 'Riwayat', icon: List },
    { id: 'investasi' as TabType, label: 'Investasi', icon: TrendingUp },
    { id: 'grafik' as TabType, label: 'Grafik', icon: BarChart3 },
    { id: 'pengaturan' as TabType, label: 'Pengaturan', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#F6F5EE] dark:bg-[#121614] border-t border-[#E3E1D5] dark:border-[#242C26] z-30 px-3 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 transition-colors duration-200 group relative ${
                isActive
                  ? 'text-[#1B3B2B] dark:text-[#E8F0EA] font-semibold'
                  : 'text-[#878B83] dark:text-[#7A827B] hover:text-[#1B3B2B] dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 text-[#1B3B2B] dark:text-[#D1A658]' : 'group-hover:scale-105'
                  }`}
                />
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

