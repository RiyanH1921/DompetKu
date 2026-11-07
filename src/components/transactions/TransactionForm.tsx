import React, { useState, useMemo } from 'react';
import { ArrowLeft, AlertCircle, Plus } from 'lucide-react';
import { CategoryType } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { formatRupiah, formatDateForInput } from '../../utils/format';

interface TransactionFormProps {
  initialType?: CategoryType;
  onClose: () => void;
  onOpenManageCategories: () => void;
  onOpenNewCategory: (type: CategoryType) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialType = 'EXPENSE',
  onClose,
  onOpenManageCategories,
  onOpenNewCategory,
}) => {
  const { categories, currentBalance, saldoBiru, saldoUmum, addTransaction } = useWallet();

  const [type, setType] = useState<CategoryType>(initialType);
  const [amountInput, setAmountInput] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(formatDateForInput(new Date()));
  const [note, setNote] = useState<string>('');
  const [showOverbalanceWarning, setShowOverbalanceWarning] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Target wallet balance based on transaction type
  const targetWalletBalance = type === 'INCOME' ? saldoBiru : saldoUmum;

  // Filter categories by selected transaction type
  const availableCategories = useMemo(() => {
    return categories.filter((cat) => cat.type === type);
  }, [categories, type]);

  // Set default category or auto-select newly added category
  const prevCountRef = React.useRef(categories.length);
  React.useEffect(() => {
    if (categories.length > prevCountRef.current) {
      const newest = categories[0];
      if (newest && newest.type === type) {
        setCategoryId(newest.id);
      }
    } else if (availableCategories.length > 0) {
      if (!availableCategories.some((c) => c.id === categoryId)) {
        setCategoryId(availableCategories[0].id);
      }
    } else {
      setCategoryId('');
    }
    prevCountRef.current = categories.length;
  }, [availableCategories, categories, type, categoryId]);

  const numericAmount = useMemo(() => {
    const cleaned = amountInput.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  }, [amountInput]);

  // Realtime balance after transaction calculation (FR-12, FR-09)
  const balanceAfterTransaction = useMemo(() => {
    if (type === 'INCOME') {
      return targetWalletBalance + numericAmount;
    } else {
      return targetWalletBalance - numericAmount;
    }
  }, [targetWalletBalance, numericAmount, type]);

  const isOverbalance = type === 'EXPENSE' && numericAmount > saldoUmum;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setAmountInput(rawValue);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (numericAmount <= 0) {
      setErrorMsg('Nominal transaksi harus lebih dari 0.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Pilih kategori transaksi terlebih dahulu.');
      return;
    }

    // Check overbalance (BR-03 & FR-13)
    if (isOverbalance && !showOverbalanceWarning) {
      setShowOverbalanceWarning(true);
      return;
    }

    const txDate = new Date(date);
    const now = new Date();
    // Inherit current hour/minute so order within the day is preserved
    txDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    addTransaction({
      wallet_id: type === 'INCOME' ? 'BIRU' : 'UMUM',
      category_id: categoryId,
      type,
      amount: numericAmount,
      date: txDate.toISOString(),
      note: note.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F5EE] dark:bg-[#121614] overflow-y-auto max-w-md mx-auto flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-[#F6F5EE]/90 dark:bg-[#121614]/90 backdrop-blur-sm z-10 border-b border-[#E3E1D5]/40 dark:border-white/5">
        <button
          onClick={onClose}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1C201D] dark:text-[#E8F0EA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-serif text-xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          Catat transaksi
        </h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-5 pt-3 pb-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Income vs Expense Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#E9E7DC] dark:bg-[#1C221E] p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setType('INCOME');
                setShowOverbalanceWarning(false);
              }}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                type === 'INCOME'
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'text-[#565A53] dark:text-[#8E948B] hover:text-[#1C201D] dark:hover:text-white'
              }`}
            >
              Pendapatan
            </button>
            <button
              type="button"
              onClick={() => {
                setType('EXPENSE');
                setShowOverbalanceWarning(false);
              }}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                type === 'EXPENSE'
                  ? 'bg-[#A73C2C] text-white shadow-sm'
                  : 'text-[#565A53] dark:text-[#8E948B] hover:text-[#1C201D] dark:hover:text-white'
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* 3-Pocket Target Destination Indicator */}
          <div className="text-center -mt-2">
            {type === 'INCOME' ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full font-medium border border-blue-200/60 dark:border-blue-800/60">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Masuk langsung ke <strong>Dompet Biru</strong> (Uang Dingin)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#1B3B2B] dark:text-[#8EE0B0] bg-[#EAF3ED] dark:bg-[#162D20] px-3 py-1 rounded-full font-medium border border-[#C5E1CF] dark:border-[#254C38]">
                <span className="w-2 h-2 rounded-full bg-[#1B3B2B] dark:bg-[#8EE0B0]" />
                <span>Memotong saldo <strong>Dompet Umum</strong> (Uang Harian)</span>
              </span>
            )}
          </div>

          {/* Nominal Display & Input */}
          <div className="text-center py-4 bg-white/60 dark:bg-white/[0.03] rounded-3xl border border-[#E7E5D9] dark:border-white/5 p-4 shadow-sm">
            <p className="text-[11px] font-bold tracking-widest text-[#767A73] dark:text-[#8E948B] uppercase mb-1">
              NOMINAL
            </p>
            <div className="relative inline-flex items-center justify-center max-w-full">
              <span
                className={`font-serif text-3xl sm:text-4xl font-bold mr-1 ${
                  type === 'EXPENSE'
                    ? 'text-[#A73C2C] dark:text-[#F6B3A9]'
                    : 'text-[#25724A] dark:text-[#8EE0B0]'
                }`}
              >
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={numericAmount > 0 ? numericAmount.toLocaleString('id-ID') : ''}
                onChange={handleAmountChange}
                placeholder="0"
                className={`w-48 sm:w-56 font-serif text-3xl sm:text-4xl font-bold bg-transparent outline-none border-b-2 border-transparent focus:border-current text-left ${
                  type === 'EXPENSE'
                    ? 'text-[#A73C2C] dark:text-[#F6B3A9]'
                    : 'text-[#25724A] dark:text-[#8EE0B0]'
                }`}
                autoFocus
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-[#767A73] dark:text-[#8E948B]">
                Kategori
              </label>
              <button
                type="button"
                onClick={onOpenManageCategories}
                className="text-xs text-[#767A73] dark:text-[#9BA098] hover:text-[#1B3B2B] dark:hover:text-white underline underline-offset-2"
              >
                Kelola
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 ${
                      isSelected
                        ? type === 'EXPENSE'
                          ? 'bg-[#A73C2C] text-white shadow-sm ring-2 ring-[#A73C2C]/20'
                          : 'bg-[#1B3B2B] text-white shadow-sm ring-2 ring-[#1B3B2B]/20'
                        : 'bg-white dark:bg-[#1C221E] text-[#2D312E] dark:text-[#D1D7CE] border border-[#DDD9CD] dark:border-[#2D3630] hover:bg-black/[0.02]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onOpenNewCategory(type)}
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-dashed border-[#B8B4A5] dark:border-[#434F47] text-[#555A51] dark:text-[#A7AFA5] hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Kategori baru</span>
              </button>
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Tanggal
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm text-[#1C201D] dark:text-[#E8F0EA] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
            />
          </div>

          {/* Catatan (opsional) */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Catatan (opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Makan malam bersama keluarga"
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm text-[#1C201D] dark:text-[#E8F0EA] placeholder-[#9BA098] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
            />
          </div>

          {/* Saldo setelah transaksi card */}
          <div className="bg-[#1B3B2B] dark:bg-[#182B21] text-white rounded-2xl px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm shadow-sm">
            <span className="text-[#B0C4B8] font-medium">Saldo setelah transaksi</span>
            <span
              className={`font-semibold font-serif text-sm sm:text-base ${
                balanceAfterTransaction < 0 ? 'text-[#FF8D7E]' : 'text-white'
              }`}
            >
              {formatRupiah(balanceAfterTransaction)}
            </span>
          </div>

          {/* Overbalance alert dialog (BR-03 & FR-13) */}
          {showOverbalanceWarning && (
            <div className="p-4 rounded-2xl bg-[#FDF2F0] dark:bg-[#341C1A] border border-[#F8C8C2] dark:border-[#5C2E2A] text-[#9E2A20] dark:text-[#FFA49A] flex items-start gap-3 text-xs animate-fadeIn">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Peringatan: Saldo Tidak Cukup</p>
                <p>
                  Nominal pengeluaran ini ({formatRupiah(numericAmount)}) lebih besar dari saldo dompet saat ini ({formatRupiah(currentBalance)}). Apakah Anda tetap ingin melanjutkan pencatatan?
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#A73C2C] text-white font-medium hover:bg-[#8B3023]"
                  >
                    Ya, Tetap Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOverbalanceWarning(false)}
                    className="px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 text-inherit font-medium"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#244C38] active:scale-[0.99] text-white font-medium text-sm sm:text-base shadow-sm transition-all duration-200"
          >
            Simpan transaksi
          </button>
        </div>
      </form>
    </div>
  );
};
