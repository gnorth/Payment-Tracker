import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  parseISO,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { uk } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, MessageSquare, ShieldAlert, CheckCircle } from 'lucide-react';
import { DayRecord, PayoutCategory, DEFAULT_CATEGORIES } from '../types';
import { getDailyRateForMonth, formatCurrency } from '../utils/calculations';

interface CalendarViewProps {
  currentMonth: string; // "YYYY-MM"
  setCurrentMonth: (month: string) => void;
  dayRecords: DayRecord[];
  onSaveDayRecord: (record: DayRecord) => void;
  onDeleteDayRecord: (date: string) => void;
  categories?: PayoutCategory[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentMonth,
  setCurrentMonth,
  dayRecords,
  onSaveDayRecord,
  onDeleteDayRecord,
  categories = DEFAULT_CATEGORIES
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('combat_100k');
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [orderInput, setOrderInput] = useState<string>('');
  const [isPaidOutInput, setIsPaidOutInput] = useState<boolean>(false);

  // Parse month dates
  const [yearStr, monthStr] = currentMonth.split('-');
  const monthDate = new Date(Number(yearStr), Number(monthStr) - 1, 1);

  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Ukrainian day names header (Понеділок - Неділя)
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  // Offset for first day of month (Monday = 0, Sunday = 6)
  const firstDayIndex = (getDay(monthStart) + 6) % 7;

  // Map of records by date
  const recordMap = new Map<string, DayRecord>();
  dayRecords.forEach((r) => recordMap.set(r.date, r));

  const categoryMap = new Map<string, PayoutCategory>();
  categories.forEach((c) => categoryMap.set(c.id, c));

  const handlePrevMonth = () => {
    const prev = subMonths(monthDate, 1);
    setCurrentMonth(format(prev, 'yyyy-MM'));
  };

  const handleNextMonth = () => {
    const next = addMonths(monthDate, 1);
    setCurrentMonth(format(next, 'yyyy-MM'));
  };

  const handleDayClick = (dateStr: string) => {
    const existing = recordMap.get(dateStr);

    if (activeDay === dateStr) {
      // Toggle off detail modal
      setActiveDay(null);
      return;
    }

    // Apply selected stamp directly if no details panel open
    const newRecord: DayRecord = {
      date: dateStr,
      typeId: selectedCategory,
      notes: existing?.notes || '',
      orderNumber: existing?.orderNumber || '',
      isPaidOut: existing?.isPaidOut || false
    };

    onSaveDayRecord(newRecord);
    setActiveDay(dateStr);
    setNotesInput(existing?.notes || '');
    setOrderInput(existing?.orderNumber || '');
    setIsPaidOutInput(existing?.isPaidOut || false);
  };

  const handleSaveDetails = () => {
    if (!activeDay) return;
    const existing = recordMap.get(activeDay);
    if (!existing) return;

    onSaveDayRecord({
      ...existing,
      notes: notesInput,
      orderNumber: orderInput,
      isPaidOut: isPaidOutInput
    });
    setActiveDay(null);
  };

  const handleClearDay = (dateStr: string) => {
    onDeleteDayRecord(dateStr);
    if (activeDay === dateStr) {
      setActiveDay(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Selection Bar (Stamp Palette) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg">
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2 flex items-center justify-between">
          <span>Оберіть тип виплати (Штамп дня):</span>
          <span className="text-[11px] text-emerald-400 font-normal">Натискайте на дні в календарі для нанесення</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const rate = getDailyRateForMonth(cat, currentMonth);

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  cat.color
                } ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-105 shadow-md'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                <span>{cat.shortName}</span>
                {rate > 0 && (
                  <span className="text-[10px] opacity-75 bg-black/30 px-1.5 py-0.5 rounded">
                    ~{Math.round(rate)} грн/дн
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Header Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-slate-100 capitalize">
            {format(monthDate, 'LLLL yyyy', { locale: uk })}
          </h2>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
          {weekDays.map((day, idx) => (
            <div
              key={day}
              className={`text-xs font-bold py-1 ${
                idx >= 5 ? 'text-rose-400' : 'text-slate-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty offset slots */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 sm:h-24 bg-slate-950/40 rounded-xl border border-slate-900/50" />
          ))}

          {/* Month Days */}
          {daysInMonth.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const record = recordMap.get(dateStr);
            const category = record ? categoryMap.get(record.typeId) : null;
            const isActive = activeDay === dateStr;
            const rate = category ? record?.customRate ?? getDailyRateForMonth(category, currentMonth) : 0;

            return (
              <div
                key={dateStr}
                onClick={() => handleDayClick(dateStr)}
                className={`h-20 sm:h-24 p-1.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden select-none ${
                  category
                    ? `${category.color} border-slate-700 shadow-sm`
                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                } ${isActive ? 'ring-2 ring-emerald-400 z-10' : ''}`}
              >
                {/* Top Day row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    {format(day, 'd')}
                  </span>

                  {record?.isPaidOut && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 rounded px-1 flex items-center gap-0.5" title="Виплату за цей день проведено">
                      <CheckCircle className="w-2.5 h-2.5" />
                      ✓✓
                    </span>
                  )}
                </div>

                {/* Center Badge / Category Name */}
                {category ? (
                  <div className="my-auto">
                    <div className="text-[10px] sm:text-xs font-extrabold truncate">
                      {category.shortName}
                    </div>
                    {rate > 0 && (
                      <div className="text-[9px] opacity-80 font-mono">
                        +{Math.round(rate)} ₴
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[9px] text-slate-600 text-center my-auto">
                    порожньо
                  </div>
                )}

                {/* Bottom notes indicator */}
                {(record?.notes || record?.orderNumber) && (
                  <div className="text-[9px] text-amber-300 bg-black/40 px-1 py-0.5 rounded truncate flex items-center gap-1">
                    <MessageSquare className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{record.orderNumber || record.notes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Editor Modal / Panel for selected active day */}
      {activeDay && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              Редагування дня: {activeDay}
            </h3>
            <button
              onClick={() => handleClearDay(activeDay)}
              className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/50 border border-rose-800 px-2 py-1 rounded-lg"
            >
              Очистити день
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 font-semibold mb-1">
                Бойове Розпорядження / Наказ (БР №):
              </label>
              <input
                type="text"
                placeholder="наприклад: БР №14/2026"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-semibold mb-1">
                Примітки / Сектор / Завдання:
              </label>
              <input
                type="text"
                placeholder="наприклад: НП Північний, розрахунок"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPaidOut"
              checked={isPaidOutInput}
              onChange={(e) => setIsPaidOutInput(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isPaidOut" className="text-xs font-semibold text-slate-200 cursor-pointer">
              Виплату за цей день уже отримано (зафіксовано фіно)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setActiveDay(null)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Скасувати
            </button>
            <button
              onClick={handleSaveDetails}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Зберегти примітки
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
