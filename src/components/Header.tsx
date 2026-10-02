import React from 'react';
import { ShieldCheck, Calendar, Wallet, Settings, BarChart3, Moon, Sun, FileText } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calendar' | 'reconciliation' | 'analytics' | 'settings';
  setActiveTab: (tab: 'calendar' | 'reconciliation' | 'analytics' | 'settings') => void;
  combatDaysCount: number;
  stealthMode: boolean;
  setStealthMode: (stealth: boolean) => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  combatDaysCount,
  stealthMode,
  setStealthMode,
  onOpenReportModal
}) => {
  const currentCycleDays = combatDaysCount % 30;

  return (
    <header className={`sticky top-0 z-40 border-b px-4 py-3 shadow-lg transition-colors ${
      stealthMode
        ? 'bg-black border-slate-900'
        : 'bg-slate-900/95 backdrop-blur-md border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-950/50">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2 leading-tight">
              Виплати ЗСУ
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Offline Local
              </span>
            </h1>
            <p className="text-xs text-slate-400">Персональний обліковий трекер</p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-2">
          {/* Report Generator Quick Button */}
          <button
            onClick={onOpenReportModal}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            title="Сформувати довідку-витяг за місяць"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Витяг для рапорту</span>
          </button>

          {/* Stealth Mode (OLED) Toggle */}
          <button
            onClick={() => setStealthMode(!stealthMode)}
            className={`p-2 rounded-xl border transition-colors ${
              stealthMode
                ? 'bg-emerald-950 border-emerald-700 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={stealthMode ? 'Вимкнути Нічний OLED режим' : 'Увімкнути Нічний OLED режим (Світломаскування)'}
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* 70k Milestone Mini-Badge */}
          <div
            onClick={() => setActiveTab('calendar')}
            className="cursor-pointer bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 flex items-center gap-2 transition-colors"
            title="Дні на нулі до виплати 70 000 грн"
          >
            <div className="text-right hidden xs:block">
              <div className="text-[10px] text-slate-400 uppercase font-medium">70к бали</div>
              <div className="text-xs font-bold text-amber-400">
                {currentCycleDays}/30 дн.
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
              70к
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto justify-around sm:justify-start">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'calendar'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Календар</span>
          </button>

          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'reconciliation'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Звірка</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Аналітика</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Налаштування</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
