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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold text-slate-800">Період обліку:</span>
        </div>
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="bg-slate-50 border border-slate-300 text-slate-900 text-sm font-extrabold px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Expected Amount */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Очікується за місяць
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">
              {formatCurrency(expectedTotal)}
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2 pt-2 border-t border-slate-100">
            <span>База: <strong className="text-slate-800 font-bold">{formatCurrency(baseSalary)}</strong></span>
            <span>•</span>
            <span>Додаткова: <strong className="text-emerald-700 font-bold">{formatCurrency(additionalRewards)}</strong></span>
          </div>
        </div>

        {/* Card 2: Actually Received */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Фактично Отримано
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">
              {formatCurrency(receivedTotal)}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {receivedTotal === 0 ? (
              <div className="text-xs text-slate-400 font-medium">Виплати за цей місяць ще очікуються</div>
            ) : isFullyPaid ? (
              <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Виплачено повністю!</span>
              </div>
            ) : isShortfall ? (
              <div className="text-xs text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Недоплата: {formatCurrency(Math.abs(balance))}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Card 3: 70k Milestone Widget */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-800 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-600" />
                Виплата 70 000 грн (30 днів)
              </span>
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                {currentCycleDays} / 30 дн.
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 mb-2">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>У цьому місяці на нулі: <strong className="text-slate-800 font-bold">{combatDaysInMonth} дн.</strong></span>
            <span>Всього: <strong className="text-amber-800 font-bold">{totalCombatDays} дн.</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
