import React from 'react';
import { Plus, Minus, ArrowLeftRight } from 'lucide-react';

interface ActionButtonsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onOpenTransfer: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddIncome,
  onAddExpense,
  onOpenTransfer,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 my-5">
      <button
        type="button"
        onClick={onAddIncome}
        className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white font-medium text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] shadow-sm"
        title="Catat pendapatan baru (masuk ke Dompet Biru)"
      >
        <Plus size={16} strokeWidth={2.5} />
        <span className="truncate">+ Masuk (Biru)</span>
      </button>

      <button
        type="button"
        onClick={onOpenTransfer}
        className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-white dark:bg-[#1C221E] hover:bg-[#F2EFE6] dark:hover:bg-[#252E28] text-[#1C201D] dark:text-[#E8F0EA] border border-[#DDD9CD] dark:border-[#2D3630] font-medium text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] shadow-xs"
        title="Pindahkan dana antar dompet (Biru ➔ Merah, Merah ➔ Umum)"
      >
        <ArrowLeftRight size={16} strokeWidth={2.2} className="text-blue-600 dark:text-blue-400" />
        <span className="truncate">Pindah Dana</span>
      </button>

      <button
        type="button"
        onClick={onAddExpense}
        className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-[#F6EBE8] dark:bg-[#2A1D1C] hover:bg-[#F2DFDB] dark:hover:bg-[#382625] text-[#A73C2C] dark:text-[#E98274] border border-[#F0D5D0] dark:border-[#4B2F2C] font-medium text-xs sm:text-sm transition-all duration-200 active:scale-[0.98]"
        title="Catat pengeluaran harian (keluar dari Dompet Umum)"
      >
        <Minus size={16} strokeWidth={2.5} />
        <span className="truncate">- Keluar (Umum)</span>
      </button>
    </div>
  );
};
