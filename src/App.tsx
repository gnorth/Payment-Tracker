import React, { useState } from 'react';
import { format } from 'date-fns';
import { TabType, DEFAULT_CATEGORIES } from './types';
import { useTrackerData } from './hooks/useTrackerData';
import { usePayoutCalculations } from './hooks/usePayoutCalculations';

import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { ReconciliationView } from './components/ReconciliationView';
import { GuideView } from './components/GuideView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsModal } from './components/SettingsModal';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [currentMonth, setCurrentMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Core Data Layer Hook
  const {
    dayRecords,
    transactions,
    profile,
    saveDayRecord,
    batchSaveDayRecords,
    deleteDayRecord,
    addTransaction,
    deleteTransaction,
    saveProfile
  } = useTrackerData();

  // Business Logic / Calculations Hook
  const {
    monthCalculation,
    milestone70k,
    totalReceivedForMonth
  } = usePayoutCalculations({
    currentMonth,
    dayRecords,
    transactions,
    baseMonthlySalary: profile.baseMonthlySalary,
    hasRear10k: profile.hasRear10k,
    categories: DEFAULT_CATEGORIES
  });

  return (
    <div
      className={`min-h-screen font-sans pb-20 md:pb-12 transition-colors selection:bg-emerald-500 selection:text-white ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        combatDaysCount={milestone70k.totalCombatDays}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      <main className="max-w-xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4">
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
            onSaveDayRecord={saveDayRecord}
            onDeleteDayRecord={deleteDayRecord}
            onBatchSaveRecords={batchSaveDayRecords}
            categories={DEFAULT_CATEGORIES}
          />
        )}

        {activeTab === 'reconciliation' && (
          <ReconciliationView
            currentMonth={currentMonth}
            expectedTotal={monthCalculation.totalExpected}
            transactions={transactions}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        )}

        {activeTab === 'guide' && <GuideView />}

        {activeTab === 'analytics' && (
          <AnalyticsView
            dayRecords={dayRecords}
            transactions={transactions}
            baseMonthlySalary={profile.baseMonthlySalary}
            hasRear10k={profile.hasRear10k}
            categories={DEFAULT_CATEGORIES}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal
            profile={profile}
            onSaveProfile={saveProfile}
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
        rank={profile.rankName || ''}
        position={profile.positionName || ''}
        hasRear10k={profile.hasRear10k}
        categories={DEFAULT_CATEGORIES}
      />
    </div>
  );
};

export default App;
