import React, { useState } from 'react';
import { Settings, Save, Download, Upload, Check } from 'lucide-react';
import { FinancialProfile, DayRecord, PaymentTransaction } from '../types';
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
  const [baseSalaryInput, setBaseSalaryInput] = useState<string>(
    profile.baseMonthlySalary ? profile.baseMonthlySalary.toString() : '20100'
  );
  const [rankInput, setRankInput] = useState<string>(profile.rank || '');
  const [positionInput, setPositionInput] = useState<string>(profile.position || '');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const numSalary = parseFloat(baseSalaryInput) || 20100;

    onSaveProfile({
      ...profile,
      baseMonthlySalary: numSalary,
      rank: rankInput,
      position: positionInput
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportJSON = () => {
    const data = {
      version: 1,
      exportDate: new Date().toISOString(),
      profile: {
        baseMonthlySalary: parseFloat(baseSalaryInput) || 20100,
        rank: rankInput,
        position: positionInput
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
      `zsu_payouts_backup_${new Date().toISOString().split('T')[0]}.json`
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
          alert('Резервну копію успішно відновлено!');
          onReloadData();
        } catch (err) {
          alert('Помилка при зчитуванні файлу backup JSON.');
        }
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile & Base Salary Settings */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Settings className="w-5 h-5 text-emerald-600" />
          Налаштування тарифів та профілю
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-600 font-bold mb-1">
              Базове ОГЗ (Основне грошове забезпечення):
            </label>
            <input
              type="number"
              value={baseSalaryInput}
              onChange={(e) => setBaseSalaryInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-emerald-700 font-black focus:ring-2 focus:ring-emerald-500"
              required
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">Оклад + звання + вислуга (за замовчуванням ~20 100 грн)</span>
          </div>

          <div>
            <label className="block text-xs text-slate-600 font-bold mb-1">
              Звання (опціонально):
            </label>
            <input
              type="text"
              placeholder="наприклад: Молодший сержант"
              value={rankInput}
              onChange={(e) => setRankInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 font-bold mb-1">
              Посада (опціонально):
            </label>
            <input
              type="text"
              placeholder="наприклад: Командир відділення"
              value={positionInput}
              onChange={(e) => setPositionInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
          {saveSuccess ? 'Збережено!' : 'Зберегти налаштування'}
        </button>
      </form>

      {/* Backup & Offline Data Export/Import */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Download className="w-4 h-4 text-amber-600" />
          Резервне копіювання даних (Backup / Restore)
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Усі ваші дані зберігаються <strong>виключно на цьому пристрої</strong> (Local Storage / IndexedDB). Ви можете зберегти резервну копію у файл JSON, щоб не втратити записи при зміні смартфона чи очищенні браузера.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Завантажити файл резервної копії (.json)
          </button>

          <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-2xs cursor-pointer">
            <Upload className="w-4 h-4 text-amber-600" />
            Відновити з файлу (.json)
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
