import React from 'react';
import { ChevronLeft, ChevronRight, Award, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { subMonths, addMonths, format } from 'date-fns';
import { uk } from 'date-fns/locale';

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
  const [yearStr, monthStr] = currentMonth.split('-');
  const monthDate = new Date(Number(yearStr), Number(monthStr) - 1, 1);

  const balance = receivedTotal - expectedTotal;
  const isFullyPaid = balance >= 0 && receivedTotal > 0;
  const isShortfall = balance < 0 && receivedTotal > 0;

  const currentCycleDays = totalCombatDays % 30;
  const daysRemaining70k = 30 - currentCycleDays;
  const progressPercent = Math.min(100, Math.round((currentCycleDays / 30) * 100));

  const handlePrev = () => {
    setCurrentMonth(format(subMonths(monthDate, 1), 'yyyy-MM'));
  };

  const handleNext = () => {
    setCurrentMonth(format(addMonths(monthDate, 1), 'yyyy-MM'));
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 mb-4 space-y-4">
      {/* Month Navigator & Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-bold text-slate-900 capitalize">
            {format(monthDate, 'LLLL yyyy', { locale: uk })}
          </span>

          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge */}
        {receivedTotal === 0 ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            Очікує виплати
          </span>
        ) : isFullyPaid ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Виплачено
          </span>
        ) : isShortfall ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Недоплата: {formatCurrency(Math.abs(balance))}
          </span>
        ) : null}
      </div>

      {/* Main Hero Amount */}
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          Очікуване нарахування
        </div>
        <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {formatCurrency(expectedTotal)}
        </div>
      </div>

      {/* Key breakdown line */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs pt-1 border-t border-slate-100">
        <div className="text-slate-500">
          База ОГЗ: <strong className="text-slate-800 font-bold">{formatCurrency(baseSalary)}</strong>
        </div>
        <span className="text-slate-300">•</span>
        <div className="text-slate-500">
          Додаткова: <strong className="text-emerald-700 font-bold">+{formatCurrency(additionalRewards)}</strong> ({combatDaysInMonth} дн.)
        </div>
        {receivedTotal > 0 && (
          <>
            <span className="text-slate-300">•</span>
            <div className="text-slate-500">
              Зайшло: <strong className="text-blue-700 font-bold">{formatCurrency(receivedTotal)}</strong>
            </div>
          </>
        )}
      </div>

      {/* 70k Milestone Mini Progress Bar */}
      <div className="pt-2 bg-amber-50/60 p-3 rounded-2xl border border-amber-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-amber-950 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            Виплата 70 000 грн за «нуль»
          </span>
          <span className="font-extrabold text-amber-900">
            {currentCycleDays} / 30 днів
          </span>
        </div>

        <div className="w-full bg-amber-100/80 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-[11px] text-amber-800/80 mt-1 flex justify-between">
          <span>{currentCycleDays > 0 ? `Залишилось: ${daysRemaining70k} дн.` : 'Початок нового циклу'}</span>
          <span>Всього бойових: <strong>{totalCombatDays} дн.</strong></span>
        </div>
      </div>
    </div>
  );
};
