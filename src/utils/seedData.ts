import { Wallet, Category, Transaction, AppSettings } from '../types';

export const INITIAL_WALLET: Wallet = {
  id: 'wallet-default',
  name: 'Dompet Utama',
  initial_balance: 4000000, // Rp 4.000.000
  created_at: new Date('2026-11-01T00:00:00Z').toISOString(),
};

export const INITIAL_SETTINGS: AppSettings = {
  userName: 'Pengguna DompetKu',
  currency: 'Rupiah (IDR)',
  darkMode: false,
  pinLockEnabled: false,
  pinCode: '',
};

export const INITIAL_CATEGORIES: Category[] = [
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
  { id: 'cat-exp-7', name: 'Kopi & Camilan', type: 'EXPENSE', color: '#A0522D', is_default: false },
  { id: 'cat-exp-8', name: 'Donasi', type: 'EXPENSE', color: '#2E7D52', is_default: false },
  { id: 'cat-exp-9', name: 'Lainnya', type: 'EXPENSE', color: '#6F736C', is_default: true },
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

// Helper to construct exact dates relative to today
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const makeDate = (dayOffset: number, hours: number, minutes: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() - dayOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // HARI INI
  {
    id: 'tx-1',
    wallet_id: 'wallet-default',
    category_id: 'cat-inc-1', // Gaji
    type: 'INCOME',
    amount: 6500000,
    date: makeDate(0, 7, 30),
    note: 'Gaji bulanan',
    created_at: makeDate(0, 7, 30),
    updated_at: makeDate(0, 7, 30),
  },
  {
    id: 'tx-2',
    wallet_id: 'wallet-default',
    category_id: 'cat-exp-1', // Makan
    type: 'EXPENSE',
    amount: 45000,
    date: makeDate(0, 12, 10),
    note: 'Makan siang',
    created_at: makeDate(0, 12, 10),
    updated_at: makeDate(0, 12, 10),
  },

  // KEMARIN
  {
    id: 'tx-3',
    wallet_id: 'wallet-default',
    category_id: 'cat-exp-2', // Transport
    type: 'EXPENSE',
    amount: 100000,
    date: makeDate(1, 17, 45),
    note: 'Bensin',
    created_at: makeDate(1, 17, 45),
    updated_at: makeDate(1, 17, 45),
  },
  {
    id: 'tx-4',
    wallet_id: 'wallet-default',
    category_id: 'cat-exp-7', // Kopi & Camilan
    type: 'EXPENSE',
    amount: 38000,
    date: makeDate(1, 15, 20),
    note: 'Kopi & camilan',
    created_at: makeDate(1, 15, 20),
    updated_at: makeDate(1, 15, 20),
  },

  // 2 HARI LALU
  {
    id: 'tx-5',
    wallet_id: 'wallet-default',
    category_id: 'cat-inc-2', // Usaha
    type: 'INCOME',
    amount: 1700000,
    date: makeDate(2, 10, 0),
    note: 'Proyek freelance',
    created_at: makeDate(2, 10, 0),
    updated_at: makeDate(2, 10, 0),
  },
  {
    id: 'tx-6',
    wallet_id: 'wallet-default',
    category_id: 'cat-exp-4', // Tagihan
    type: 'EXPENSE',
    amount: 420000,
    date: makeDate(2, 9, 15),
    note: 'Tagihan listrik',
    created_at: makeDate(2, 9, 15),
    updated_at: makeDate(2, 9, 15),
  },

  // PENGELUARAN LAINNYA SEHINGGA TOTAL EXPENSE = 3.750.000
  // (45k + 100k + 38k + 420k = 603k. Sisa: 3.147.000)
  {
    id: 'tx-7',
    wallet_id: 'wallet-default',
    category_id: 'cat-exp-3', // Belanja
    type: 'EXPENSE',
    amount: 2147000,
    date: makeDate(4, 14, 0),
    note: 'Belanja bulanan supermarket',
    created_at: makeDate(4, 14, 0),
    updated_at: makeDate(4, 14, 0),
  },
  {
    id: 'tx-8',
    wallet_id: 'wallet-default',
    category_id: 'cat-exp-5', // Hiburan
    type: 'EXPENSE',
    amount: 1000000,
    date: makeDate(5, 19, 30),
    note: 'Langganan & nonton bioskop',
    created_at: makeDate(5, 19, 30),
    updated_at: makeDate(5, 19, 30),
  },
];

