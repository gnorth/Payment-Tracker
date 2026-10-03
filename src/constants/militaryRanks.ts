export interface MilitaryRankOption {
  id: string;
  name: string;
  salary: number; // Оклад за званням (грн)
  category: 'private_sergeant' | 'officer';
}

export interface MilitaryPositionOption {
  id: string;
  name: string;
  tariffCategory: number; // Тарифний розряд (1-25)
  baseSalary: number; // Посадовий оклад (грн)
}

export const MILITARY_RANKS: MilitaryRankOption[] = [
  // Рядовий і сержантський склад
  { id: 'soldier', name: 'Солдат / Рекрут', salary: 530, category: 'private_sergeant' },
  { id: 'senior_soldier', name: 'Старший солдат', salary: 560, category: 'private_sergeant' },
  { id: 'junior_sergeant', name: 'Молодший сержант', salary: 640, category: 'private_sergeant' },
  { id: 'sergeant', name: 'Сержант', salary: 720, category: 'private_sergeant' },
  { id: 'senior_sergeant', name: 'Старший сержант', salary: 800, category: 'private_sergeant' },
  { id: 'chief_sergeant', name: 'Головний сержант', salary: 880, category: 'private_sergeant' },
  { id: 'staff_sergeant', name: 'Штаб-сержант', salary: 960, category: 'private_sergeant' },
  { id: 'master_sergeant', name: 'Майстер-сержант', salary: 1040, category: 'private_sergeant' },
  { id: 'senior_master_sergeant', name: 'Старший майстер-сержант', salary: 1120, category: 'private_sergeant' },
  { id: 'chief_master_sergeant', name: 'Головний майстер-сержант', salary: 1200, category: 'private_sergeant' },

  // Офіцерський склад
  { id: 'junior_lieutenant', name: 'Молодший лейтенант', salary: 1120, category: 'officer' },
  { id: 'lieutenant', name: 'Лейтенант', salary: 1200, category: 'officer' },
  { id: 'senior_lieutenant', name: 'Старший лейтенант', salary: 1280, category: 'officer' },
  { id: 'captain', name: 'Капітан', salary: 1360, category: 'officer' },
  { id: 'major', name: 'Майор', salary: 1440, category: 'officer' },
  { id: 'lieutenant_colonel', name: 'Підполковник', salary: 1520, category: 'officer' },
  { id: 'colonel', name: 'Полковник', salary: 1600, category: 'officer' }
];

export const MILITARY_POSITIONS: MilitaryPositionOption[] = [
  { id: 'rifleman', name: 'Стрілець / Помічник гранатометника (1-й розряд)', tariffCategory: 1, baseSalary: 2470 },
  { id: 'senior_rifleman', name: 'Старший стрілець / Снайпер / Сапер (2-3 розряд)', tariffCategory: 3, baseSalary: 2970 },
  { id: 'machine_gunner', name: 'Кулеметник / Гранатометник / Оператор БПЛА (3-4 розряд)', tariffCategory: 4, baseSalary: 3220 },
  { id: 'driver_mechanic', name: 'Водій / Механік-водій / Навідник (4-5 розряд)', tariffCategory: 5, baseSalary: 3470 },
  { id: 'squad_commander', name: 'Командир відділення / бойової машини (6-7 розряд)', tariffCategory: 6, baseSalary: 3720 },
  { id: 'senior_drone_pilot', name: 'Старший оператор ударних БПЛА / РЕБ (7-8 розряд)', tariffCategory: 7, baseSalary: 3970 },
  { id: 'platoon_sergeant', name: 'Головний сержант взводу (8-9 розряд)', tariffCategory: 8, baseSalary: 4220 },
  { id: 'company_sergeant', name: 'Головний сержант роти (9-10 розряд)', tariffCategory: 10, baseSalary: 4720 },
  { id: 'battalion_sergeant', name: 'Головний сержант батальйону (11-12 розряд)', tariffCategory: 11, baseSalary: 4970 },
  { id: 'platoon_commander', name: 'Командир взводу (11-13 розряд)', tariffCategory: 12, baseSalary: 5220 },
  { id: 'company_deputy', name: 'Заступник командира роти (13-14 розряд)', tariffCategory: 13, baseSalary: 5470 },
  { id: 'company_commander', name: 'Командир роти / батареї (14-16 розряд)', tariffCategory: 15, baseSalary: 5970 },
  { id: 'battalion_deputy', name: 'Заступник командира батальйону (16-18 розряд)', tariffCategory: 17, baseSalary: 6470 },
  { id: 'battalion_commander', name: 'Командир батальйону / дивізіону (18-20 розряд)', tariffCategory: 19, baseSalary: 6970 }
];

export const SERVICE_YEARS_OPTIONS = [
  { id: '0_1', label: 'До 1 року (0%)', percent: 0 },
  { id: '1_5', label: 'Від 1 до 5 років (25%)', percent: 25 },
  { id: '5_10', label: 'Від 5 до 10 років (30%)', percent: 30 },
  { id: '10_15', label: 'Від 10 до 15 років (35%)', percent: 35 },
  { id: '15_20', label: 'Від 15 до 20 років (40%)', percent: 40 },
  { id: '20_25', label: 'Від 20 до 25 років (45%)', percent: 45 },
  { id: '25_plus', label: 'Понад 25 років (50%)', percent: 50 }
];

export const MILITARY_BRANCHES = [
  { id: 'ground', label: 'Сухопутні війська / ТрО (ОПС 65%)', opsPercent: 65 },
  { id: 'dshv_marine', label: 'ДШВ / Морська піхота / Розвідка (ОПС 100%)', opsPercent: 100 },
  { id: 'sso', label: 'Сили Спеціальних Операцій (ССО) (ОПС 100%)', opsPercent: 100 },
  { id: 'air_force', label: 'Повітряні сили / ППО (ОПС 65-100%)', opsPercent: 65 }
];
