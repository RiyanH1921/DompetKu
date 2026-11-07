import React, { useState } from 'react';
import { formatRupiah } from '../../utils/format';
import { ArrowRightLeft } from 'lucide-react';
import { WalletId } from '../../types';

interface WalletCardProps {
  totalBalance: number;
  saldoBiru: number;
  saldoMerah: number;
  saldoUmum: number;
  income: number;
  expense: number;
  onOpenTransfer?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  totalBalance,
  saldoBiru,
  saldoMerah,
  saldoUmum,
  income,
  expense,
  onOpenTransfer,
}) => {
  const [activeWallet, setActiveWallet] = useState<WalletId>('UMUM');

  const walletConfig = {
    UMUM: {
      name: 'Dompet Umum',
      tag: '🟢 BELANJA HARIAN',
      desc: 'Dipakai untuk transaksi & kebutuhan sehari-hari',
      balance: saldoUmum,
      bg: 'bg-[#1B3B2B]',
      border: 'border-[#244C38]',
      accent: 'text-[#8EE0B0]',
      subtext: 'text-[#B0C4B8]',
    },
    BIRU: {
      name: 'Dompet Biru',
      tag: '🔵 UANG DINGIN (UTAMA)',
      desc: 'Penampung seluruh pendapatan masuk. Simpanan aman.',
      balance: saldoBiru,
      bg: 'bg-[#1E3A8A]',
      border: 'border-[#2563EB]',
      accent: 'text-[#93C5FD]',
      subtext: 'text-[#BFDBFE]',
    },
    MERAH: {
      name: 'Dompet Merah',
      tag: '🔴 DANA SIAGA (READY)',
      desc: 'Dana buffer yang disisihkan dari Dompet Biru',
      balance: saldoMerah,
      bg: 'bg-[#881337]',
      border: 'border-[#BE123C]',
      accent: 'text-[#FDA4AF]',
      subtext: 'text-[#FECDD3]',
    },
  };

  const active = walletConfig[activeWallet];

  return (
    <div className="w-full space-y-3">
      {/* 3-Pocket Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-[#E9E7DC] dark:bg-[#1C221E] p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveWallet('BIRU')}
          className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeWallet === 'BIRU'
              ? 'bg-[#1E3A8A] text-white shadow-sm'
              : 'text-[#555A51] dark:text-[#8E948B] hover:text-[#1C201D] dark:hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
          <span className="truncate">D. Biru</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveWallet('MERAH')}
          className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeWallet === 'MERAH'
              ? 'bg-[#881337] text-white shadow-sm'
              : 'text-[#555A51] dark:text-[#8E948B] hover:text-[#1C201D] dark:hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
          <span className="truncate">D. Merah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveWallet('UMUM')}
          className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeWallet === 'UMUM'
              ? 'bg-[#1B3B2B] text-white shadow-sm'
              : 'text-[#555A51] dark:text-[#8E948B] hover:text-[#1C201D] dark:hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#8EE0B0] flex-shrink-0" />
          <span className="truncate">D. Umum</span>
        </button>
      </div>

      {/* Main Active Wallet Card */}
      <div
        className={`w-full ${active.bg} text-white rounded-3xl p-6 shadow-sm relative overflow-hidden transition-all duration-300`}
      >
        {/* Subtle organic background curves */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/10 ${active.accent}`}>
              {active.tag}
            </span>

            {onOpenTransfer && (
              <button
                type="button"
                onClick={onOpenTransfer}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/20 active:scale-95 text-[11px] font-medium text-white transition-all"
                title="Pindah dana antar dompet"
              >
                <ArrowRightLeft size={12} />
                <span>Pindah Dana</span>
              </button>
            )}
          </div>

          <p className="text-xs text-white/70">
            {active.desc}
          </p>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-3 mb-5 tracking-tight">
            {formatRupiah(active.balance)}
          </h2>

          {/* Quick 3-Pocket Balance Overview Bar */}
          <div className="pt-3.5 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-xs">
            <div
              onClick={() => setActiveWallet('BIRU')}
              className={`p-1.5 rounded-xl cursor-pointer transition-colors ${
                activeWallet === 'BIRU' ? 'bg-white/15' : 'hover:bg-white/5'
              }`}
            >
              <p className="text-[10px] text-white/70">Biru (Dingin)</p>
              <p className="font-semibold text-xs text-white truncate">
                {formatRupiah(saldoBiru)}
              </p>
            </div>

            <div
              onClick={() => setActiveWallet('MERAH')}
              className={`p-1.5 rounded-xl cursor-pointer transition-colors ${
                activeWallet === 'MERAH' ? 'bg-white/15' : 'hover:bg-white/5'
              }`}
            >
              <p className="text-[10px] text-white/70">Merah (Siaga)</p>
              <p className="font-semibold text-xs text-white truncate">
                {formatRupiah(saldoMerah)}
              </p>
            </div>

            <div
              onClick={() => setActiveWallet('UMUM')}
              className={`p-1.5 rounded-xl cursor-pointer transition-colors ${
                activeWallet === 'UMUM' ? 'bg-white/15' : 'hover:bg-white/5'
              }`}
            >
              <p className="text-[10px] text-white/70">Umum (Harian)</p>
              <p className="font-semibold text-xs text-white truncate">
                {formatRupiah(saldoUmum)}
              </p>
            </div>
          </div>

          {/* Overall Total Cash Bottom Bar */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-[11px]">Arus Kas:</span>
              <span className="text-[#8EE0B0] font-semibold text-[11px]">+{formatRupiah(income)}</span>
              <span className="text-[#F6B3A9] font-semibold text-[11px]">−{formatRupiah(expense)}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-white font-sans">
                Total: {formatRupiah(totalBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
