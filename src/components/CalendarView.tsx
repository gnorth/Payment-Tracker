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
  isToday,
  isSameDay
} from 'date-fns';
import { uk } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Trash2,
  CalendarRange,
  X,
  FileCheck,
  Check
} from 'lucide-react';
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
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [isPaidOut, setIsPaidOut] = useState<boolean>(false);
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

  // Range mode (tap start date, tap end date)
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  // Month date calculations
  const [yearStr, monthStr] = currentMonth.split('-');
  const monthDate = new Date(Number(yearStr), Number(monthStr) - 1, 1);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const firstDayIndex = (getDay(monthStart) + 6) % 7;

  // Record lookup map
  const recordMap = new Map<string, DayRecord>();
  dayRecords.forEach((r) => recordMap.set(r.date, r));

  const categoryMap = new Map<string, PayoutCategory>();
  categories.forEach((c) => categoryMap.set(c.id, c));

  const handlePrevMonth = () => {
    const prev = subMonths(monthDate, 1);
    setCurrentMonth(format(prev, 'yyyy-MM'));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    const next = addMonths(monthDate, 1);
    setCurrentMonth(format(next, 'yyyy-MM'));
    setSelectedDay(null);
  };

  // Day click logic
  const handleDayClick = (dateStr: string) => {
    if (isRangeMode) {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(dateStr);
        setRangeEnd(null);
      } else {
        // We have start, setting end
        if (dateStr < rangeStart) {
          setRangeEnd(rangeStart);
          setRangeStart(dateStr);
        } else {
          setRangeEnd(dateStr);
        }
      }
      return;
    }

    // Normal mode: select day for inspector
    setSelectedDay(dateStr);
    const existing = recordMap.get(dateStr);
    setNoteText(existing?.notes || '');
    setOrderNumber(existing?.orderNumber || '');
    setIsPaidOut(existing?.isPaidOut || false);
    setShowNoteInput(Boolean(existing?.notes || existing?.orderNumber));
  };

  // Apply category to single day
  const handleApplyCategory = (catId: string) => {
    if (!selectedDay) return;
    const existing = recordMap.get(selectedDay);

    onSaveDayRecord({
      date: selectedDay,
      typeId: catId,
      notes: noteText,
      orderNumber: orderNumber,
      isPaidOut: isPaidOut
    });
  };

  // Apply category to range
  const handleApplyRangeCategory = (catId: string) => {
    if (!rangeStart || !rangeEnd) return;

    const start = parseISO(rangeStart);
    const end = parseISO(rangeEnd);
    const days = eachDayOfInterval({ start, end });

    const newRecords: DayRecord[] = days.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const existing = recordMap.get(dateStr);
      return {
        date: dateStr,
        typeId: catId,
        notes: existing?.notes || '',
        orderNumber: orderNumber || existing?.orderNumber || '',
        isPaidOut: existing?.isPaidOut || false
      };
    });

    onBatchSaveRecords(newRecords);
    setIsRangeMode(false);
    setRangeStart(null);
    setRangeEnd(null);
    setOrderNumber('');
  };

  const handleClearSelectedDay = () => {
    if (!selectedDay) return;
    onDeleteDayRecord(selectedDay);
    setNoteText('');
    setOrderNumber('');
    setIsPaidOut(false);
  };

  const activeRecord = selectedDay ? recordMap.get(selectedDay) : null;
  const activeCategory = activeRecord ? categoryMap.get(activeRecord.typeId) : null;
  const activeRate = activeCategory
    ? activeRecord?.customRate ?? getDailyRateForMonth(activeCategory, currentMonth)
    : 0;

  // Visual helper for range highlight
  const isInRange = (dateStr: string) => {
    if (!rangeStart || !rangeEnd) return dateStr === rangeStart;
    return dateStr >= rangeStart && dateStr <= rangeEnd;
  };

  // Color mapper for clean minimal day bubbles
  const getCategoryStyles = (typeId?: string) => {
    switch (typeId) {
      case 'zone_170k':
        return 'bg-red-50 text-red-900 border-red-300 font-extrabold';
      case 'assault_40k':
        return 'bg-rose-100 text-rose-950 border-rose-400 font-black';
      case 'recovery_20k':
        return 'bg-orange-100 text-orange-950 border-orange-400 font-black';
      case 'combat_100k':
        return 'bg-rose-50 text-rose-700 border-rose-300 font-bold';
      case 'zone_70k':
        return 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
      case 'special_50k':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      case 'duty_30k':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300 font-bold';
      case 'sick_100k':
        return 'bg-purple-50 text-purple-700 border-purple-300 font-bold';
      case 'rear_10k':
        return 'bg-slate-100 text-slate-800 border-slate-300 font-semibold';
      case 'base_day':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      case 'vacation':
        return 'bg-sky-50 text-sky-800 border-sky-300 font-semibold';
      case 'training':
        return 'bg-teal-50 text-teal-800 border-teal-300 font-semibold';
      case 'business_trip':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200 font-semibold';
      case 'treatment':
        return 'bg-blue-50 text-blue-900 border-blue-200 font-semibold';
      default:
        return 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50';
    }
  };

  const getCategoryDot = (typeId?: string) => {
    switch (typeId) {
      case 'zone_170k':
        return 'bg-red-600';
      case 'assault_40k':
        return 'bg-rose-600';
      case 'recovery_20k':
        return 'bg-orange-600';
      case 'combat_100k':
        return 'bg-rose-500';
      case 'zone_70k':
        return 'bg-amber-600';
      case 'special_50k':
        return 'bg-amber-500';
      case 'duty_30k':
        return 'bg-yellow-500';
      case 'sick_100k':
        return 'bg-purple-500';
      case 'rear_10k':
        return 'bg-slate-500';
      case 'base_day':
        return 'bg-emerald-500';
      case 'vacation':
        return 'bg-sky-500';
      case 'training':
        return 'bg-teal-500';
      case 'business_trip':
        return 'bg-indigo-500';
      case 'treatment':
        return 'bg-blue-500';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100">
        {/* Month Header & Controls */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 capitalize tracking-tight">
              {format(monthDate, 'LLLL yyyy', { locale: uk })}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {isRangeMode ? 'Оберіть початковий і кінцевий день' : 'Торкніться дня для перегляду та налаштування'}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsRangeMode(!isRangeMode);
                setRangeStart(null);
                setRangeEnd(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isRangeMode
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Виділити період кількох днів"
            >
              <CalendarRange className="w-4 h-4" />
              <span className="hidden sm:inline">Період</span>
            </button>

            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Range mode helper banner */}
        {isRangeMode && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-amber-900 font-medium">
              {rangeStart && !rangeEnd && (
                <span>Початок: <strong>{rangeStart}</strong>. Тепер виберіть день закінчення.</span>
              )}
              {rangeStart && rangeEnd && (
                <span>Діапазон: <strong>{rangeStart}</strong> — <strong>{rangeEnd}</strong></span>
              )}
              {!rangeStart && <span>Оберіть перший день діапазону в календарі</span>}
            </div>

            {rangeStart && rangeEnd && (
              <div className="flex flex-wrap items-center gap-1.5 w-full pt-1">
                <span className="text-xs font-bold text-amber-900">Застосувати:</span>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleApplyRangeCategory(c.id)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 shadow-2xs"
                  >
                    {c.shortName}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setIsRangeMode(false);
                    setRangeStart(null);
                    setRangeEnd(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 ml-auto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {weekDays.map((day, idx) => (
            <div
              key={day}
              className={`text-xs font-semibold py-1 ${
                idx >= 5 ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid (Clean, thumb-friendly squares) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-2xl" />
          ))}

          {daysInMonth.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const record = recordMap.get(dateStr);
            const isSelected = selectedDay === dateStr;
            const inRange = isRangeMode && isInRange(dateStr);
            const isCurrentDay = isToday(day);
            const dotColor = getCategoryDot(record?.typeId);

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(dateStr)}
                className={`aspect-square rounded-2xl border flex flex-col items-center justify-center relative transition-all active:scale-90 ${
                  inRange
                    ? 'bg-amber-200 border-amber-400 text-amber-950 font-bold scale-95'
                    : getCategoryStyles(record?.typeId)
                } ${
                  isSelected
                    ? 'ring-2 ring-slate-900 ring-offset-2 ring-offset-white font-black z-10 scale-105'
                    : ''
                }`}
              >
                {/* Day number */}
                <span
                  className={`text-xs sm:text-sm ${
                    isCurrentDay && !record?.typeId
                      ? 'w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold'
                      : ''
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {/* Minimal dot indicator for category */}
                {dotColor && (
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-0.5`} />
                )}

                {/* Tiny check indicator if paid */}
                {record?.isPaidOut && (
                  <span className="absolute top-1 right-1 text-emerald-600">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend / Quick Status Reference */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 mt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>100к (Нуль)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>50к (Штаб)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>30к (ЗБД)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Базовий</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>Відпустка</span>
          </div>
        </div>
      </div>

      {/* Selected Day Inspector (Sleek, bottom sheet style card) */}
      {selectedDay && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Day Title & Current Status */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Обраний день
              </div>
              <h3 className="text-base font-bold text-slate-900 capitalize">
                {format(parseISO(selectedDay), 'EEEE, d MMMM', { locale: uk })}
              </h3>
            </div>

            {activeCategory ? (
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                  {activeCategory.name}
                </span>
                {activeRate > 0 && (
                  <div className="text-xs font-extrabold text-emerald-700 mt-0.5">
                    +{formatCurrency(activeRate)}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-medium py-1">
                Тип не вибрано
              </span>
            )}
          </div>

          {/* Quick-action category chips */}
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-2">
              Встановити статус дня в 1 дотик:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isActive = activeRecord?.typeId === cat.id;
                const rate = getDailyRateForMonth(cat, currentMonth);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleApplyCategory(cat.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                        : `${cat.color} border-slate-200 font-medium`
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight truncate">
                      {cat.shortName}
                    </div>
                    {rate > 0 && (
                      <div className={`text-[10px] mt-1 ${isActive ? 'text-slate-300' : 'text-slate-500 font-mono'}`}>
                        +{Math.round(rate)} ₴
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note & Order Number Toggle */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            {!showNoteInput ? (
              <button
                onClick={() => setShowNoteInput(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>+ Додати номер Бойового Розпорядження (БР) чи примітку</span>
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <input
                    type="text"
                    placeholder="№ Бойового Розпорядження (БР)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    onBlur={() => {
                      if (activeRecord) {
                        onSaveDayRecord({ ...activeRecord, orderNumber });
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Примітка (сектор, позиція)"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onBlur={() => {
                      if (activeRecord) {
                        onSaveDayRecord({ ...activeRecord, notes: noteText });
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Paid status toggle & Clear Day */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isPaidOut}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsPaidOut(checked);
                    if (activeRecord) {
                      onSaveDayRecord({ ...activeRecord, isPaidOut: checked });
                    }
                  }}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span>Виплачено фіно ✓</span>
              </label>

              {activeRecord && (
                <button
                  onClick={handleClearSelectedDay}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Очистити день</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
