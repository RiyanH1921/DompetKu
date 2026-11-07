import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowDownUp, AlertCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { formatRupiah } from '../../utils/format';
import { WalletId } from '../../types';

interface TransferModalProps {
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ onClose }) => {
  const { saldoBiru, saldoMerah, saldoUmum, transferFunds } = useWallet();

  // Preset transfer routes
  type TransferRoute = 'BIRU_TO_MERAH' | 'MERAH_TO_UMUM' | 'UMUM_TO_BIRU';
  const [route, setRoute] = useState<TransferRoute>('BIRU_TO_MERAH');

  const [amountInput, setAmountInput] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Source & Target setup based on route
  const routeConfig = {
    BIRU_TO_MERAH: {
      from: 'BIRU' as WalletId,
      to: 'MERAH' as WalletId,
      fromLabel: 'Dompet Biru (Uang Dingin)',
      toLabel: 'Dompet Merah (Dana Siaga)',
      fromBalance: saldoBiru,
      toBalance: saldoMerah,
      fromBg: 'bg-blue-600',
      toBg: 'bg-rose-600',
      description: 'Sisihkan sebagian uang dingin menjadi dana siaga yang siap pakai.',
    },
    MERAH_TO_UMUM: {
      from: 'MERAH' as WalletId,
      to: 'UMUM' as WalletId,
      fromLabel: 'Dompet Merah (Dana Siaga)',
      toLabel: 'Dompet Umum (Uang Harian)',
      fromBalance: saldoMerah,
      toBalance: saldoUmum,
      fromBg: 'bg-rose-600',
      toBg: 'bg-[#1B3B2B]',
      description: 'Tarik dana siaga secukupnya untuk keperluan belanja sehari-hari.',
    },
    UMUM_TO_BIRU: {
      from: 'UMUM' as WalletId,
      to: 'BIRU' as WalletId,
      fromLabel: 'Dompet Umum (Uang Harian)',
      toLabel: 'Dompet Biru (Uang Dingin)',
      fromBalance: saldoUmum,
      toBalance: saldoBiru,
      fromBg: 'bg-[#1B3B2B]',
      toBg: 'bg-blue-600',
      description: 'Kembalikan sisa uang belanja harian ke simpanan uang dingin.',
    },
  };

  const currentRoute = routeConfig[route];
  const numericAmount = parseInt(amountInput.replace(/[^0-9]/g, '') || '0', 10);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setAmountInput(rawValue);
    setErrorMsg('');
  };

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (numericAmount <= 0) {
      setErrorMsg('Masukkan nominal pemindahan dana yang valid.');
      return;
    }

    if (numericAmount > currentRoute.fromBalance) {
      setErrorMsg(`Saldo ${currentRoute.fromLabel} tidak mencukupi (${formatRupiah(currentRoute.fromBalance)}).`);
      return;
    }

    transferFunds(currentRoute.from, currentRoute.to, numericAmount, note.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[#F6F5EE] dark:bg-[#121614] overflow-y-auto max-w-md mx-auto flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-[#F6F5EE] dark:bg-[#121614] z-10 border-b border-[#E3E1D5]/40 dark:border-white/5">
        <button
          onClick={onClose}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1C201D] dark:text-[#E8F0EA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-serif text-xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          Pindah Dana Antar Dompet
        </h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-5 pt-4 pb-8 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Route Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-2">
              Pilih Alur Pemindahan Dana
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRoute('BIRU_TO_MERAH');
                  setErrorMsg('');
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  route === 'BIRU_TO_MERAH'
                    ? 'bg-white dark:bg-[#1C221E] border-blue-600 shadow-sm ring-2 ring-blue-600/20'
                    : 'bg-white/60 dark:bg-white/[0.02] border-[#DDD9CD] dark:border-[#2D3630]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C201D] dark:text-[#E8F0EA] mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0" />
                  <span>Biru</span>
                  <ArrowRight size={13} className="text-[#767A73]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 flex-shrink-0" />
                  <span>Merah</span>
                </div>
                <p className="text-[11px] text-[#767A73] dark:text-[#8E948B]">
                  Sisihkan ke Dana Siaga
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRoute('MERAH_TO_UMUM');
                  setErrorMsg('');
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  route === 'MERAH_TO_UMUM'
                    ? 'bg-white dark:bg-[#1C221E] border-rose-600 shadow-sm ring-2 ring-rose-600/20'
                    : 'bg-white/60 dark:bg-white/[0.02] border-[#DDD9CD] dark:border-[#2D3630]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C201D] dark:text-[#E8F0EA] mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 flex-shrink-0" />
                  <span>Merah</span>
                  <ArrowRight size={13} className="text-[#767A73]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B3B2B] flex-shrink-0" />
                  <span>Umum</span>
                </div>
                <p className="text-[11px] text-[#767A73] dark:text-[#8E948B]">
                  Tarik untuk Harian
                </p>
              </button>
            </div>

            {/* Optional reverse route toggle */}
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => {
                  setRoute(route === 'UMUM_TO_BIRU' ? 'BIRU_TO_MERAH' : 'UMUM_TO_BIRU');
                  setErrorMsg('');
                }}
                className="text-[11px] text-[#767A73] hover:text-[#1C201D] dark:hover:text-[#E8F0EA] inline-flex items-center gap-1"
              >
                <ArrowDownUp size={12} />
                <span>{route === 'UMUM_TO_BIRU' ? 'Kembali ke alur utama' : 'Atau: Kembalikan dari Umum ➔ Biru'}</span>
              </button>
            </div>
          </div>

          {/* Source & Destination Visual Cards */}
          <div className="bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#767A73] dark:text-[#8E948B]">Dompet Asal:</span>
              <span className="font-semibold text-[#1C201D] dark:text-[#E8F0EA]">
                {currentRoute.fromLabel}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04] dark:border-white/[0.04]">
              <span className="text-[#767A73] dark:text-[#8E948B]">Saldo Tersedia:</span>
              <span className="font-bold text-[#1C201D] dark:text-[#E8F0EA] font-serif text-sm">
                {formatRupiah(currentRoute.fromBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04] dark:border-white/[0.04]">
              <span className="text-[#767A73] dark:text-[#8E948B]">Dompet Tujuan:</span>
              <span className="font-semibold text-[#1C201D] dark:text-[#E8F0EA]">
                {currentRoute.toLabel}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-2">
              Nominal yang Ingin Dipindahkan (Rupiah)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#767A73]">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={numericAmount > 0 ? numericAmount.toLocaleString('id-ID') : ''}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl pl-12 pr-4 py-3.5 text-base sm:text-lg font-bold text-[#1C201D] dark:text-[#E8F0EA] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 mt-1.5 no-scrollbar">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmountInput(q.toString())}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] text-[11px] font-medium text-[#555A51] dark:text-[#D1D7CE] whitespace-nowrap active:scale-95 transition-all"
                >
                  +{q >= 1000000 ? `${q / 1000000}jt` : `${q / 1000}rb`}
                </button>
              ))}
              {currentRoute.fromBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmountInput(currentRoute.fromBalance.toString())}
                  className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap active:scale-95"
                >
                  Pindah Semua
                </button>
              )}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Sisihkan dana siaga / Uang saku minggu ini"
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-xs text-[#1C201D] dark:text-[#E8F0EA] outline-none"
            />
          </div>

          {/* Live Balance Impact Preview */}
          {numericAmount > 0 && (
            <div className="bg-[#EAF3ED] dark:bg-[#162D20] border border-[#C5E1CF] dark:border-[#254C38] rounded-2xl p-3.5 space-y-1.5 text-xs text-[#1B3B2B] dark:text-[#8EE0B0]">
              <p className="font-semibold">Perkiraan Saldo Setelah Pemindahan:</p>
              <div className="flex justify-between text-[11px]">
                <span>{currentRoute.fromLabel}:</span>
                <span className="font-bold">
                  {formatRupiah(Math.max(0, currentRoute.fromBalance - numericAmount))}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>{currentRoute.toLabel}:</span>
                <span className="font-bold">
                  {formatRupiah(currentRoute.toBalance + numericAmount)}
                </span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl text-xs">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#254C38] text-white font-medium text-sm shadow-sm active:scale-[0.99] transition-all"
          >
            Pindahkan Dana Sekarang
          </button>
        </div>
      </form>
    </div>
  );
};
