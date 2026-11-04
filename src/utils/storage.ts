import { Wallet, Category, Transaction, AppSettings } from '../types';
import { CLEAN_WALLET, DEFAULT_CATEGORIES, EMPTY_TRANSACTIONS, INITIAL_SETTINGS } from './seedData';

const STORAGE_KEYS = {
  WALLET: 'dompetku_wallet',
  CATEGORIES: 'dompetku_categories',
  TRANSACTIONS: 'dompetku_transactions',
  SETTINGS: 'dompetku_settings',
  INITIALIZED: 'dompetku_initialized_v2',
};

export const storage = {
  getWallet(): Wallet {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WALLET);
      return data ? JSON.parse(data) : CLEAN_WALLET;
    } catch {
      return CLEAN_WALLET;
    }
  },

  saveWallet(wallet: Wallet): void {
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : EMPTY_TRANSACTIONS;
    } catch {
      return EMPTY_TRANSACTIONS;
    }
  },

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Export full JSON backup
  createBackupData(): string {
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      wallet: this.getWallet(),
      categories: this.getCategories(),
      transactions: this.getTransactions(),
      settings: this.getSettings(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Restore from JSON string
  restoreFromBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.wallet && Array.isArray(parsed.categories) && Array.isArray(parsed.transactions)) {
        this.saveWallet(parsed.wallet);
        this.saveCategories(parsed.categories);
        this.saveTransactions(parsed.transactions);
        if (parsed.settings) {
          this.saveSettings(parsed.settings);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to parse backup JSON:', e);
      return false;
    }
  },

  // Complete reset to 0 (Fresh Slate)
  resetToZero(): void {
    this.saveWallet(CLEAN_WALLET);
    this.saveTransactions([]);
    this.saveCategories(DEFAULT_CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  }
};
