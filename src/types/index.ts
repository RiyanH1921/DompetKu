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
  color: string;
  is_default: boolean;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  date: string;
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

export type InvestmentCategory = 'EMAS' | 'KRIPTO';

export interface InvestmentAsset {
  id: string;
  name: string;
  category: InvestmentCategory;
  invested_amount: number; // Total modal pembelian (Rp)
  current_value: number;   // Nilai aset saat ini (Rp)
  weight_grams?: number;   // Khusus emas: jumlah gram
  buy_price_per_gram?: number; // Khusus emas: harga beli per gram
  current_price_per_gram?: number; // Khusus emas: harga pasar per gram
  platform?: string;       // Indodax, Tokocrypto, Brankas, Pegadaian, dll.
  notes?: string;
  created_at: string;
  updated_at: string;
}
