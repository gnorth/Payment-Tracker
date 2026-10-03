import React, { useState, useMemo } from 'react';
import {
  User,
  Shield,
  Save,
  Download,
  Upload,
  Check,
  Calculator,
  Building,
  HelpCircle,
  Edit3
} from 'lucide-react';
import { FinancialProfile, DayRecord, PaymentTransaction } from '../types';
import {
  MILITARY_RANKS,
  MILITARY_POSITIONS,
  SERVICE_YEARS_OPTIONS,
  MILITARY_BRANCHES
} from '../constants/militaryRanks';
import { calculateBaseSalaryBreakdown } from '../utils/salaryCalculator';
import { formatCurrency } from '../utils/calculations';
import { db } from '../db';

interface SettingsModalProps {
  profile: FinancialProfile;
  onSaveProfile: (profile: FinancialProfile) => void;
  dayRecords: DayRecord[];
  transactions: PaymentTransaction[];
  onReloadData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onSaveProfile,
  dayRecords,
  transactions,
  onReloadData
}) => {
  // Form state initialized with profile or intelligent defaults
  const [rankId, setRankId] = useState<string>(profile.rankId || 'soldier');
  const [positionId, setPositionId] = useState<string>(profile.positionId || 'rifleman');
  const [yearsOfServiceId, setYearsOfServiceId] = useState<string>(profile.yearsOfServiceId || '1_5');
  const [branchId, setBranchId] = useState<string>(profile.branchId || 'ground');
  const [hasSecretAccess, setHasSecretAccess] = useState<boolean>(profile.hasSecretAccess || false);
  const [unitName, setUnitName] = useState<string>(profile.unitName || '');

  // Manual override state
  const [manualOverride, setManualOverride] = useState<boolean>(profile.manualSalaryOverride || false);
  const [manualSalaryInput, setManualSalaryInput] = useState<string>(
    profile.baseMonthlySalary ? profile.baseMonthlySalary.toString() : '20100'
  );

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Real-time live salary breakdown calculation
  const calculatedBreakdown = useMemo(() => {
    return calculateBaseSalaryBreakdown({
      rankId,
      positionId,
      yearsOfServiceId,
      branchId,
      hasSecretAccess,
      manualSalaryOverride: manualOverride,
      baseMonthlySalary: parseFloat(manualSalaryInput) || 20100
    });
  }, [rankId, positionId, yearsOfServiceId, branchId, hasSecretAccess, manualOverride, manualSalaryInput]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedRank = MILITARY_RANKS.find((r) => r.id === rankId);
    const selectedPosition = MILITARY_POSITIONS.find((p) => p.id === positionId);

    const finalBaseSalary = manualOverride
      ? parseFloat(manualSalaryInput) || calculatedBreakdown.totalBaseSalary
      : calculatedBreakdown.totalBaseSalary;

    const updatedProfile: FinancialProfile = {
      ...profile,
      baseMonthlySalary: finalBaseSalary,
      rankId,
      rankName: selectedRank?.name || '',
      positionId,
      positionName: selectedPosition?.name || '',
      tariffCategory: selectedPosition?.tariffCategory || 1,
      yearsOfServiceId,
      branchId,
      hasSecretAccess,
      unitName,
      manualSalaryOverride: manualOverride
    };

    onSaveProfile(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportJSON = () => {
    const data = {
      version: 2,
      exportDate: new Date().toISOString(),
      profile: {
        ...profile,
        baseMonthlySalary: calculatedBreakdown.totalBaseSalary,
        rankId,
        positionId,
        yearsOfServiceId,
        branchId,
        hasSecretAccess,
        unitName,
        manualSalaryOverride: manualOverride
      },
      dayRecords,
      transactions
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `zsu_tracker_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.dayRecords && Array.isArray(parsed.dayRecords)) {
            await db.dayRecords.clear();
            await db.dayRecords.bulkAdd(parsed.dayRecords);
          }
          if (parsed.transactions && Array.isArray(parsed.transactions)) {
            await db.transactions.clear();
            await db.transactions.bulkAdd(parsed.transactions);
          }
          if (parsed.profile) {
            await db.profile.clear();
            await db.profile.add(parsed.profile);
          }
          alert('Дані успішно відновлено!');
          onReloadData();
        } catch (err) {
          alert('Помилка при зчитуванні резервного файлу.');
        }
      };
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile & Base Salary Builder Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Військовий профіль та ОГЗ
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Автоматичний розрахунок грошового забезпечення за посадою, званням та вислугою
              </p>
            </div>
          </div>
        </div>

        {/* Career Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Military Rank */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Військове звання:
            </label>
            <select
              value={rankId}
              onChange={(e) => setRankId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {MILITARY_RANKS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (+{r.salary} грн)
                </option>
              ))}
            </select>
          </div>

          {/* Position / Tariff */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Посада та тарифний розряд:
            </label>
            <select
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {MILITARY_POSITIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Years of Service */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Вислуга років:
            </label>
            <select
              value={yearsOfServiceId}
              onChange={(e) => setYearsOfServiceId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {SERVICE_YEARS_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Military Branch (OPS percentage) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Рід військ (Надбавка за ОПС):
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {MILITARY_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Nuances: Unit name & Secret access */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Військова частина / Підрозділ:
            </label>
            <input
              type="text"
              placeholder="наприклад: 93 ОМБр, 1-й батальйон"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={hasSecretAccess}
                onChange={(e) => setHasSecretAccess(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>Допуск до державної таємниці (+10% до окладу)</span>
            </label>
          </div>
        </div>

        {/* Interactive Breakdown Card (Live Calculation) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-200/80 pb-2">
            <span className="flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Розрахована структура щомісячного ОГЗ:
            </span>
            <span className="text-emerald-700 font-black text-sm">
              {formatCurrency(calculatedBreakdown.totalBaseSalary)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 font-medium">
            <div>
              Посадовий оклад: <strong className="text-slate-900">{formatCurrency(calculatedBreakdown.positionSalary)}</strong>
            </div>
            <div>
              Оклад за званням: <strong className="text-slate-900">{formatCurrency(calculatedBreakdown.rankSalary)}</strong>
            </div>
            <div>
              Вислуга ({calculatedBreakdown.serviceYearsPercent}%): <strong className="text-slate-900">+{formatCurrency(calculatedBreakdown.serviceYearsAllowance)}</strong>
            </div>
            <div>
              Надбавка ОПС ({calculatedBreakdown.opsPercent}%): <strong className="text-slate-900">+{formatCurrency(calculatedBreakdown.opsAllowance)}</strong>
            </div>
            {calculatedBreakdown.secretAccessAllowance > 0 && (
              <div>
                Таємниця (10%): <strong className="text-slate-900">+{formatCurrency(calculatedBreakdown.secretAccessAllowance)}</strong>
              </div>
            )}
            <div>
              Премія щомісячна: <strong className="text-emerald-700 font-bold">+{formatCurrency(calculatedBreakdown.monthlyBonus)}</strong>
            </div>
          </div>
        </div>

        {/* Manual Override Option */}
        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={manualOverride}
              onChange={(e) => setManualOverride(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>Вказати точну суму ОГЗ вручну (з мого розрахункового листа)</span>
          </label>

          {manualOverride && (
            <div className="mt-2 pl-6">
              <input
                type="number"
                value={manualSalaryInput}
                onChange={(e) => setManualSalaryInput(e.target.value)}
                className="w-48 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-emerald-800 font-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="20100"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Якщо ввести точну суму, додаток буде використовувати її як щомісячну базу
              </span>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
            {saveSuccess ? 'Профіль збережено!' : 'Зберегти профіль та ОГЗ'}
          </button>
        </div>
      </form>

      {/* Backup and Data Management */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Download className="w-4 h-4 text-amber-600" />
          Резервне копіювання даних (Офлайн)
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Усі ваші службові записи та фінансові дані зберігаються виключно в пам’яті цього пристрою. Ви можете зберегти файл резервної копії для перенесення на інший смартфон.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Завантажити копію (.json)
          </button>

          <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-amber-600" />
            Відновити з файлу
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
