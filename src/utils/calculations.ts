import { getDaysInMonth } from 'date-fns';
import { DayRecord, PayoutCategory, DEFAULT_CATEGORIES } from '../types';

/**
 * Maximum monthly cap for combat payments according to Ministry of Defence rules (2026)
 */
export const MAX_MONTHLY_COMBAT_PAYOUT = 460000;

/**
 * Calculates daily rate for a payout category in a specific month
 */
export function getDailyRateForMonth(
  category: PayoutCategory,
  yearMonth: string // "YYYY-MM"
): number {
  // If fixed daily rate (e.g. 40 000 UAH assault, 20 000 UAH recovery)
  if (category.isDailyFixed && category.dailyRate) {
    return category.dailyRate;
  }

  if (category.dailyRate && category.dailyRate > 0) {
    return category.dailyRate;
  }
  if (!category.monthlyAmount || category.monthlyAmount === 0) {
    return 0;
  }

  const [year, month] = yearMonth.split('-').map(Number);
  const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));
  return category.monthlyAmount / daysInMonth;
}

/**
 * Calculates expected additional reward for a given month based on day records
 */
export function calculateMonthExpectedPayout(
  yearMonth: string, // "YYYY-MM"
  dayRecords: DayRecord[],
  categories: PayoutCategory[] = DEFAULT_CATEGORIES,
  baseMonthlySalary: number = 20100
): {
  baseSalary: number;
  additionalRewards: number;
  totalExpected: number;
  dayBreakdown: Record<string, { days: number; totalAmount: number; name: string }>;
  combatDaysCount: number;
  isCapped: boolean;
} {
  const categoryMap = new Map<string, PayoutCategory>();
  categories.forEach((cat) => categoryMap.set(cat.id, cat));

  const dayBreakdown: Record<string, { days: number; totalAmount: number; name: string }> = {};
  let rawAdditionalRewards = 0;
  let combatDaysCount = 0;

  // Filter records for this target month
  const monthRecords = dayRecords.filter((record) => record.date.startsWith(yearMonth));

  monthRecords.forEach((record) => {
    const category = categoryMap.get(record.typeId);
    if (!category) return;

    if (category.countsTowards70k) {
      combatDaysCount += 1;
    }

    const rate = record.customRate ?? getDailyRateForMonth(category, yearMonth);
    rawAdditionalRewards += rate;

    if (!dayBreakdown[category.id]) {
      dayBreakdown[category.id] = {
        days: 0,
        totalAmount: 0,
        name: category.shortName
      };
    }

    dayBreakdown[category.id].days += 1;
    dayBreakdown[category.id].totalAmount += rate;
  });

  // Apply Ministry of Defence 2026 Monthly combat payout cap (460 000 грн)
  const isCapped = rawAdditionalRewards > MAX_MONTHLY_COMBAT_PAYOUT;
  const additionalRewards = Math.min(rawAdditionalRewards, MAX_MONTHLY_COMBAT_PAYOUT);

  const totalExpected = baseMonthlySalary + additionalRewards;

  return {
    baseSalary: baseMonthlySalary,
    additionalRewards,
    totalExpected,
    dayBreakdown,
    combatDaysCount,
    isCapped
  };
}

/**
 * Calculates total combat days (for 70k bonus milestone)
 */
export function calculate70kMilestone(
  allDayRecords: DayRecord[],
  categories: PayoutCategory[] = DEFAULT_CATEGORIES
): {
  totalCombatDays: number;
  completedCycles: number;
  currentCycleDays: number;
  daysRemaining: number;
} {
  const categoryMap = new Map<string, PayoutCategory>();
  categories.forEach((cat) => categoryMap.set(cat.id, cat));

  let totalCombatDays = 0;

  allDayRecords.forEach((record) => {
    const category = categoryMap.get(record.typeId);
    if (category && category.countsTowards70k) {
      totalCombatDays += 1;
    }
  });

  const completedCycles = Math.floor(totalCombatDays / 30);
  const currentCycleDays = totalCombatDays % 30;
  const daysRemaining = currentCycleDays === 0 && totalCombatDays > 0 ? 0 : 30 - currentCycleDays;

  return {
    totalCombatDays,
    completedCycles,
    currentCycleDays,
    daysRemaining
  };
}

/**
 * Format currency to Ukrainian Hryvnia format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}
