import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { db } from './db';
import { DayRecord, FinancialProfile, PaymentTransaction, DEFAULT_CATEGORIES } from './types';
import {
  calculateMonthExpectedPayout,
  calculate70kMilestone
} from './utils/calculations';

import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { ReconciliationView } from './components/ReconciliationView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsModal } from './components/SettingsModal';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'reconciliation' | 'analytics' | 'settings'>('calendar');
  const [currentMonth, setCurrentMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [stealthMode, setStealthMode] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Live IndexedDB queries
  const dayRecords = useLiveQuery(() => db.dayRecords.toArray()) || [];
  const transactions = useLiveQuery(() => db.transactions.toArray()) || [];
  const profileList = useLiveQuery(() => db.profile.toArray()) || [];

  const profile: FinancialProfile = profileList[0] || {
    baseMonthlySalary: 20100,
    rank: '',
    position: ''
  };

  // Calculations
  const monthCalculation = calculateMonthExpectedPayout(
    currentMonth,
    dayRecords,
    DEFAULT_CATEGORIES,
    profile.baseMonthlySalary
  );

  const milestone70k = calculate70kMilestone(dayRecords, DEFAULT_CATEGORIES);

  // Received for current month
  const monthTransactions = transactions.filter((t) => t.targetMonth === currentMonth);
  const totalReceivedForMonth = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Save single / batch day records
  const handleSaveDayRecord = async (record: DayRecord) => {
    await db.dayRecords.put(record);
  };

  const handleBatchSaveRecords = async (records: DayRecord[]) => {
    await db.dayRecords.bulkPut(records);
  };

  const handleDeleteDayRecord = async (dateStr: string) => {
    await db.dayRecords.delete(dateStr);
  };

  // Add/Delete transaction
  const handleAddTransaction = async (tx: PaymentTransaction) => {
    await db.transactions.put(tx);
  };

  const handleDeleteTransaction = async (id: string) => {
    await db.transactions.delete(id);
  };

  // Save Profile
  const handleSaveProfile = async (newProfile: FinancialProfile) => {
    await db.profile.clear();
    await db.profile.add(newProfile);
  };

  return (
    <div className={`min-h-screen font-sans pb-12 transition-colors selection:bg-emerald-500 selection:text-slate-950 ${
      stealthMode ? 'bg-black text-slate-200' : 'bg-slate-950 text-slate-100'
    }`}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        combatDaysCount={milestone70k.totalCombatDays}
        stealthMode={stealthMode}
        setStealthMode={setStealthMode}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 pt-4">
        {/* KPI Summary Dashboard */}
        <Dashboard
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          expectedTotal={monthCalculation.totalExpected}
          baseSalary={monthCalculation.baseSalary}
          additionalRewards={monthCalculation.additionalRewards}
          receivedTotal={totalReceivedForMonth}
          combatDaysInMonth={monthCalculation.combatDaysCount}
          totalCombatDays={milestone70k.totalCombatDays}
        />

        {/* Tab content rendering */}
        {activeTab === 'calendar' && (
          <CalendarView
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            dayRecords={dayRecords}
            onSaveDayRecord={handleSaveDayRecord}
            onDeleteDayRecord={handleDeleteDayRecord}
            onBatchSaveRecords={handleBatchSaveRecords}
            categories={DEFAULT_CATEGORIES}
          />
        )}

        {activeTab === 'reconciliation' && (
          <ReconciliationView
            currentMonth={currentMonth}
            expectedTotal={monthCalculation.totalExpected}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            dayRecords={dayRecords}
            transactions={transactions}
            baseMonthlySalary={profile.baseMonthlySalary}
            categories={DEFAULT_CATEGORIES}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal
            profile={profile}
            onSaveProfile={handleSaveProfile}
            dayRecords={dayRecords}
            transactions={transactions}
            onReloadData={() => {}}
          />
        )}
      </main>

      {/* Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentMonth={currentMonth}
        dayRecords={dayRecords}
        baseMonthlySalary={profile.baseMonthlySalary}
        rank={profile.rank}
        position={profile.position}
        categories={DEFAULT_CATEGORIES}
      />
    </div>
  );
};

export default App;
