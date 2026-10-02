import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  parseISO,
  subMonths,
  addMonths,
  eachDayOfInterval as getRangeDays
} from 'date-fns';
import { uk } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, MessageSquare, CheckCircle, Layers, Sparkles } from 'lucide-react';
import { DayRecord, PayoutCategory, DEFAULT_CATEGORIES } from '../types';
import { getDailyRateForMonth, formatCurrency } from '../utils/calculations';

interface CalendarViewProps {
  currentMonth: string; // "YYYY-MM"
  setCurrentMonth: (month: string) => void;
  dayRecords: DayRecord[];
  onSaveDayRecord: (record: DayRecord) => void;
  onDeleteDayRecord: (date: string) => void;
  onBatchSaveRecords: (records: DayRecord[]) => void;
  categories?: PayoutCategory[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentMonth,
  setCurrentMonth,
  dayRecords,
  onSaveDayRecord,
  onDeleteDayRecord,
  onBatchSaveRecords,
  categories = DEFAULT_CATEGORIES
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('combat_100k');
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [orderInput, setOrderInput] = useState<string>('');
  const [isPaidOutInput, setIsPaidOutInput] = useState<boolean>(false);

  // Range selection state
  const [showRangeSelector, setShowRangeSelector] = useState<boolean>(false);
  const [rangeStart, setRangeStart] = useState<string>('');
  const [rangeEnd, setRangeEnd] = useState<string>('');
  const [rangeOrderNumber, setRangeOrderNumber] = useState<string>('');

  // Parse month dates
  const [yearStr, monthStr] = currentMonth.split('-');
  const monthDate = new Date(Number(yearStr), Number(monthStr) - 1, 1);

  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const firstDayIndex = (getDay(monthStart) + 6) % 7;

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
      setActiveDay(null);
      return;
    }

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

  const handleApplyRange = () => {
    if (!rangeStart || !rangeEnd) return;
    const startDate = parseISO(rangeStart);
    const endDate = parseISO(rangeEnd);

    if (startDate > endDate) {
      alert('Дата початку не може бути пізніше дати кінця!');
      return;
    }

    const intervalDays = getRangeDays({ start: startDate, end: endDate });
    const newRecords: DayRecord[] = intervalDays.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const existing = recordMap.get(dateStr);
      return {
        date: dateStr,
        typeId: selectedCategory,
        notes: existing?.notes || '',
        orderNumber: rangeOrderNumber || existing?.orderNumber || '',
        isPaidOut: existing?.isPaidOut || false
      };
    });

    onBatchSaveRecords(newRecords);
    setShowRangeSelector(false);
    setRangeStart('');
    setRangeEnd('');
    setRangeOrderNumber('');
  };

  return (
    <div className="space-y-4">
      {/* Category Stamp Palette & Range Selector */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="text-xs uppercase tracking-wider font-bold text-slate-500">
            Оберіть тип виплати (Штамп дня):
          </div>
          <button
            onClick={() => setShowRangeSelector(!showRangeSelector)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              showRangeSelector
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Масове відмічання днів</span>
          </button>
        </div>

        {/* Range Selector Drawer */}
        {showRangeSelector && (
          <div className="bg-slate-50 border border-amber-200 p-4 rounded-xl space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Швидке нанесення типу виплати на період днів
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 font-bold mb-1">З дати:</label>
                <input
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">По дату:</label>
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Бойове Розпорядження (БР №):</label>
                <input
                  type="text"
                  placeholder="наприклад: БР №12/2026"
                  value={rangeOrderNumber}
                  onChange={(e) => setRangeOrderNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <button
              onClick={handleApplyRange}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Застосувати штамп до вказаних днів
            </button>
          </div>
        )}

        {/* Scrollable Category Stamps (Mobile Thumb Palette) */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const rate = getDailyRateForMonth(cat, currentMonth);

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border shrink-0 transition-all active:scale-95 ${
                  cat.color
                } ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white scale-105 shadow-xs font-black'
                    : 'opacity-90 hover:opacity-100'
                }`}
              >
                <span>{cat.shortName}</span>
                {rate > 0 && (
                  <span className="text-[10px] bg-white/60 px-1.5 py-0.5 rounded border border-black/5">
                    ~{Math.round(rate)} ₴/дн
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Navigation & Grid */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-extrabold text-slate-900 capitalize">
            {format(monthDate, 'LLLL yyyy', { locale: uk })}
          </h2>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
          {weekDays.map((day, idx) => (
            <div
              key={day}
              className={`text-xs font-bold py-1 ${
                idx >= 5 ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 sm:h-22 bg-slate-100/50 rounded-xl border border-slate-100" />
          ))}

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
                className={`h-16 sm:h-22 p-1.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden select-none active:scale-95 ${
                  category
                    ? `${category.color} border-slate-300 shadow-2xs`
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                } ${isActive ? 'ring-2 ring-emerald-500 z-10' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    {format(day, 'd')}
                  </span>

                  {record?.isPaidOut && (
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 rounded px-1 flex items-center gap-0.5 font-bold" title="Виплату проведено">
                      <CheckCircle className="w-2.5 h-2.5" />
                      ✓✓
                    </span>
                  )}
                </div>

                {category ? (
                  <div className="my-auto">
                    <div className="text-[10px] sm:text-xs font-extrabold truncate">
                      {category.shortName}
                    </div>
                    {rate > 0 && (
                      <div className="text-[9px] opacity-80 font-mono font-bold">
                        +{Math.round(rate)} ₴
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[9px] text-slate-400 text-center my-auto font-medium">
                    порожньо
                  </div>
                )}

                {(record?.notes || record?.orderNumber) && (
                  <div className="text-[9px] text-amber-900 bg-amber-100 border border-amber-200 px-1 py-0.5 rounded truncate flex items-center gap-1 font-semibold">
                    <MessageSquare className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{record.orderNumber || record.notes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {activeDay && (
        <div className="bg-white border border-emerald-300 rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
              Редагування дня: {activeDay}
            </h3>
            <button
              onClick={() => handleClearDay(activeDay)}
              className="text-xs text-rose-700 hover:text-rose-800 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg font-semibold"
            >
              Очистити день
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 font-bold mb-1">
                Бойове Розпорядження / Наказ (БР №):
              </label>
              <input
                type="text"
                placeholder="наприклад: БР №14/2026"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 font-bold mb-1">
                Примітки / Сектор / Завдання:
              </label>
              <input
                type="text"
                placeholder="наприклад: НП Північний"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPaidOut"
              checked={isPaidOutInput}
              onChange={(e) => setIsPaidOutInput(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isPaidOut" className="text-xs font-bold text-slate-800 cursor-pointer">
              Виплату за цей день уже отримано (зафіксовано фіно)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setActiveDay(null)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Скасувати
            </button>
            <button
              onClick={handleSaveDetails}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1"
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
