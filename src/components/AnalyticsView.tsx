import React from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { DayRecord, PaymentTransaction, PayoutCategory, DEFAULT_CATEGORIES } from '../types';
import { calculateMonthExpectedPayout, formatCurrency } from '../utils/calculations';
import { format, subMonths } from 'date-fns';
import { uk } from 'date-fns/locale';

interface AnalyticsViewProps {
  dayRecords: DayRecord[];
  transactions: PaymentTransaction[];
  baseMonthlySalary: number;
  categories?: PayoutCategory[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  dayRecords,
  transactions,
  baseMonthlySalary,
  categories = DEFAULT_CATEGORIES
}) => {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i);
    months.push(format(d, 'yyyy-MM'));
  }

  const monthlyData = months.map((yearMonth) => {
    const calc = calculateMonthExpectedPayout(
      yearMonth,
      dayRecords,
      categories,
      baseMonthlySalary
    );
    const monthTx = transactions.filter((t) => t.targetMonth === yearMonth);
    const received = monthTx.reduce((sum, t) => sum + t.amount, 0);

    const [y, m] = yearMonth.split('-').map(Number);
    const dateObj = new Date(y, m - 1, 1);
    const monthName = format(dateObj, 'LLL yyyy', { locale: uk });

    return {
      yearMonth,
      monthName,
      expected: calc.totalExpected,
      received,
      balance: received - calc.totalExpected,
      combatDays: calc.combatDaysCount
    };
  });

  const maxAmount = Math.max(
    ...monthlyData.map((d) => Math.max(d.expected, d.received)),
    100000
  );

  const categoryCounts: Record<string, number> = {};
  dayRecords.forEach((r) => {
    categoryCounts[r.typeId] = (categoryCounts[r.typeId] || 0) + 1;
  });

  const totalRecordedDays = dayRecords.length || 1;

  const totalExpectedAll = monthlyData.reduce((s, m) => s + m.expected, 0);
  const totalReceivedAll = monthlyData.reduce((s, m) => s + m.received, 0);
  const totalDebt = Math.max(0, totalExpectedAll - totalReceivedAll);

  return (
    <div className="space-y-6">
      {/* Overview Analytics Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Аналітика та Фінансові Тренди (Останні 6 місяців)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block mb-1">Середній дохід на місяць:</span>
            <span className="text-xl font-black text-emerald-700">
              {formatCurrency(totalExpectedAll / 6)}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block mb-1">Загальний борг частини:</span>
            <span className={`text-xl font-black ${totalDebt > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {totalDebt > 0 ? `-${formatCurrency(totalDebt)}` : 'Заборгованості немає ✓'}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block mb-1">Зафіксовано днів служби:</span>
            <span className="text-xl font-black text-amber-800">{dayRecords.length} днів</span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Порівняння Нараховано vs Отримано
          </h3>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-600" />
              <span className="text-slate-600">Нараховано</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500 border border-blue-600" />
              <span className="text-slate-600">Отримано</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {monthlyData.map((d) => {
            const expectedWidth = Math.round((d.expected / maxAmount) * 100);
            const receivedWidth = Math.round((d.received / maxAmount) * 100);

            return (
              <div key={d.yearMonth} className="space-y-1.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span className="capitalize font-black text-slate-900">{d.monthName}</span>
                  <div className="flex gap-3 font-extrabold">
                    <span className="text-emerald-700">Очік: {formatCurrency(d.expected)}</span>
                    <span className="text-blue-700">Отрим: {formatCurrency(d.received)}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${expectedWidth}%` }}
                  />
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${receivedWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution of Service Days */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-amber-600" />
          Розподіл типів службової діяльності (За весь час)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const percentage = Math.round((count / totalRecordedDays) * 100);

            return (
              <div
                key={cat.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between ${cat.color}`}
              >
                <div>
                  <div className="text-xs font-black">{cat.name}</div>
                  <div className="text-[11px] opacity-90 font-bold">{count} днів ({percentage}%)</div>
                </div>
                <div className="text-base font-black px-2.5 py-1 rounded-lg bg-white/80 border border-black/10 text-slate-900 shadow-2xs">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
