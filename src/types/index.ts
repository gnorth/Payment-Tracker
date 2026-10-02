export interface PayoutCategory {
  id: string;
  name: string;
  shortName: string;
  monthlyAmount: number; // e.g. 100000, 50000, 30000, 0
  dailyRate?: number; // Custom override daily rate if needed
  color: string; // Tailwind background/border class
  badgeColor: string; // Tailwind badge color
  countsTowards70k: boolean; // Does it count for the 30-day 70,000 UAH milestone?
  description: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  typeId: string; // Category ID
  customRate?: number;
  notes?: string; // e.g. "БР №123, сектор Покровськ"
  orderNumber?: string;
  isPaidOut?: boolean; // Flagged as confirmed payout received
}

export interface FinancialProfile {
  id?: number;
  baseMonthlySalary: number; // Основне Грошове Забезпечення (ОГЗ)
  rank?: string;
  position?: string;
  unit?: string;
  customCategories?: PayoutCategory[];
}

export interface PaymentTransaction {
  id?: string;
  date: string; // Date payout arrived (YYYY-MM-DD)
  targetMonth: string; // Target payout month (YYYY-MM)
  amount: number; // Received UAH amount
  category: 'base_salary' | 'additional_reward' | 'bonus_70k' | 'wellness' | 'material_help' | 'other';
  notes?: string; // Comments (e.g. "Аванс" or "Бойові за вересень")
}

export const DEFAULT_CATEGORIES: PayoutCategory[] = [
  {
    id: 'combat_100k',
    name: 'Бойові (Перша лінія)',
    shortName: '100к (Нуль)',
    monthlyAmount: 100000,
    color: 'bg-rose-950/80 border-rose-600 text-rose-200 hover:bg-rose-900',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    countsTowards70k: true,
    description: 'Безпосередня участь у бойових діях на передньому краю (~3 333 грн/день)'
  },
  {
    id: 'special_50k',
    name: 'Спеціальні / ОУВ',
    shortName: '50к (Штаб/СЗ)',
    monthlyAmount: 50000,
    color: 'bg-amber-950/80 border-amber-600 text-amber-200 hover:bg-amber-900',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    countsTowards70k: false,
    description: 'Виконання завдань у складі органів військового управління / спецрубежах (~1 666 грн/день)'
  },
  {
    id: 'duty_30k',
    name: 'Зона бойових дій',
    shortName: '30к (ЗБД)',
    monthlyAmount: 30000,
    color: 'bg-yellow-950/80 border-yellow-600 text-yellow-200 hover:bg-yellow-900',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    countsTowards70k: false,
    description: 'Виконання бойових/спеціальних завдань у зоні бойових дій (~1 000 грн/день)'
  },
  {
    id: 'sick_100k',
    name: 'ВЛК / Поранення (100к)',
    shortName: 'ВЛК (100к)',
    monthlyAmount: 100000,
    color: 'bg-purple-950/80 border-purple-600 text-purple-200 hover:bg-purple-900',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    countsTowards70k: false,
    description: 'Стаціонарне лікування після поранення / контузії зі збереженням 100к'
  },
  {
    id: 'base_day',
    name: 'Основний день (Тино)',
    shortName: 'Базовий',
    monthlyAmount: 0,
    color: 'bg-emerald-950/80 border-emerald-600 text-emerald-200 hover:bg-emerald-900',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    countsTowards70k: false,
    description: 'Звичайний день служби (нараховується базове ОГЗ)'
  },
  {
    id: 'vacation',
    name: 'Відпустка',
    shortName: 'Відпустка',
    monthlyAmount: 0,
    color: 'bg-blue-950/80 border-blue-600 text-blue-200 hover:bg-blue-900',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    countsTowards70k: false,
    description: 'Щорічна базова чи сімейна відпустка'
  },
  {
    id: 'training',
    name: 'Навчання / Курси',
    shortName: 'Навчання',
    monthlyAmount: 0,
    color: 'bg-cyan-950/80 border-cyan-600 text-cyan-200 hover:bg-cyan-900',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    countsTowards70k: false,
    description: 'Навчання у ЦНП / полігон / закордонні курси'
  }
];
