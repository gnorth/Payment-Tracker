export interface PayoutCategory {
  id: string;
  name: string;
  shortName: string;
  monthlyAmount: number; // e.g. 100000, 50000, 30000, 0
  dailyRate?: number;
  color: string; // Light theme background & border
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
  category: 'base_salary' | 'additional_reward' | 'bonus_70k' | 'wellness' | 'material_help' | 'other';
  notes?: string;
}

export const DEFAULT_CATEGORIES: PayoutCategory[] = [
  {
    id: 'combat_100k',
    name: 'Бойові (Перша лінія)',
    shortName: '100к (Нуль)',
    monthlyAmount: 100000,
    color: 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    countsTowards70k: true,
    description: 'Безпосередня участь у бойових діях на передньому краю (~3 333 грн/день)'
  },
  {
    id: 'special_50k',
    name: 'Спеціальні / ОУВ',
    shortName: '50к (Штаб)',
    monthlyAmount: 50000,
    color: 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    countsTowards70k: false,
    description: 'Виконання завдань у складі органів військового управління / спецрубежах (~1 666 грн/день)'
  },
  {
    id: 'duty_30k',
    name: 'Зона бойових дій',
    shortName: '30к (ЗБД)',
    monthlyAmount: 30000,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-900 hover:bg-yellow-100',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    countsTowards70k: false,
    description: 'Виконання бойових/спеціальних завдань у зоні бойових дій (~1 000 грн/день)'
  },
  {
    id: 'sick_100k',
    name: 'ВЛК / Поранення (100к)',
    shortName: 'ВЛК (100к)',
    monthlyAmount: 100000,
    color: 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    countsTowards70k: false,
    description: 'Стаціонарне лікування після поранення / контузії зі збереженням 100к'
  },
  {
    id: 'base_day',
    name: 'Основний день (Тило)',
    shortName: 'Базовий',
    monthlyAmount: 0,
    color: 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    countsTowards70k: false,
    description: 'Звичайний день служби (нараховується базове ОГЗ)'
  },
  {
    id: 'vacation',
    name: 'Відпустка',
    shortName: 'Відпустка',
    monthlyAmount: 0,
    color: 'bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    countsTowards70k: false,
    description: 'Щорічна базова чи сімейна відпустка'
  },
  {
    id: 'training',
    name: 'Навчання / Курси',
    shortName: 'Навчання',
    monthlyAmount: 0,
    color: 'bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    countsTowards70k: false,
    description: 'Навчання у ЦНП / полігон / закордонні курси'
  }
];
