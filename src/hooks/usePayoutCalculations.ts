import { useMemo } from 'react';
import { DayRecord, PaymentTransaction, PayoutCategory, DEFAULT_CATEGORIES } from '../types';
import {
  calculateMonthExpectedPayout,
  calculate70kMilestone
} from '../utils/calculations';

interface UsePayoutCalculationsProps {
  currentMonth: string;
  dayRecords: DayRecord[];
  transactions: PaymentTransaction[];
  baseMonthlySalary: number;
  categories?: PayoutCategory[];
}

export function usePayoutCalculations({
  currentMonth,
  dayRecords,
  transactions,
  baseMonthlySalary,
  categories = DEFAULT_CATEGORIES
}: UsePayoutCalculationsProps) {
  const monthCalculation = useMemo(() => {
    return calculateMonthExpectedPayout(
      currentMonth,
      dayRecords,
      categories,
      baseMonthlySalary
    );
  }, [currentMonth, dayRecords, categories, baseMonthlySalary]);

  const milestone70k = useMemo(() => {
    return calculate70kMilestone(dayRecords, categories);
  }, [dayRecords, categories]);

  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.targetMonth === currentMonth);
  }, [transactions, currentMonth]);

  const totalReceivedForMonth = useMemo(() => {
    return monthTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const balance = totalReceivedForMonth - monthCalculation.totalExpected;
  const isFullyPaid = balance >= 0 && totalReceivedForMonth > 0;
  const isShortfall = balance < 0 && totalReceivedForMonth > 0;

  return {
    monthCalculation,
    milestone70k,
    monthTransactions,
    totalReceivedForMonth,
    balance,
    isFullyPaid,
    isShortfall
  };
}
