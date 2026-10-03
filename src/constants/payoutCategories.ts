import { PayoutCategory } from '../types';

export const DEFAULT_CATEGORIES: PayoutCategory[] = [
  {
    id: 'zone_170k',
    name: 'Зональна 170 000 грн (ВОП / Наступ / ТОТ)',
    shortName: '170к (ВОП)',
    monthlyAmount: 170000,
    color: 'bg-red-50 border-red-300 text-red-900 hover:bg-red-100',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    countsTowards70k: true,
    description: 'На відстані до взводного опорного пункту (ВОП), наступ, сіра зона, ТОТ або територія ворога (~5 666 грн/день)'
  },
  {
    id: 'assault_40k',
    name: 'Штурмові дії (40 000 грн / доба)',
    shortName: 'Штурм 40к',
    monthlyAmount: 0,
    dailyRate: 40000,
    isDailyFixed: true,
    color: 'bg-rose-100 border-rose-400 text-rose-950 hover:bg-rose-200',
    badgeColor: 'bg-rose-200 text-rose-900 border-rose-400',
    countsTowards70k: true,
    description: 'Добова виплата за штурм на лінії зіткнення або в глибині оборони противника (40 000 грн за добу)'
  },
  {
    id: 'recovery_20k',
    name: 'Відновлення позицій (20 000 грн / доба)',
    shortName: 'Відновл. 20к',
    monthlyAmount: 0,
    dailyRate: 20000,
    isDailyFixed: true,
    color: 'bg-orange-100 border-orange-400 text-orange-950 hover:bg-orange-200',
    badgeColor: 'bg-orange-200 text-orange-900 border-orange-400',
    countsTowards70k: true,
    description: 'Добова виплата за відновлення позицій у глибині власної оборони (20 000 грн за добу)'
  },
  {
    id: 'combat_100k',
    name: 'Бойові 100 000 грн (Лінія зіткнення)',
    shortName: '100к (Нуль)',
    monthlyAmount: 100000,
    color: 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    countsTowards70k: true,
    description: 'Безпосередня участь у бойових діях на лінії зіткнення, вогневе ураження (~3 333 грн/день)'
  },
  {
    id: 'zone_70k',
    name: 'Зональна 70 000 грн (РОП)',
    shortName: '70к (РОП)',
    monthlyAmount: 70000,
    color: 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    countsTowards70k: false,
    description: 'Виконання завдань на відстані до ротного опорного пункту (РОП) включно (~2 333 грн/день)'
  },
  {
    id: 'special_50k',
    name: 'Спеціальні 50 000 грн (Штаби / ОУВ)',
    shortName: '50к (Штаб)',
    monthlyAmount: 50000,
    color: 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    countsTowards70k: false,
    description: 'Керівний склад ОУВ, штаби оперативного управління військами (~1 666 грн/день)'
  },
  {
    id: 'duty_30k',
    name: 'Зона бойових дій (30 000 грн)',
    shortName: '30к (ЗБД)',
    monthlyAmount: 30000,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-900 hover:bg-yellow-100',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    countsTowards70k: false,
    description: 'Бойові завдання поза лінією зіткнення: ППО, інженерні рубежі, забезпечення (~1 000 грн/день)'
  },
  {
    id: 'sick_100k',
    name: 'ВЛК / Поранення (100 000 грн)',
    shortName: 'ВЛК (100к)',
    monthlyAmount: 100000,
    color: 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    countsTowards70k: false,
    description: 'Стаціонарне лікування після поранення / контузії зі збереженням 100к'
  },
  {
    id: 'rear_10k',
    name: 'Небойова винагорода (10 000 грн)',
    shortName: 'Тил 10к',
    monthlyAmount: 10000,
    color: 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200',
    badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
    countsTowards70k: false,
    description: 'Для військових поза зоною БД (не нараховується під час відпустки та відрядження на навчання)'
  },
  {
    id: 'base_day',
    name: 'Основний день (Базовий)',
    shortName: 'Базовий',
    monthlyAmount: 0,
    color: 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    countsTowards70k: false,
    description: 'Звичайний день служби (нараховується базове ОГЗ)'
  },
  {
    id: 'vacation',
    name: 'Відпустка (без винагороди)',
    shortName: 'Відпустка',
    monthlyAmount: 0,
    color: 'bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    countsTowards70k: false,
    description: 'Щорічна базова чи сімейна відпустка (додаткова винагорода 10к/30к/100к НЕ нараховується)'
  },
  {
    id: 'training',
    name: 'Навчання / Курси (НЦ/полігон)',
    shortName: 'Навчання',
    monthlyAmount: 0,
    color: 'bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    countsTowards70k: false,
    description: 'Відрядження на навчання до навчальних військових частин/полігонів (10к не нараховується)'
  },
  {
    id: 'business_trip',
    name: 'Службове відрядження',
    shortName: 'Відрядження',
    monthlyAmount: 0,
    color: 'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    countsTowards70k: false,
    description: 'Виконання службових завдань за наказом (додаткова винагорода 10к зберігається)'
  },
  {
    id: 'treatment',
    name: 'Лікування / Госпіталь (небойове)',
    shortName: 'Лікування',
    monthlyAmount: 0,
    color: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    countsTowards70k: false,
    description: 'Стаціонарне чи амбулаторне лікування внаслідок хвороби/травми (10к та базове ОГЗ зберігаються)'
  }
];
