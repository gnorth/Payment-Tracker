import React, { useState } from 'react';
import { FileText, Copy, Check, Printer, X } from 'lucide-react';
import { DayRecord, PayoutCategory, DEFAULT_CATEGORIES } from '../types';
import { calculateMonthExpectedPayout, formatCurrency } from '../utils/calculations';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string;
  dayRecords: DayRecord[];
  baseMonthlySalary: number;
  rank?: string;
  position?: string;
  categories?: PayoutCategory[];
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentMonth,
  dayRecords,
  baseMonthlySalary,
  rank = '',
  position = '',
  categories = DEFAULT_CATEGORIES
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const monthCalc = calculateMonthExpectedPayout(
    currentMonth,
    dayRecords,
    categories,
    baseMonthlySalary
  );

  const [y, m] = currentMonth.split('-').map(Number);
  const dateObj = new Date(y, m - 1, 1);
  const monthName = format(dateObj, 'LLLL yyyy', { locale: uk });

  // Filter records for this month
  const monthRecords = dayRecords.filter((r) => r.date.startsWith(currentMonth));
  const categoryMap = new Map<string, PayoutCategory>();
  categories.forEach((c) => categoryMap.set(c.id, c));

  // Extract unique orders/BR numbers
  const ordersList = Array.from(
    new Set(monthRecords.map((r) => r.orderNumber).filter(Boolean))
  );

  // Generate clean text report
  const generateTextReport = () => {
    let report = `ВИТЯГ З ОБЛІКУ ГРОШОВОГО ЗАБЕЗПЕЧЕННЯ\n`;
    report += `Період: ${monthName.toUpperCase()}\n`;
    if (rank || position) {
      report += `Військовослужбовець: ${rank} ${position}\n`;
    }
    report += `--------------------------------------------------\n`;
    report += `1. Основне Грошове Забезпечення (ОГЗ): ${formatCurrency(monthCalc.baseSalary)}\n`;
    report += `2. Нараховано за днями виконань завдань:\n`;

    Object.entries(monthCalc.dayBreakdown).forEach(([catId, data]) => {
      report += `   - ${data.name}: ${data.days} дн. = ${formatCurrency(data.totalAmount)}\n`;
    });

    report += `--------------------------------------------------\n`;
    report += `РАЗОМ ОЧІКУЄТЬСЯ ДО ВИПЛАТИ: ${formatCurrency(monthCalc.totalExpected)}\n`;
    report += `Бойових днів на нулі (100к): ${monthCalc.combatDaysCount} дн.\n`;

    if (ordersList.length > 0) {
      report += `\nБойові розпорядження / Накази:\n`;
      ordersList.forEach((ord) => {
        report += ` - ${ord}\n`;
      });
    }

    return report;
  };

  const textReport = generateTextReport();

  const handleCopy = () => {
    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Довідка-Витяг за {monthName}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Paper Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
          {textReport}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Друкувати / Зберегти в PDF
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 font-semibold"
            >
              Закрити
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Скопійовано!' : 'Скопіювати текст'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
