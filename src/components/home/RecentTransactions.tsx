import React from 'react';
import { Transaction, Category } from '../../types';
import { TransactionItem } from '../transactions/TransactionItem';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categoriesMap: Map<string, Category>;
  onViewAll: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  categoriesMap,
  onViewAll,
  onSelectTransaction,
}) => {
  const recentList = transactions.slice(0, 5);

  return (
    <div className="mt-4 pb-20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-lg font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          Transaksi terbaru
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs text-[#767A73] dark:text-[#9BA098] hover:text-[#1B3B2B] dark:hover:text-white font-medium transition-colors"
        >
          Lihat semua
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="py-12 text-center text-[#767A73] dark:text-[#8E948B]">
          <p className="text-sm">Belum ada transaksi</p>
          <p className="text-xs mt-1">Mulai catat pemasukan atau pengeluaran Anda</p>
        </div>
      ) : (
        <div className="divide-y divide-transparent">
          {recentList.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              category={categoriesMap.get(tx.category_id)}
              onClick={() => onSelectTransaction(tx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
