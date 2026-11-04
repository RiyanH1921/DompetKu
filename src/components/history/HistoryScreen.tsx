import React, { useState, useMemo } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { Transaction } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { TransactionItem } from '../transactions/TransactionItem';
import { getDateGroupLabel } from '../../utils/format';

interface HistoryScreenProps {
  onSelectTransaction: (transaction: Transaction) => void;
}

type FilterType = 'ALL' | 'INCOME' | 'EXPENSE';

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onSelectTransaction }) => {
  const { transactions, categoriesMap } = useWallet();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>(''); // e.g. "2026-11"

  // Extract unique months from transactions for the month filter pill
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      set.add(key);
    });
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Format month for label: "Nov 2026"
  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(date);
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (filterType === 'INCOME' && tx.type !== 'INCOME') return false;
      if (filterType === 'EXPENSE' && tx.type !== 'EXPENSE') return false;

      // Month filter
      if (selectedMonth) {
        const txMonth = tx.date.substring(0, 7);
        if (txMonth !== selectedMonth) return false;
      }

      // Search query filter (matches note or category name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const noteMatch = tx.note?.toLowerCase().includes(query) ?? false;
        const cat = categoriesMap.get(tx.category_id);
        const catMatch = cat?.name.toLowerCase().includes(query) ?? false;
        if (!noteMatch && !catMatch) return false;
      }

      return true;
    });
  }, [transactions, filterType, selectedMonth, searchQuery, categoriesMap]);

  // Group transactions by date label ("HARI INI", "KEMARIN", "2 HARI LALU", etc.)
  const groupedTransactions = useMemo(() => {
    const groups: { label: string; items: Transaction[] }[] = [];
    const map = new Map<string, Transaction[]>();

    filteredTransactions.forEach((tx) => {
      const label = getDateGroupLabel(tx.date);
      if (!map.has(label)) {
        map.set(label, []);
      }
      map.get(label)!.push(tx);
    });

    map.forEach((items, label) => {
      groups.push({ label, items });
    });

    return groups;
  }, [filteredTransactions]);

  return (
    <div className="pb-24 pt-4 px-5 max-w-md mx-auto">
      {/* Title */}
      <h1 className="font-serif text-3xl font-bold text-[#1C201D] dark:text-[#E8F0EA] mb-4">
        Riwayat
      </h1>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#767A73] dark:text-[#8E948B]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari transaksi atau kategori"
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] text-sm text-[#1C201D] dark:text-[#E8F0EA] placeholder-[#8E948B] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#767A73] hover:text-[#1C201D]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-6">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filterType === 'ALL'
              ? 'bg-[#D4A054] text-[#1C201D] shadow-sm'
              : 'bg-white dark:bg-[#1C221E] text-[#6F736C] dark:text-[#9BA098] border border-[#DDD9CD] dark:border-[#2D3630]'
          }`}
        >
          Semua
        </button>

        <button
          onClick={() => setFilterType('INCOME')}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            filterType === 'INCOME'
              ? 'bg-[#1B3B2B] text-white shadow-sm'
              : 'bg-white dark:bg-[#1C221E] text-[#6F736C] dark:text-[#9BA098] border border-[#DDD9CD] dark:border-[#2D3630]'
          }`}
        >
          Pendapatan
        </button>

        <button
          onClick={() => setFilterType('EXPENSE')}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            filterType === 'EXPENSE'
              ? 'bg-[#A73C2C] text-white shadow-sm'
              : 'bg-white dark:bg-[#1C221E] text-[#6F736C] dark:text-[#9BA098] border border-[#DDD9CD] dark:border-[#2D3630]'
          }`}
        >
          Pengeluaran
        </button>

        {/* Month selector dropdown / pill */}
        {availableMonths.length > 0 && (
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap appearance-none pr-7 cursor-pointer transition-colors ${
                selectedMonth
                  ? 'bg-[#1B3B2B] text-white'
                  : 'bg-white dark:bg-[#1C221E] text-[#6F736C] dark:text-[#9BA098] border border-[#DDD9CD] dark:border-[#2D3630]'
              }`}
            >
              <option value="" className="bg-white text-black">Bulan...</option>
              {availableMonths.map((m) => (
                <option key={m} value={m} className="bg-white text-black">
                  {formatMonthLabel(m)}
                </option>
              ))}
            </select>
            <Calendar
              size={12}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                selectedMonth ? 'text-white' : 'text-[#6F736C]'
              }`}
            />
          </div>
        )}
      </div>

      {/* Transaction List Grouped by Date */}
      {groupedTransactions.length === 0 ? (
        <div className="py-16 text-center text-[#767A73] dark:text-[#8E948B]">
          <p className="text-sm font-medium">Tidak ada transaksi ditemukan</p>
          <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedTransactions.map((group) => (
            <div key={group.label}>
              <h3 className="text-[11px] font-bold tracking-wider text-[#767A73] dark:text-[#8E948B] uppercase mb-2">
                {group.label}
              </h3>
              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {group.items.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    category={categoriesMap.get(tx.category_id)}
                    showTimeInsteadOfRelativeDate={true}
                    onClick={() => onSelectTransaction(tx)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
