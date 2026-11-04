import React, { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Transaction, TransactionType } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { formatDateForInput } from '../../utils/format';

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  const { categories, updateTransaction, deleteTransaction } = useWallet();

  const [type, setType] = useState<TransactionType>(transaction.type);
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [categoryId, setCategoryId] = useState<string>(transaction.category_id);
  const [date, setDate] = useState<string>(formatDateForInput(new Date(transaction.date)));
  const [note, setNote] = useState<string>(transaction.note || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  const availableCategories = categories.filter((c) => c.type === type);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!numeric || numeric <= 0) return;

    const txDate = new Date(date);
    const prevDate = new Date(transaction.date);
    txDate.setHours(prevDate.getHours(), prevDate.getMinutes(), prevDate.getSeconds());

    updateTransaction(transaction.id, {
      type,
      amount: numeric,
      category_id: categoryId,
      date: txDate.toISOString(),
      note: note.trim() || undefined,
    });

    onClose();
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F5EE] dark:bg-[#121614] overflow-y-auto max-w-md mx-auto flex flex-col min-h-screen">
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-[#F6F5EE]/90 dark:bg-[#121614]/90 backdrop-blur-sm z-10 border-b border-[#E3E1D5]/40 dark:border-white/5">
        <button
          onClick={onClose}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1C201D] dark:text-[#E8F0EA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-serif text-xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          Ubah transaksi
        </h1>
        <button
          type="button"
          onClick={() => setShowConfirmDelete(true)}
          className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#A73C2C] hover:bg-[#A73C2C]/10 transition-colors"
          title="Hapus transaksi"
        >
          <Trash2 size={20} />
        </button>
      </header>

      <form onSubmit={handleSave} className="flex-1 px-5 pt-3 pb-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Income vs Expense Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#E9E7DC] dark:bg-[#1C221E] p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                type === 'INCOME'
                  ? 'bg-[#1B3B2B] text-white shadow-sm'
                  : 'text-[#565A53] dark:text-[#8E948B]'
              }`}
            >
              Pendapatan
            </button>
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                type === 'EXPENSE'
                  ? 'bg-[#A73C2C] text-white shadow-sm'
                  : 'text-[#565A53] dark:text-[#8E948B]'
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* Nominal */}
          <div className="text-center py-4 bg-white/60 dark:bg-white/[0.03] rounded-3xl border border-[#E7E5D9] dark:border-white/5 p-4 shadow-sm">
            <p className="text-[11px] font-bold tracking-widest text-[#767A73] dark:text-[#8E948B] uppercase mb-1">
              NOMINAL
            </p>
            <div className="relative inline-flex items-center justify-center">
              <span
                className={`font-serif text-3xl font-bold mr-1 ${
                  type === 'EXPENSE' ? 'text-[#A73C2C]' : 'text-[#25724A]'
                }`}
              >
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={amount ? parseInt(amount.replace(/[^0-9]/g, '') || '0', 10).toLocaleString('id-ID') : ''}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
                className={`w-48 font-serif text-3xl font-bold bg-transparent outline-none border-b-2 border-transparent focus:border-current text-left ${
                  type === 'EXPENSE' ? 'text-[#A73C2C]' : 'text-[#25724A]'
                }`}
              />
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-2">
              Kategori
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    categoryId === cat.id
                      ? type === 'EXPENSE'
                        ? 'bg-[#A73C2C] text-white shadow-sm'
                        : 'bg-[#1B3B2B] text-white shadow-sm'
                      : 'bg-white dark:bg-[#1C221E] text-[#2D312E] dark:text-[#D1D7CE] border border-[#DDD9CD] dark:border-[#2D3630]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
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
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm text-[#1C201D] dark:text-[#E8F0EA] outline-none"
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Catatan
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm text-[#1C201D] dark:text-[#E8F0EA] outline-none"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#244C38] text-white font-medium text-sm shadow-sm transition-all"
          >
            Simpan perubahan
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C221E] rounded-3xl p-6 max-w-xs w-full shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#1C201D] dark:text-[#E8F0EA] mb-2">
              Hapus transaksi?
            </h3>
            <p className="text-xs text-[#767A73] dark:text-[#9BA098] mb-6">
              Transaksi ini akan dihapus dan saldo dompet akan otomatis dihitung ulang.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#DDD9CD] dark:border-[#2D3630] text-xs font-semibold text-[#555A51] dark:text-[#D1D7CE]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-[#A73C2C] text-white text-xs font-semibold hover:bg-[#8F3325]"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

