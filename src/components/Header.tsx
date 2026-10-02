import React from 'react';
import { ShieldCheck, Calendar, Wallet, Settings, BarChart3, Sun, Moon, FileText } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calendar' | 'reconciliation' | 'analytics' | 'settings';
  setActiveTab: (tab: 'calendar' | 'reconciliation' | 'analytics' | 'settings') => void;
  combatDaysCount: number;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  combatDaysCount,
  isDarkMode,
  setIsDarkMode,
  onOpenReportModal
}) => {
  const currentCycleDays = combatDaysCount % 30;

  return (
    <>
      {/* Top Header */}
      <header className={`sticky top-0 z-40 border-b px-4 py-3 shadow-xs transition-colors ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white/90 backdrop-blur-md border-slate-200/80 text-slate-900'
      }`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold flex items-center gap-2 leading-tight">
                Виплати ЗСУ
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Offline
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Облік грошового забезпечення</p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Report Button */}
            <button
              onClick={onOpenReportModal}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 transition-colors"
              title="Сформувати витяг за місяць"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Витяг</span>
            </button>

            {/* Light / Dark theme toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title={isDarkMode ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* 70k Counter Badge */}
            <div
              onClick={() => setActiveTab('calendar')}
              className="cursor-pointer bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl px-3 py-1.5 flex items-center gap-2 transition-colors"
              title="Дні на нулі до виплати 70 000 грн"
            >
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-amber-800 uppercase font-semibold">70к бали</div>
                <div className="text-xs font-black text-amber-900">{currentCycleDays}/30 дн.</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                70к
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Календар</span>
            </button>

            <button
              onClick={() => setActiveTab('reconciliation')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'reconciliation'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Звірка</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Аналітика</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Налаштування</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (iOS / Android Native Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'calendar' ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Календар</span>
        </button>

        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'reconciliation' ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Звірка</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'analytics' ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px]">Аналітика</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'settings' ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Налаштування</span>
        </button>
      </nav>
    </>
  );
};
