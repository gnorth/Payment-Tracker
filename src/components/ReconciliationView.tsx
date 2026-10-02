import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, AlertTriangle, Wallet } from 'lucide-react';
import { PaymentTransaction } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ReconciliationViewProps {
  currentMonth: string; // YYYY-MM
  expectedTotal: number;
  transactions: PaymentTransaction[];
  onAddTransaction: (tx: PaymentTransaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const ReconciliationView: React.FC<ReconciliationViewProps> = ({
  currentMonth,
  expectedTotal,
  transactions,
  onAddTransaction,
  onDeleteTransaction
}) => {
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().split('T')[0]);
  const [targetMonthInput, setTargetMonthInput] = useState<string>(currentMonth);
  const [amountInput, setAmountInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<PaymentTransaction['category']>('additional_reward');
  const [notesInput, setNotesInput] = useState<string>('');

  const monthTransactions = transactions.filter((t) => t.targetMonth === currentMonth);
  const totalReceivedForMonth = monthTransactions.reduce((acc, t) => acc + t.amount, 0);

  const balance = totalReceivedForMonth - expectedTotal;
  const isShortfall = balance < 0 && totalReceivedForMonth > 0;
  const isPaidFully = balance >= 0 && totalReceivedForMonth > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountInput);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const newTx: PaymentTransaction = {
      id: Date.now().toString(),
      date: dateInput,
      targetMonth: targetMonthInput,
      amount: numAmount,
      category: categoryInput,
      notes: notesInput
    };

    onAddTransaction(newTx);
    setAmountInput('');
    setNotesInput('');
  };

  const getCategoryLabel = (cat: PaymentTransaction['category']) => {
    switch (cat) {
      case 'base_salary':
        return 'Основне ГЗ (База)';
      case 'additional_reward':
        return 'Додаткова винагорода (Бойові/Спец)';
      case 'bonus_70k':
        return 'Виплата 70 000 грн (30 днів)';
      case 'wellness':
        return 'Оздоровчі (Грошова допомога)';
      case 'material_help':
        return 'Матеріальна допомога';
      default:
        return 'Інша виплата';
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly Audit Overview Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Wallet className="w-5 h-5 text-emerald-600" />
          Звірка Виплат за період: <span className="text-emerald-700 font-black">{currentMonth}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block mb-1">Нараховано за днями:</span>
            <span className="text-xl font-black text-slate-900">{formatCurrency(expectedTotal)}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block mb-1">Фактично зараховано:</span>
            <span className="text-xl font-black text-blue-700">{formatCurrency(totalReceivedForMonth)}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block mb-1">Статус / Баланс:</span>
            {totalReceivedForMonth === 0 ? (
              <span className="text-sm font-bold text-slate-400">Виплати очікуються</span>
            ) : isPaidFully ? (
              <span className="text-sm font-black text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Виплачено повністю!
              </span>
            ) : isShortfall ? (
              <span className="text-sm font-black text-rose-700 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Борг частини: {formatCurrency(Math.abs(balance))}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Add New Transaction Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          Зафіксувати отримані кошти з банку
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-slate-600 font-bold mb-1">Дата надходження:</label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 font-bold mb-1">За який місяць виплата:</label>
            <input
              type="month"
              value={targetMonthInput}
              onChange={(e) => setTargetMonthInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 font-bold mb-1">Категорія надходження:</label>
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
            >
              <option value="additional_reward">Додаткова винагорода (Бойові/Спец)</option>
              <option value="base_salary">Основне ГЗ (База)</option>
              <option value="bonus_70k">Виплата 70 000 грн (30 днів)</option>
              <option value="wellness">Оздоровчі (Грошова допомога)</option>
              <option value="material_help">Матеріальна допомога</option>
              <option value="other">Інша виплата</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-600 font-bold mb-1">Сума (грн):</label>
            <input
              type="number"
              placeholder="наприклад: 33400"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-black focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-600 font-bold mb-1">Примітка / Банк:</label>
          <input
            type="text"
            placeholder="наприклад: Приват24 / Зараховано 15:40"
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Додати надходження
        </button>
      </form>

      {/* History Log */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">Історія банківських надходжень ({monthTransactions.length})</h3>

        {monthTransactions.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl font-medium">
            За вказаний місяць надходжень не зафіксовано.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Дата</th>
                  <th className="p-3">Категорія</th>
                  <th className="p-3">Примітка</th>
                  <th className="p-3 text-right">Сума</th>
                  <th className="p-3 text-center">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{tx.date}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-800">
                        {getCategoryLabel(tx.category)}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{tx.notes || '—'}</td>
                    <td className="p-3 text-right font-black text-emerald-700 text-sm">
                      +{formatCurrency(tx.amount)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => tx.id && onDeleteTransaction(tx.id)}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
                        title="Видалити запис"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
