import { Wallet, Category, Transaction, AppSettings } from '../types';

export const CLEAN_WALLET: Wallet = {
  id: 'wallet-default',
  name: 'Dompet Utama',
  initial_balance: 0, // Fresh install starts at 0
  created_at: new Date().toISOString(),
};

export const INITIAL_SETTINGS: AppSettings = {
  userName: 'Pengguna DompetKu',
  currency: 'Rupiah (IDR)',
  darkMode: false,
  pinLockEnabled: false,
  pinCode: '',
};

export const DEFAULT_CATEGORIES: Category[] = [
  // Pendapatan (Income)
  { id: 'cat-inc-1', name: 'Gaji', type: 'INCOME', color: '#25724A', is_default: true },
  { id: 'cat-inc-2', name: 'Usaha', type: 'INCOME', color: '#2B6CB0', is_default: true },
  { id: 'cat-inc-3', name: 'Bonus', type: 'INCOME', color: '#D4A054', is_default: true },
  { id: 'cat-inc-4', name: 'Lainnya', type: 'INCOME', color: '#6F736C', is_default: true },

  // Pengeluaran (Expense)
  { id: 'cat-exp-1', name: 'Makan', type: 'EXPENSE', color: '#A73C2C', is_default: true },
  { id: 'cat-exp-2', name: 'Transport', type: 'EXPENSE', color: '#2B6CB0', is_default: true },
  { id: 'cat-exp-3', name: 'Belanja', type: 'EXPENSE', color: '#D4A054', is_default: true },
  { id: 'cat-exp-4', name: 'Tagihan', type: 'EXPENSE', color: '#7C3AED', is_default: true },
  { id: 'cat-exp-5', name: 'Hiburan', type: 'EXPENSE', color: '#0D9488', is_default: true },
  { id: 'cat-exp-6', name: 'Kesehatan', type: 'EXPENSE', color: '#C0392B', is_default: true },
  { id: 'cat-exp-7', name: 'Lainnya', type: 'EXPENSE', color: '#6F736C', is_default: true },
];

export const COLOR_PALETTE = [
  '#A73C2C', // Terracotta Red
  '#D97706', // Orange
  '#D4A054', // Ochre / Amber
  '#25724A', // Forest Green
  '#2B6CB0', // Deep Blue
  '#4F46E5', // Indigo
  '#7C3AED', // Purple
  '#9333EA', // Magenta
  '#374151', // Charcoal
];

// Fresh start: No transactions by default!
export const EMPTY_TRANSACTIONS: Transaction[] = [];
