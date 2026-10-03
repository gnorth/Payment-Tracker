import {
  MILITARY_RANKS,
  MILITARY_POSITIONS,
  SERVICE_YEARS_OPTIONS,
  MILITARY_BRANCHES
} from '../constants/militaryRanks';
import { FinancialProfile } from '../types';

export interface BaseSalaryBreakdown {
  positionSalary: number; // Посадовий оклад
  rankSalary: number; // Оклад за званням
  serviceYearsAllowance: number; // Вислуга років
  serviceYearsPercent: number;
  opsAllowance: number; // Надбавка за ОПС (65% або 100%)
  opsPercent: number;
  secretAccessAllowance: number; // Таємниця (10%)
  monthlyBonus: number; // Щомісячна премія
  totalBaseSalary: number; // Загальне ОГЗ на місяць
}

/**
 * Calculates the exact breakdown of base monthly military salary (ОГЗ)
 * based on Ukrainian Government Decree #704 and MoD Order #260.
 */
export function calculateBaseSalaryBreakdown(profile: Partial<FinancialProfile>): BaseSalaryBreakdown {
  // 1. Rank salary
  const rank = MILITARY_RANKS.find((r) => r.id === profile.rankId) || MILITARY_RANKS[0];
  const rankSalary = rank.salary;

  // 2. Position salary
  const position = MILITARY_POSITIONS.find((p) => p.id === profile.positionId) || MILITARY_POSITIONS[0];
  const positionSalary = position.baseSalary;

  // 3. Years of service allowance
  const serviceYears = SERVICE_YEARS_OPTIONS.find((s) => s.id === profile.yearsOfServiceId) || SERVICE_YEARS_OPTIONS[0];
  const serviceYearsPercent = serviceYears.percent;
  const serviceYearsAllowance = Math.round(((positionSalary + rankSalary) * serviceYearsPercent) / 100);

  // 4. Allowance for special service conditions (ОПС)
  const branch = MILITARY_BRANCHES.find((b) => b.id === profile.branchId) || MILITARY_BRANCHES[0];
  const opsPercent = branch.opsPercent;
  const subtotalForOps = positionSalary + rankSalary + serviceYearsAllowance;
  const opsAllowance = Math.round((subtotalForOps * opsPercent) / 100);

  // 5. Secret access allowance (10% of position salary if enabled)
  const secretAccessAllowance = profile.hasSecretAccess ? Math.round(positionSalary * 0.1) : 0;

  // Subtotal before premium
  const currentSubtotal =
    positionSalary +
    rankSalary +
    serviceYearsAllowance +
    opsAllowance +
    secretAccessAllowance;

  // 6. Monthly bonus (премія)
  // According to MoD rules, the guaranteed minimum base salary for any soldier is 20 100 UAH.
  // For higher ranks/positions, bonus scales with position and rank.
  const targetMinimumBase = 20100 + (position.tariffCategory - 1) * 600 + (rankSalary - 530) * 2;
  const monthlyBonus = Math.max(0, Math.round(targetMinimumBase - currentSubtotal));

  const calculatedTotal = currentSubtotal + monthlyBonus;

  // If user opted to manually override with their exact payslip amount
  const totalBaseSalary = profile.manualSalaryOverride && profile.baseMonthlySalary
    ? profile.baseMonthlySalary
    : calculatedTotal;

  return {
    positionSalary,
    rankSalary,
    serviceYearsAllowance,
    serviceYearsPercent,
    opsAllowance,
    opsPercent,
    secretAccessAllowance,
    monthlyBonus,
    totalBaseSalary
  };
}
