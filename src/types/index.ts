export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Wallet {
  id: string;
  name: string;
  initial_balance: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color: string; // Hex color for the circle badge, e.g. '#A73C2C'
  is_default: boolean;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  category_id: string;
  type: TransactionType;
  amount: number; // Positive integer IDR
  date: string; // ISO string or YYYY-MM-DD / YYYY-MM-DDTHH:mm
  note?: string;
  created_at: string;
  updated_at: string;
}

export type TimePeriod = 'harian' | 'mingguan' | 'bulanan' | 'tahunan' | 'kustom';

export type ExportFormat = 'xlsx' | 'csv';

export interface AppSettings {
  userName: string;
  currency: string;
  darkMode: boolean;
  pinLockEnabled: boolean;
  pinCode?: string;
}
