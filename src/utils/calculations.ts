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
 * Categories that explicitly do NOT accrue the 10 000 UAH rear additional reward
 * In accordance with Decree #168 & MoD Order #260 (amended by #232 / #566):
 * - Vacation (відпустка будь-якого виду)
 * - Training (відрядження на навчання до навчальних центрів/полігонів або курсанти)
 *
 * NOTE: Treatment (небойове лікування) and standard duty business trips (службові відрядження)
 * RETAIN the 10 000 UAH reward and base salary according to official MoD rules.
 */
export const NON_ACCRUAL_CATEGORIES = new Set([
  'vacation',
  'training'
]);

/**
 * Calculates expected additional reward for a given month based on day records
 */
export function calculateMonthExpectedPayout(
  yearMonth: string, // "YYYY-MM"
  dayRecords: DayRecord[],
  categories: PayoutCategory[] = DEFAULT_CATEGORIES,
  baseMonthlySalary: number = 20100,
  hasRear10k: boolean = false
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

  const [year, month] = yearMonth.split('-').map(Number);
  const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));
  const rearDailyRate = 10000 / daysInMonth;

  // Filter records for this target month
  const monthRecords = dayRecords.filter((record) => record.date.startsWith(yearMonth));
  const recordByDate = new Map<string, DayRecord>();
  monthRecords.forEach((r) => recordByDate.set(r.date, r));

  if (hasRear10k) {
    // Serviceman in rear/non-combat unit entitled to 10 000 UAH / mo pro-rata
    let rearDaysCount = 0;
    let rearTotalAmount = 0;

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dayStr = `${yearMonth}-${String(dayNum).padStart(2, '0')}`;
      const record = recordByDate.get(dayStr);

      if (!record) {
        // Normal service day in rear unit
        rearDaysCount += 1;
        rearTotalAmount += rearDailyRate;
        rawAdditionalRewards += rearDailyRate;
      } else {
        const category = categoryMap.get(record.typeId);
        if (!category) continue;

        if (category.countsTowards70k) {
          combatDaysCount += 1;
        }

        if (NON_ACCRUAL_CATEGORIES.has(category.id)) {
          // Explicitly 0 UAH additional reward for vacation, training
          if (!dayBreakdown[category.id]) {
            dayBreakdown[category.id] = {
              days: 0,
              totalAmount: 0,
              name: category.shortName
            };
          }
          dayBreakdown[category.id].days += 1;
        } else if (category.id === 'rear_10k' || category.id === 'base_day') {
          // Standard duty day in rear
          rearDaysCount += 1;
          rearTotalAmount += rearDailyRate;
          rawAdditionalRewards += rearDailyRate;
        } else if (category.id === 'treatment' || category.id === 'business_trip') {
          // Retains 10k pro-rata rate under MoD Order #260
          rawAdditionalRewards += rearDailyRate;
          if (!dayBreakdown[category.id]) {
            dayBreakdown[category.id] = {
              days: 0,
              totalAmount: 0,
              name: category.shortName
            };
          }
          dayBreakdown[category.id].days += 1;
          dayBreakdown[category.id].totalAmount += rearDailyRate;
        } else {
          // Combat or special duty category (170k, 100k, 70k, 50k, 30k, 40k, 20k, sick_100k)
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
        }
      }
    }

    if (rearDaysCount > 0) {
      dayBreakdown['rear_10k'] = {
        days: rearDaysCount,
        totalAmount: rearTotalAmount,
        name: 'Тил 10к'
      };
    }
  } else {
    // Standard combat/manual day-by-day tracking mode
    monthRecords.forEach((record) => {
      const category = categoryMap.get(record.typeId);
      if (!category) return;

      if (category.countsTowards70k) {
        combatDaysCount += 1;
      }

      // If category is an excluded non-accrual type (vacation, training, business_trip, treatment), rate is strictly 0
      const rate = NON_ACCRUAL_CATEGORIES.has(category.id)
        ? 0
        : (record.customRate ?? getDailyRateForMonth(category, yearMonth));

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
  }

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
