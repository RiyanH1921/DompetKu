import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { WalletCard } from './WalletCard';
import { ActionButtons } from './ActionButtons';
import { RecentTransactions } from './RecentTransactions';
import { Transaction, TransactionType } from '../../types';

interface HomeScreenProps {
  onOpenCreateTransaction: (type: TransactionType) => void;
  onViewAllTransactions: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenCreateTransaction,
  onViewAllTransactions,
  onSelectTransaction,
  onOpenSettings,
}) => {
  const { currentBalance, totalIncome, totalExpense, transactions, categoriesMap } = useWallet();

  return (
    <div className="pt-4 px-5 max-w-md mx-auto">
      {/* Top Greeting (Page 1) */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-[#767A73] dark:text-[#8E948B] font-medium">
            Selamat datang kembali
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C201D] dark:text-[#E8F0EA] tracking-tight">
            DompetKu
          </h1>
        </div>

        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full bg-[#D4A054] text-[#1C201D] font-serif font-bold text-lg flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
          title="Buka Pengaturan"
        >
          A
        </button>
      </div>

      {/* Main Wallet Card */}
      <WalletCard
        balance={currentBalance}
        income={totalIncome}
        expense={totalExpense}
      />

      {/* Action Buttons: + Pendapatan, - Pengeluaran */}
      <ActionButtons
        onAddIncome={() => onOpenCreateTransaction('INCOME')}
        onAddExpense={() => onOpenCreateTransaction('EXPENSE')}
      />

      {/* Recent Transactions List */}
      <RecentTransactions
        transactions={transactions}
        categoriesMap={categoriesMap}
        onViewAll={onViewAllTransactions}
        onSelectTransaction={onSelectTransaction}
      />
    </div>
  );
};

