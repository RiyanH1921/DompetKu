import React, { useState } from 'react';
import { ArrowLeft, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { formatRupiah } from '../../utils/format';
import { WalletId } from '../../types';

interface TransferModalProps {
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ onClose }) => {
  const { saldoBiru, saldoMerah, saldoUmum, transferFunds } = useWallet();

  const [fromWallet, setFromWallet] = useState<WalletId>('UMUM');
  const [toWallet, setToWallet] = useState<WalletId>('MERAH');
  const [amountInput, setAmountInput] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const walletInfo: Record<
    WalletId,
    {
      name: string;
      shortName: string;
      sub: string;
      balance: number;
      dotBg: string;
      activeBg: string;
      activeRing: string;
    }
  > = {
    UMUM: {
      name: 'Dompet Umum',
      shortName: '🟢 D. Umum',
      sub: 'Uang Harian & Utama',
      balance: saldoUmum,
      dotBg: 'bg-emerald-400',
      activeBg: 'bg-[#1B3B2B]',
      activeRing: 'ring-[#1B3B2B]/20',
    },
    BIRU: {
      name: 'Dompet Biru',
      shortName: '🔵 D. Biru',
      sub: 'Uang Dingin (Simpanan)',
      balance: saldoBiru,
      dotBg: 'bg-blue-400',
      activeBg: 'bg-blue-600',
      activeRing: 'ring-blue-500/30',
    },
    MERAH: {
      name: 'Dompet Merah',
      shortName: '🔴 D. Merah',
      sub: 'Dana Siaga (Ready)',
      balance: saldoMerah,
      dotBg: 'bg-rose-400',
      activeBg: 'bg-rose-600',
      activeRing: 'ring-rose-500/30',
    },
  };

  const fromInfo = walletInfo[fromWallet];
  const toInfo = walletInfo[toWallet];

  const numericAmount = parseInt(amountInput.replace(/[^0-9]/g, '') || '0', 10);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setAmountInput(rawValue);
    setErrorMsg('');
  };

  const handleSwap = () => {
    const prevFrom = fromWallet;
    const prevTo = toWallet;
    setFromWallet(prevTo);
    setToWallet(prevFrom);
    setErrorMsg('');
  };

  const handleSelectFrom = (wallet: WalletId) => {
    setFromWallet(wallet);
    setErrorMsg('');
    if (wallet === toWallet) {
      const remaining: WalletId[] = (['UMUM', 'BIRU', 'MERAH'] as WalletId[]).filter((w) => w !== wallet);
      setToWallet(remaining[0]);
    }
  };

  const handleSelectTo = (wallet: WalletId) => {
    setToWallet(wallet);
    setErrorMsg('');
    if (wallet === fromWallet) {
      const remaining: WalletId[] = (['UMUM', 'BIRU', 'MERAH'] as WalletId[]).filter((w) => w !== wallet);
      setFromWallet(remaining[0]);
    }
  };

  const selectRoute = (from: WalletId, to: WalletId) => {
    setFromWallet(from);
    setToWallet(to);
    setErrorMsg('');
  };

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  const quickPresets: { from: WalletId; to: WalletId; label: string; desc: string }[] = [
    { from: 'UMUM', to: 'MERAH', label: '🟢 Umum ➔ 🔴 Merah', desc: 'Sisihkan Siaga' },
    { from: 'UMUM', to: 'BIRU', label: '🟢 Umum ➔ 🔵 Biru', desc: 'Tabung Dingin' },
    { from: 'MERAH', to: 'BIRU', label: '🔴 Merah ➔ 🔵 Biru', desc: 'Siaga ke Dingin' },
    { from: 'MERAH', to: 'UMUM', label: '🔴 Merah ➔ 🟢 Umum', desc: 'Siaga ke Harian' },
    { from: 'BIRU', to: 'MERAH', label: '🔵 Biru ➔ 🔴 Merah', desc: 'Dingin ke Siaga' },
    { from: 'BIRU', to: 'UMUM', label: '🔵 Biru ➔ 🟢 Umum', desc: 'Dingin ke Harian' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fromWallet === toWallet) {
      setErrorMsg('Dompet asal dan dompet tujuan tidak boleh sama.');
      return;
    }

    if (numericAmount <= 0) {
      setErrorMsg('Masukkan nominal pemindahan dana yang valid.');
      return;
    }

    if (numericAmount > fromInfo.balance) {
      setErrorMsg(`Saldo ${fromInfo.name} tidak mencukupi (${formatRupiah(fromInfo.balance)}).`);
      return;
    }

    transferFunds(fromWallet, toWallet, numericAmount, note.trim() || undefined);
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
        <div className="space-y-4">
          {/* Quick Route Shortcut Chips */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-2">
              Pilihan Cepat Alur Dana
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
              {quickPresets.map((preset) => {
                const isActive = fromWallet === preset.from && toWallet === preset.to;
                return (
                  <button
                    key={`${preset.from}-${preset.to}`}
                    type="button"
                    onClick={() => selectRoute(preset.from, preset.to)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                      isActive
                        ? 'bg-[#1B3B2B] text-white border-[#1B3B2B] shadow-xs'
                        : 'bg-white dark:bg-[#1C221E] text-[#565A53] dark:text-[#A0A69D] border-[#DDD9CD] dark:border-[#2D3630] hover:bg-[#F2EFE6]'
                    }`}
                  >
                    <span>{preset.label}</span>
                    <span className="opacity-70 text-[10px] ml-1">({preset.desc})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Source & Destination Selector */}
          <div className="bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-3xl p-4 space-y-3 shadow-xs">
            {/* Dari (Source) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#767A73] dark:text-[#8E948B]">DARI (ASAL):</span>
                <span className="text-xs font-semibold text-[#1C201D] dark:text-[#E8F0EA]">
                  Saldo: {formatRupiah(fromInfo.balance)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['UMUM', 'BIRU', 'MERAH'] as WalletId[]).map((w) => {
                  const info = walletInfo[w];
                  const isSelected = fromWallet === w;
                  return (
                    <button
                      key={`from-${w}`}
                      type="button"
                      onClick={() => handleSelectFrom(w)}
                      className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? `${info.activeBg} text-white shadow-xs ring-2 ${info.activeRing}`
                          : 'bg-[#F2EFE9] dark:bg-[#252E27] text-[#565A53] dark:text-[#A0A69D] hover:bg-[#EAE6DE]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${info.dotBg}`} />
                      <span className="truncate">{info.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Swap Button Divider */}
            <div className="relative py-1 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/[0.06] dark:border-white/[0.06]" />
              </div>
              <button
                type="button"
                onClick={handleSwap}
                className="relative z-10 px-3 py-1 rounded-full bg-[#F2EFE9] dark:bg-[#252E27] hover:bg-[#E5E1D7] text-[#1C201D] dark:text-[#E8F0EA] border border-[#DDD9CD] dark:border-[#2D3630] text-xs font-medium flex items-center gap-1 active:scale-95 transition-all"
                title="Tukar arah pemindahan"
              >
                <ArrowLeftRight size={13} />
                <span>Tukar Posisi</span>
              </button>
            </div>

            {/* Ke (Destination) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#767A73] dark:text-[#8E948B]">KE (TUJUAN):</span>
                <span className="text-xs font-semibold text-[#1C201D] dark:text-[#E8F0EA]">
                  Saldo: {formatRupiah(toInfo.balance)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['UMUM', 'BIRU', 'MERAH'] as WalletId[]).map((w) => {
                  const info = walletInfo[w];
                  const isSelected = toWallet === w;
                  return (
                    <button
                      key={`to-${w}`}
                      type="button"
                      onClick={() => handleSelectTo(w)}
                      className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? `${info.activeBg} text-white shadow-xs ring-2 ${info.activeRing}`
                          : 'bg-[#F2EFE9] dark:bg-[#252E27] text-[#565A53] dark:text-[#A0A69D] hover:bg-[#EAE6DE]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${info.dotBg}`} />
                      <span className="truncate">{info.shortName}</span>
                    </button>
                  );
                })}
              </div>
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
                autoFocus
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
              {fromInfo.balance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmountInput(fromInfo.balance.toString())}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap active:scale-95"
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
              placeholder="Contoh: Sisihkan dana siaga / Uang saku harian"
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-xs text-[#1C201D] dark:text-[#E8F0EA] outline-none"
            />
          </div>

          {/* Live Balance Impact Preview */}
          {numericAmount > 0 && (
            <div className="bg-[#EAF3ED] dark:bg-[#162D20] border border-[#C5E1CF] dark:border-[#254C38] rounded-2xl p-3.5 space-y-1.5 text-xs text-[#1B3B2B] dark:text-[#8EE0B0]">
              <p className="font-semibold">Perkiraan Saldo Setelah Pemindahan:</p>
              <div className="flex justify-between text-[11px]">
                <span>{fromInfo.name}:</span>
                <span className="font-bold">
                  {formatRupiah(Math.max(0, fromInfo.balance - numericAmount))}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>{toInfo.name}:</span>
                <span className="font-bold">
                  {formatRupiah(toInfo.balance + numericAmount)}
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
