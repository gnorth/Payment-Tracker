import React from 'react';
import { Wallet, AlertTriangle, CheckCircle2, Award, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface DashboardProps {
  currentMonth: string; // YYYY-MM
  setCurrentMonth: (month: string) => void;
  expectedTotal: number;
  baseSalary: number;
  additionalRewards: number;
  receivedTotal: number;
  combatDaysInMonth: number;
  totalCombatDays: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentMonth,
  setCurrentMonth,
  expectedTotal,
  baseSalary,
  additionalRewards,
  receivedTotal,
  combatDaysInMonth,
  totalCombatDays
}) => {
  const balance = receivedTotal - expectedTotal;
  const isFullyPaid = balance >= 0 && receivedTotal > 0;
  const isShortfall = balance < 0 && receivedTotal > 0;

  const currentCycleDays = totalCombatDays % 30;
  const progressPercent = Math.min(100, Math.round((currentCycleDays / 30) * 100));

  return (
    <div className="space-y-4 mb-6">
      {/* Month Selector bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">Період обліку:</span>
        </div>
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-emerald-400 text-sm font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Expected Amount */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Очікується за місяць
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100 mb-1">
            {formatCurrency(expectedTotal)}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>База (ОГЗ): <strong className="text-slate-200">{formatCurrency(baseSalary)}</strong></span>
            <span>•</span>
            <span>Додаткова: <strong className="text-emerald-400">{formatCurrency(additionalRewards)}</strong></span>
          </div>
        </div>

        {/* Card 2: Actually Received */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Фактично Отримано
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100 mb-1">
            {formatCurrency(receivedTotal)}
          </div>

          {/* Status indicators */}
          {receivedTotal === 0 ? (
            <div className="text-xs text-slate-500 font-medium">Виплати ще не зараховано</div>
          ) : isFullyPaid ? (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Виплачено повністю!</span>
            </div>
          ) : isShortfall ? (
            <div className="text-xs text-rose-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Недоплата: {formatCurrency(Math.abs(balance))}</span>
            </div>
          ) : null}
        </div>

        {/* Card 3: 70k Milestone Widget */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-400" />
                Виплата 70 000 грн (30 днів)
              </span>
              <span className="text-xs font-bold text-slate-300">
                {currentCycleDays} / 30 днів
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>У цьому місяці на нулі: <strong className="text-slate-200">{combatDaysInMonth} дн.</strong></span>
            <span>Загалом: <strong className="text-amber-400">{totalCombatDays} дн.</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
