import Dexie, { type Table } from 'dexie';
import { DayRecord, FinancialProfile, PaymentTransaction } from '../types';

export class MilitaryTrackerDatabase extends Dexie {
  dayRecords!: Table<DayRecord, string>;
  profile!: Table<FinancialProfile, number>;
  transactions!: Table<PaymentTransaction, string>;

  constructor() {
    super('MilitaryPayoutTrackerDB');
    this.version(1).stores({
      dayRecords: 'date, typeId, isPaidOut',
      profile: '++id',
      transactions: 'id, date, targetMonth, category'
    });
  }
}

export const db = new MilitaryTrackerDatabase();
