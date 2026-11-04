import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Edit3, Plus, Check, X, Palette, Trash2 } from 'lucide-react';
import { Category, TransactionType } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { getCategoryInitial } from '../../utils/format';
import { COLOR_PALETTE } from '../../utils/seedData';

interface CategoryManagerProps {
  onClose: () => void;
  onOpenCreateCategory?: (type: TransactionType) => void;
  onOpenEditCategory?: (category: Category) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  onClose,
  onOpenCreateCategory,
  onOpenEditCategory,
}) => {
  const { categories, transactions, updateCategory, addCategory, deleteCategory } = useWallet();
  const [activeType, setActiveType] = useState<TransactionType>('EXPENSE');

  // Inline rename state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameInput, setEditNameInput] = useState<string>('');
  const [editColor, setEditColor] = useState<string>('');
  const [showColorPickerForId, setShowColorPickerForId] = useState<string | null>(null);

  // Quick add category state
  const [isAddingQuick, setIsAddingQuick] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatColor, setNewCatColor] = useState<string>(COLOR_PALETTE[0]);
  const [quickAddError, setQuickAddError] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const renameInputRef = useRef<HTMLInputElement>(null);
  const quickAddInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (editingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingId]);

  // Auto-focus quick add input
  useEffect(() => {
    if (isAddingQuick && quickAddInputRef.current) {
      quickAddInputRef.current.focus();
    }
  }, [isAddingQuick]);

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (feedbackMsg) {
      const timer = setTimeout(() => setFeedbackMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMsg]);

  // Count transactions per category
  const transactionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    transactions.forEach((tx) => {
      counts.set(tx.category_id, (counts.get(tx.category_id) || 0) + 1);
    });
    return counts;
  }, [transactions]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => c.type === activeType);
  }, [categories, activeType]);

  // Start inline rename
  const handleStartRename = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(cat.id);
    setEditNameInput(cat.name);
    setEditColor(cat.color);
    setShowColorPickerForId(null);
  };

  // Save inline rename
  const handleSaveRename = (catId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editNameInput.trim()) {
      setFeedbackMsg({ text: 'Nama kategori tidak boleh kosong', isError: true });
      return;
    }

    updateCategory(catId, {
      name: editNameInput.trim(),
      color: editColor || undefined,
    });

    setFeedbackMsg({ text: `Kategori berhasil diubah menjadi "${editNameInput.trim()}"` });
    setEditingId(null);
    setShowColorPickerForId(null);
  };

  // Cancel inline rename
  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setShowColorPickerForId(null);
  };

  // Handle Quick Add submit
  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setQuickAddError('Nama kategori wajib diisi');
      return;
    }

    addCategory({
      name: newCatName.trim(),
      type: activeType,
      color: newCatColor,
      is_default: false,
    });

    setFeedbackMsg({ text: `Kategori "${newCatName.trim()}" berhasil ditambahkan!` });
    setNewCatName('');
    setIsAddingQuick(false);
    setQuickAddError('');
  };

  // Delete category directly
  const handleDeleteCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cat.is_default) {
      setFeedbackMsg({ text: 'Kategori bawaan sistem tidak bisa dihapus', isError: true });
      return;
    }

    const res = deleteCategory(cat.id);
    if (!res.success) {
      setFeedbackMsg({ text: res.message || 'Kategori sedang digunakan transaksi', isError: true });
    } else {
      setFeedbackMsg({ text: `Kategori "${cat.name}" berhasil dihapus` });
      setEditingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F5EE] dark:bg-[#121614] overflow-y-auto max-w-md mx-auto flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-[#F6F5EE] dark:bg-[#121614] z-20 border-b border-[#E3E1D5]/60 dark:border-white/5">
        <button
          onClick={onClose}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1C201D] dark:text-[#E8F0EA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-serif text-xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          Kelola kategori
        </h1>
        <div className="w-8" />
      </header>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div
          className={`mx-5 mt-2 p-3 rounded-2xl text-xs font-medium text-center animate-fadeIn ${
            feedbackMsg.isError
              ? 'bg-[#FDF2F0] text-[#9E2A20] border border-[#F8C8C2]'
              : 'bg-[#EAF3ED] text-[#1B3B2B] dark:bg-[#1E392A] dark:text-[#8EE0B0] border border-[#C5E1CF]'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      <div className="flex-1 px-5 pt-3 pb-28 flex flex-col">
        {/* Income vs Expense Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#E9E7DC] dark:bg-[#1C221E] p-1.5 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => {
              setActiveType('INCOME');
              setIsAddingQuick(false);
              setEditingId(null);
            }}
            className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeType === 'INCOME'
                ? 'bg-[#1B3B2B] text-white shadow-sm'
                : 'text-[#565A53] dark:text-[#8E948B]'
            }`}
          >
            Pendapatan
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveType('EXPENSE');
              setIsAddingQuick(false);
              setEditingId(null);
            }}
            className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeType === 'EXPENSE'
                ? 'bg-[#A73C2C] text-white shadow-sm'
                : 'text-[#565A53] dark:text-[#8E948B]'
            }`}
          >
            Pengeluaran
          </button>
        </div>

        {/* Quick Add Form Card */}
        {isAddingQuick && (
          <form
            onSubmit={handleQuickAddSubmit}
            className="mb-4 p-4 rounded-3xl bg-white dark:bg-[#1C221E] border-2 border-[#1B3B2B]/30 shadow-md animate-fadeIn"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-serif font-bold text-sm text-[#1C201D] dark:text-[#E8F0EA]">
                Tambah Kategori {activeType === 'INCOME' ? 'Pendapatan' : 'Pengeluaran'}
              </span>
              <button
                type="button"
                onClick={() => setIsAddingQuick(false)}
                className="text-[#767A73] hover:text-[#1C201D] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: newCatColor }}
              >
                {getCategoryInitial(newCatName || 'K')}
              </div>
              <input
                ref={quickAddInputRef}
                type="text"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  setQuickAddError('');
                }}
                placeholder="Contoh: Kopi, Donasi, Bonus..."
                className="flex-1 bg-[#F6F5EE] dark:bg-[#121614] border border-[#DDD9CD] dark:border-[#2D3630] rounded-xl px-3.5 py-2.5 text-sm text-[#1C201D] dark:text-[#E8F0EA] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
              />
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 mb-3">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCatColor(c)}
                  className={`w-7 h-7 rounded-full flex-shrink-0 transition-transform ${
                    newCatColor === c ? 'ring-2 ring-offset-2 ring-[#1B3B2B] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {quickAddError && (
              <p className="text-xs text-red-500 font-medium mb-2">{quickAddError}</p>
            )}

            <div className="flex items-center justify-between pt-1">
              {onOpenCreateCategory && (
                <button
                  type="button"
                  onClick={() => onOpenCreateCategory(activeType)}
                  className="text-[11px] text-[#767A73] dark:text-[#8E948B] hover:text-[#1B3B2B] underline"
                >
                  Buka formulir penuh
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsAddingQuick(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#DDD9CD] text-xs font-semibold text-[#555A51]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1B3B2B] text-white text-xs font-semibold hover:bg-[#254C38]"
                >
                  Simpan
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Category List */}
        <div className="space-y-1 divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          {filteredCategories.map((cat) => {
            const count = transactionCounts.get(cat.id) || 0;
            const initial = getCategoryInitial(cat.name);
            const isEditingThis = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className={`py-3 px-3 -mx-2 rounded-2xl transition-all ${
                  isEditingThis
                    ? 'bg-white dark:bg-[#1C221E] shadow-sm border border-[#1B3B2B]/30'
                    : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                }`}
              >
                {isEditingThis ? (
                  /* INLINE EDIT MODE (Instant rename) */
                  <form onSubmit={(e) => handleSaveRename(cat.id, e)} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: editColor || cat.color }}
                      >
                        {getCategoryInitial(editNameInput || cat.name)}
                      </div>
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={editNameInput}
                        onChange={(e) => setEditNameInput(e.target.value)}
                        className="flex-1 bg-[#F6F5EE] dark:bg-[#121614] border border-[#DDD9CD] rounded-xl px-3 py-2 text-sm font-semibold text-[#1C201D] dark:text-[#E8F0EA] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
                        placeholder="Nama kategori"
                      />
                      <button
                        type="submit"
                        className="w-9 h-9 rounded-xl bg-[#1B3B2B] text-white flex items-center justify-center hover:bg-[#254C38] flex-shrink-0"
                        title="Simpan nama baru"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRename}
                        className="w-9 h-9 rounded-xl bg-[#EDECE4] text-[#555A51] flex items-center justify-center hover:bg-[#DDD9CD] flex-shrink-0"
                        title="Batal"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Color picker toggle & delete option */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setShowColorPickerForId(
                              showColorPickerForId === cat.id ? null : cat.id
                            )
                          }
                          className="text-[#1B3B2B] dark:text-[#8EE0B0] flex items-center gap-1.5 font-medium hover:underline"
                        >
                          <Palette size={14} />
                          <span>Ganti warna</span>
                        </button>
                        {onOpenEditCategory && (
                          <button
                            type="button"
                            onClick={() => onOpenEditCategory(cat)}
                            className="text-[#767A73] dark:text-[#8E948B] hover:text-[#1B3B2B] hover:underline"
                          >
                            Opsi penuh
                          </button>
                        )}
                      </div>

                      {!cat.is_default && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCategory(cat, e)}
                          className="text-[#A73C2C] flex items-center gap-1 font-medium hover:underline"
                        >
                          <Trash2 size={13} />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    {/* Color swatches if opened */}
                    {showColorPickerForId === cat.id && (
                      <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-[#DDD9CD]/40">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditColor(c)}
                            className={`w-6 h-6 rounded-full flex-shrink-0 ${
                              (editColor || cat.color) === c
                                ? 'ring-2 ring-offset-1 ring-[#1B3B2B] scale-110'
                                : ''
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </form>
                ) : (
                  /* NORMAL DISPLAY MODE */
                  <div
                    onClick={(e) => handleStartRename(cat, e)}
                    className="flex items-center justify-between cursor-pointer group"
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

                    {/* Quick Rename Button */}
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(cat, e)}
                      className="p-2 rounded-xl text-[#8E948B] hover:text-[#1B3B2B] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      title="Ubah nama kategori"
                    >
                      <Edit3 size={17} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating/Sticky Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-[#F6F5EE]/95 dark:bg-[#121614]/95 border-t border-[#E3E1D5]/60 z-20">
        <button
          onClick={() => {
            setIsAddingQuick(true);
            setEditingId(null);
          }}
          className="w-full py-3.5 rounded-2xl bg-[#1B3B2B] hover:bg-[#244C38] active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus size={18} />
          <span>Tambah kategori baru</span>
        </button>
      </div>
    </div>
  );
};
