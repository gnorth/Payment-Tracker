import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { DayRecord, FinancialProfile, PaymentTransaction } from '../types';

export function useTrackerData() {
  const dayRecords = useLiveQuery(() => db.dayRecords.toArray()) || [];
  const transactions = useLiveQuery(() => db.transactions.toArray()) || [];
  const profileList = useLiveQuery(() => db.profile.toArray()) || [];

  const profile: FinancialProfile = profileList[0] || {
    baseMonthlySalary: 20100,
    rank: '',
    position: ''
  };

  const saveDayRecord = async (record: DayRecord) => {
    await db.dayRecords.put(record);
  };

  const batchSaveDayRecords = async (records: DayRecord[]) => {
    await db.dayRecords.bulkPut(records);
  };

  const deleteDayRecord = async (dateStr: string) => {
    await db.dayRecords.delete(dateStr);
  };

  const addTransaction = async (tx: PaymentTransaction) => {
    await db.transactions.put(tx);
  };

  const deleteTransaction = async (id: string) => {
    await db.transactions.delete(id);
  };

  const saveProfile = async (newProfile: FinancialProfile) => {
    await db.profile.clear();
    await db.profile.add(newProfile);
  };

  return {
    dayRecords,
    transactions,
    profile,
    saveDayRecord,
    batchSaveDayRecords,
    deleteDayRecord,
    addTransaction,
    deleteTransaction,
    saveProfile
  };
}
