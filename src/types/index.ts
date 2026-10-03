export interface PayoutCategory {
  id: string;
  name: string;
  shortName: string;
  monthlyAmount: number;
  dailyRate?: number;
  isDailyFixed?: boolean;
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
  baseMonthlySalary: number; // Обчислене або встановлене ОГЗ (грн)
  rankId?: string; // ID звання
  rankName?: string; // Назва звання
  positionId?: string; // ID посади
  positionName?: string; // Назва посади
  tariffCategory?: number; // Тарифний розряд
  yearsOfServiceId?: string; // ID вислуги
  branchId?: string; // Рід військ (ОПС)
  hasSecretAccess?: boolean; // Допуск до держтаємниці
  hasRear10k?: boolean; // Додаткова винагорода 10 000 грн (поза зоною БД / тил)
  unitName?: string; // Військова частина / підрозділ
  manualSalaryOverride?: boolean; // Чи введене ОГЗ вручну
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
