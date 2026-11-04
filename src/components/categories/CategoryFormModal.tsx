import React, { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Category, TransactionType } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { COLOR_PALETTE } from '../../utils/seedData';
import { getCategoryInitial } from '../../utils/format';

interface CategoryFormModalProps {
  initialType?: TransactionType;
  editingCategory?: Category | null;
  onClose: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  initialType = 'EXPENSE',
  editingCategory = null,
  onClose,
}) => {
  const { addCategory, updateCategory, deleteCategory, isCategoryInUse } = useWallet();

  const [type, setType] = useState<TransactionType>(
    editingCategory ? editingCategory.type : initialType
  );
  const [name, setName] = useState<string>(editingCategory ? editingCategory.name : '');
  const [color, setColor] = useState<string>(
    editingCategory ? editingCategory.color : COLOR_PALETTE[0]
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  React.useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setType(editingCategory.type);
      setColor(editingCategory.color);
    } else {
      setName('');
      setType(initialType);
      setColor(COLOR_PALETTE[0]);
    }
    setErrorMsg('');
  }, [editingCategory, initialType]);

  const initialLetter = getCategoryInitial(name || 'K');
  const inUse = editingCategory ? isCategoryInUse(editingCategory.id) : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama kategori tidak boleh kosong.');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        type,
        color,
      });
    } else {
      addCategory({
        name: name.trim(),
        type,
        color,
        is_default: false,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (!editingCategory) return;
    const res = deleteCategory(editingCategory.id);
    if (!res.success) {
      setErrorMsg(res.message || 'Gagal menghapus kategori');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[#F6F5EE] dark:bg-[#121614] overflow-y-auto max-w-md mx-auto flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-[#F6F5EE]/90 dark:bg-[#121614]/90 backdrop-blur-sm z-10 border-b border-[#E3E1D5]/40 dark:border-white/5">
        <button
          onClick={onClose}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1C201D] dark:text-[#E8F0EA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-serif text-xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          {editingCategory ? 'Ubah kategori' : 'Kategori baru'}
        </h1>
        {editingCategory && !editingCategory.is_default && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#A73C2C] hover:bg-[#A73C2C]/10 transition-colors"
            title="Hapus kategori"
          >
            <Trash2 size={20} />
          </button>
        )}
        {(!editingCategory || editingCategory.is_default) && <div className="w-8" />}
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-5 pt-3 pb-8 flex flex-col justify-between">
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

          {/* Initial Avatar Preview (Page 4) */}
          <div className="text-center py-4 flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center font-serif font-bold text-3xl text-white shadow-md transition-all duration-300"
              style={{ backgroundColor: color }}
            >
              {initialLetter}
            </div>
            <p className="text-xs text-[#767A73] dark:text-[#8E948B] mt-2.5 font-medium">
              Pratinjau (inisial dari nama)
            </p>
          </div>

          {/* Nama Kategori */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Nama kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Contoh: Kopi & Camilan"
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm text-[#1C201D] dark:text-[#E8F0EA] placeholder-[#9BA098] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
              autoFocus={!editingCategory}
            />
            {errorMsg && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Color Palette Selector (Page 4) */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-2.5">
              Warna
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto py-1">
              {COLOR_PALETTE.map((c) => {
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-9 h-9 rounded-full flex-shrink-0 transition-transform duration-150 ${
                      isSelected ? 'ring-3 ring-offset-2 ring-[#1C201D] dark:ring-white scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                );
              })}
            </div>
          </div>

          {/* Notice Card */}
          <div className="p-4 rounded-2xl bg-[#EDECE4] dark:bg-[#1C221E] text-xs text-[#555A51] dark:text-[#9BA098] leading-relaxed border border-[#DDD9CD]/60 dark:border-white/5">
            <p>
              Kategori buatanmu bisa diubah atau dihapus kapan saja.{' '}
              <span className="font-semibold text-[#1C201D] dark:text-[#E8F0EA]">
                Kategori yang masih dipakai transaksi tidak bisa dihapus.
              </span>
            </p>
            {inUse && (
              <p className="text-[#A73C2C] dark:text-[#FFA49A] font-medium mt-1">
                Catatan: Kategori ini sedang aktif dipakai dalam transaksi.
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#244C38] text-white font-medium text-sm sm:text-base shadow-sm transition-all"
          >
            Simpan kategori
          </button>
        </div>
      </form>
    </div>
  );
};

