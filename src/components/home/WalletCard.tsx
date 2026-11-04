import React from 'react';
import { formatRupiah } from '../../utils/format';

interface WalletCardProps {
  balance: number;
  income: number;
  expense: number;
}

export const WalletCard: React.FC<WalletCardProps> = ({ balance, income, expense }) => {
  return (
    <div className="w-full bg-[#1B3B2B] text-white rounded-3xl p-6 shadow-sm shadow-[#1B3B2B]/10 relative overflow-hidden transition-all duration-300">
      {/* Subtle organic background curve */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10">
        <p className="text-[11px] font-semibold tracking-widest text-[#B0C4B8] uppercase">
          SALDO DOMPET
        </p>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2 mb-6 tracking-tight">
          {formatRupiah(balance)}
        </h2>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
          <div>
            <p className="text-xs text-[#B0C4B8] mb-1 font-medium">Pendapatan</p>
            <p className="text-base sm:text-lg font-semibold text-[#8EE0B0] font-sans">
              {formatRupiah(income)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#B0C4B8] mb-1 font-medium">Pengeluaran</p>
            <p className="text-base sm:text-lg font-semibold text-[#F6B3A9] font-sans">
              {formatRupiah(expense)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
