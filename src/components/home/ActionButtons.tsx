import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface ActionButtonsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddIncome,
  onAddExpense,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 my-5">
      <button
        onClick={onAddIncome}
        className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#234A36] text-white font-medium text-sm transition-all duration-200 active:scale-[0.98] shadow-sm"
      >
        <Plus size={18} strokeWidth={2.5} />
        <span>Pendapatan</span>
      </button>

      <button
        onClick={onAddExpense}
        className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#F6EBE8] dark:bg-[#2A1D1C] hover:bg-[#F2DFDB] dark:hover:bg-[#382625] text-[#A73C2C] dark:text-[#E98274] border border-[#F0D5D0] dark:border-[#4B2F2C] font-medium text-sm transition-all duration-200 active:scale-[0.98]"
      >
        <Minus size={18} strokeWidth={2.5} />
        <span>Pengeluaran</span>
      </button>
    </div>
  );
};

