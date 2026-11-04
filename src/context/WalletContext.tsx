import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Wallet, Category, Transaction, AppSettings, InvestmentAsset } from '../types';
import { storage } from '../utils/storage';

interface WalletContextType {
  wallet: Wallet;
  categories: Category[];
  transactions: Transaction[];
  investments: InvestmentAsset[];
  settings: AppSettings;
  categoriesMap: Map<string, Category>;

  // Calculated values for Cash
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;

  // Calculated values for Investments
  totalInvested: number;
  totalCurrentValue: number;
  totalProfitLoss: number;
  totalReturnPercentage: number;
  goldTotalValue: number;
  cryptoTotalValue: number;
  mutualFundTotalValue: number;

  // Actions - Transactions
  addTransaction: (data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => void;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id' | 'created_at'>>) => void;
  deleteTransaction: (id: string) => void;

  // Actions - Categories
  addCategory: (data: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, data: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => { success: boolean; message?: string };
  isCategoryInUse: (id: string) => boolean;

  // Actions - Investments
  addInvestment: (data: Omit<InvestmentAsset, 'id' | 'created_at' | 'updated_at'>) => InvestmentAsset;
  updateInvestment: (id: string, data: Partial<Omit<InvestmentAsset, 'id' | 'created_at'>>) => void;
  updateInvestmentValue: (id: string, newValue: number) => void;
  deleteInvestment: (id: string) => void;

  // System actions
  updateInitialBalance: (amount: number) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetData: () => void;
  resetToZero: () => void;
  restoreData: (jsonString: string) => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet>(() => storage.getWallet());
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories());
  const [transactions, setTransactions] = useState<Transaction[]>(() => storage.getTransactions());
  const [investments, setInvestments] = useState<InvestmentAsset[]>(() => storage.getInvestments());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());

  // Save changes to storage
  useEffect(() => {
    storage.saveWallet(wallet);
  }, [wallet]);

  useEffect(() => {
    storage.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    storage.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    storage.saveInvestments(investments);
  }, [investments]);

  useEffect(() => {
    storage.saveSettings(settings);
    // Dark mode HTML class
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Categories Map for O(1) lookup
  const categoriesMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, [categories]);

  // Dynamic balance calculations (BR-01)
  const { totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tx) => {
      if (tx.type === 'INCOME') {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });
    return { totalIncome: income, totalExpense: expense };
  }, [transactions]);

  const currentBalance = useMemo(() => {
    return wallet.initial_balance + totalIncome - totalExpense;
  }, [wallet.initial_balance, totalIncome, totalExpense]);

  // Dynamic investment calculations
  const {
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalReturnPercentage,
    goldTotalValue,
    cryptoTotalValue,
    mutualFundTotalValue,
  } = useMemo(() => {
    let invested = 0;
    let currentVal = 0;
    let goldVal = 0;
    let cryptoVal = 0;
    let mutualFundVal = 0;

    investments.forEach((asset) => {
      invested += asset.invested_amount;
      currentVal += asset.current_value;
      if (asset.category === 'EMAS') {
        goldVal += asset.current_value;
      } else if (asset.category === 'KRIPTO') {
        cryptoVal += asset.current_value;
      } else if (asset.category === 'REKSADANA') {
        mutualFundVal += asset.current_value;
      }
    });

    const profitLoss = currentVal - invested;
    const returnPct = invested > 0 ? (profitLoss / invested) * 100 : 0;

    return {
      totalInvested: invested,
      totalCurrentValue: currentVal,
      totalProfitLoss: profitLoss,
      totalReturnPercentage: returnPct,
      goldTotalValue: goldVal,
      cryptoTotalValue: cryptoVal,
      mutualFundTotalValue: mutualFundVal,
    };
  }, [investments]);

  // Transactions management
  const addTransaction = (data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: now,
      updated_at: now,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, data: Partial<Omit<Transaction, 'id' | 'created_at'>>) => {
    const now = new Date().toISOString();
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data, updated_at: now } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  // Categories management
  const isCategoryInUse = (categoryId: string): boolean => {
    return transactions.some((tx) => tx.category_id === categoryId);
  };

  const addCategory = (data: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setCategories((prev) => [newCat, ...prev]);
    return newCat;
  };

  const updateCategory = (id: string, data: Partial<Omit<Category, 'id'>>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...data } : cat))
    );
  };

  const deleteCategory = (id: string): { success: boolean; message?: string } => {
    if (isCategoryInUse(id)) {
      return {
        success: false,
        message: 'Kategori ini masih digunakan dalam transaksi dan tidak bisa dihapus.',
      };
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    return { success: true };
  };

  // Investments management
  const addInvestment = (data: Omit<InvestmentAsset, 'id' | 'created_at' | 'updated_at'>): InvestmentAsset => {
    const now = new Date().toISOString();
    const newAsset: InvestmentAsset = {
      ...data,
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: now,
      updated_at: now,
    };
    setInvestments((prev) => [newAsset, ...prev]);
    return newAsset;
  };

  const updateInvestment = (id: string, data: Partial<Omit<InvestmentAsset, 'id' | 'created_at'>>) => {
    const now = new Date().toISOString();
    setInvestments((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, ...data, updated_at: now } : asset))
    );
  };

  const updateInvestmentValue = (id: string, newValue: number) => {
    const now = new Date().toISOString();
    setInvestments((prev) =>
      prev.map((asset) => {
        if (asset.id !== id) return asset;
        const updated: InvestmentAsset = {
          ...asset,
          current_value: Math.max(0, Math.round(newValue)),
          updated_at: now,
        };
        // If gold with weight_grams, also update current_price_per_gram
        if (asset.category === 'EMAS' && asset.weight_grams && asset.weight_grams > 0) {
          updated.current_price_per_gram = Math.round(newValue / asset.weight_grams);
        }
        return updated;
      })
    );
  };

  const deleteInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((asset) => asset.id !== id));
  };

  // Wallet balance management
  const updateInitialBalance = (amount: number) => {
    setWallet((prev) => ({ ...prev, initial_balance: Math.max(0, Math.round(amount)) }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetData = () => {
    storage.resetToZero();
    setWallet(storage.getWallet());
    setCategories(storage.getCategories());
    setTransactions([]);
    setInvestments([]);
    setSettings(storage.getSettings());
  };

  const resetToZero = () => {
    storage.resetToZero();
    setWallet(storage.getWallet());
    setCategories(storage.getCategories());
    setTransactions([]);
    setInvestments([]);
  };

  const restoreData = (jsonString: string): boolean => {
    const ok = storage.restoreFromBackup(jsonString);
    if (ok) {
      setWallet(storage.getWallet());
      setCategories(storage.getCategories());
      setTransactions(storage.getTransactions());
      setInvestments(storage.getInvestments());
      setSettings(storage.getSettings());
    }
    return ok;
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        categories,
        transactions,
        investments,
        settings,
        categoriesMap,
        currentBalance,
        totalIncome,
        totalExpense,
        totalInvested,
        totalCurrentValue,
        totalProfitLoss,
        totalReturnPercentage,
        goldTotalValue,
        cryptoTotalValue,
        mutualFundTotalValue,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        isCategoryInUse,
        addInvestment,
        updateInvestment,
        updateInvestmentValue,
        deleteInvestment,
        updateInitialBalance,
        updateSettings,
        resetData,
        resetToZero,
        restoreData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
