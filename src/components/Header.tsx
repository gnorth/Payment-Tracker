import React from 'react';
import { ShieldCheck, Calendar, Wallet, Settings, HardDriveDownload } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calendar' | 'reconciliation' | 'settings';
  setActiveTab: (tab: 'calendar' | 'reconciliation' | 'settings') => void;
  combatDaysCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, combatDaysCount }) => {
  const currentCycleDays = combatDaysCount % 30;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
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

        {/* 70k Milestone Mini-Badge */}
        <div 
          onClick={() => setActiveTab('calendar')}
          className="cursor-pointer bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-2.5 transition-colors"
          title="Дні на нулі до виплати 70 000 грн"
        >
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Лічильник 70к</div>
            <div className="text-xs font-bold text-amber-400">
              {currentCycleDays} / 30 днів
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
            70к
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
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
            <span>Звірка Виплат</span>
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
