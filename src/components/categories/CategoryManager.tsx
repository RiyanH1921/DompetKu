import React, { useState, useMemo } from 'react';
import { ArrowLeft, Edit3, Plus } from 'lucide-react';
import { Category, TransactionType } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { getCategoryInitial } from '../../utils/format';

interface CategoryManagerProps {
  onClose: () => void;
  onOpenCreateCategory: (type: TransactionType) => void;
  onOpenEditCategory: (category: Category) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  onClose,
  onOpenCreateCategory,
  onOpenEditCategory,
}) => {
  const { categories, transactions } = useWallet();
  const [activeType, setActiveType] = useState<TransactionType>('EXPENSE');

  // Count transactions per category
  const transactionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    transactions.forEach((tx) => {
      counts.set(tx.category_id, (counts.get(tx.category_id) || 0) + 1);
    });
    return counts;
  }, [transactions]);

  const filteredCategories = categories.filter((c) => c.type === activeType);

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F5EE] dark:bg-[#121614] overflow-y-auto max-w-md mx-auto flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-[#F6F5EE]/90 dark:bg-[#121614]/90 backdrop-blur-sm z-10 border-b border-[#E3E1D5]/40 dark:border-white/5">
        <button
          onClick={onClose}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1C201D] dark:text-[#E8F0EA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-serif text-xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          Kelola kategori
        </h1>
        <div className="w-8" />
      </header>

      <div className="flex-1 px-5 pt-3 pb-24 flex flex-col">
        {/* Income vs Expense Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#E9E7DC] dark:bg-[#1C221E] p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveType('INCOME')}
            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeType === 'INCOME'
                ? 'bg-[#1B3B2B] text-white shadow-sm'
                : 'text-[#565A53] dark:text-[#8E948B]'
            }`}
          >
            Pendapatan
          </button>
          <button
            type="button"
            onClick={() => setActiveType('EXPENSE')}
            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeType === 'EXPENSE'
                ? 'bg-[#A73C2C] text-white shadow-sm'
                : 'text-[#565A53] dark:text-[#8E948B]'
            }`}
          >
            Pengeluaran
          </button>
        </div>

        {/* Category List */}
        <div className="space-y-1 divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          {filteredCategories.map((cat) => {
            const count = transactionCounts.get(cat.id) || 0;
            const initial = getCategoryInitial(cat.name);

            return (
              <div
                key={cat.id}
                onClick={() => onOpenEditCategory(cat)}
                className="flex items-center justify-between py-3.5 px-2 -mx-2 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base flex-shrink-0"
                    style={{
                      backgroundColor: `${cat.color}18`,
                      color: cat.color,
                    }}
                  >
                    {initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm sm:text-base text-[#1C201D] dark:text-[#E8F0EA]">
                        {cat.name}
                      </p>
                      {!cat.is_default && (
                        <span className="px-2 py-0.5 rounded-md bg-[#EDECE4] dark:bg-[#2A342D] text-[10px] font-medium text-[#767A73] dark:text-[#8E948B]">
                          Buatanmu
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#767A73] dark:text-[#8E948B] mt-0.5">
                      {count} transaksi
                    </p>
                  </div>
                </div>

                <div className="text-[#8E948B] group-hover:text-[#1C201D] dark:group-hover:text-white p-1">
                  <Edit3 size={17} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating/Sticky Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-gradient-to-t from-[#F6F5EE] via-[#F6F5EE] to-transparent dark:from-[#121614] dark:via-[#121614] pointer-events-auto">
        <button
          onClick={() => onOpenCreateCategory(activeType)}
          className="w-full py-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#244C38] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus size={18} />
          <span>Tambah kategori baru</span>
        </button>
      </div>
    </div>
  );
};

