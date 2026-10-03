export interface PayoutCategory {
  id: string;
  name: string;
  shortName: string;
  monthlyAmount: number; // e.g. 170000, 100000, 70000, 50000, 30000, 10000
  dailyRate?: number; // e.g. 40000 for assault, 20000 for recovery
  isDailyFixed?: boolean; // if true, dailyRate is added directly per day
  color: string;
  badgeColor: string;
  countsTowards70k: boolean;
  description: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  typeId: string; // Category ID
  customRate?: number;
  notes?: string;
  orderNumber?: string;
  isPaidOut?: boolean;
}

export interface FinancialProfile {
  id?: number;
  baseMonthlySalary: number; // Основне Грошове Забезпечення (ОГЗ)
  rank?: string;
  position?: string;
  unit?: string;
  darkMode?: boolean;
  customCategories?: PayoutCategory[];
}

export interface PaymentTransaction {
  id?: string;
  date: string; // YYYY-MM-DD
  targetMonth: string; // YYYY-MM
  amount: number;
  category:
    | 'base_salary'
    | 'additional_reward'
    | 'bonus_70k'
    | 'bonus_result'
    | 'wellness'
    | 'material_help'
    | 'contract'
    | 'other';
  notes?: string;
}

export type TabType = 'calendar' | 'reconciliation' | 'guide' | 'analytics' | 'settings';

export { DEFAULT_CATEGORIES } from '../constants/payoutCategories';
