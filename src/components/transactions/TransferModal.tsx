import React, { useState } from 'react';
import { ArrowLeft, ArrowLeftRight, ArrowRight, AlertCircle } from 'lucide-react';
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
      shortName: 'D. Umum',
      sub: 'Uang Harian & Utama',
      balance: saldoUmum,
      dotBg: 'bg-emerald-500',
      activeBg: 'bg-[#1B3B2B]',
      activeRing: 'ring-[#1B3B2B]/20',
    },
    BIRU: {
      name: 'Dompet Biru',
      shortName: 'D. Biru',
      sub: 'Uang Dingin (Simpanan)',
      balance: saldoBiru,
      dotBg: 'bg-blue-500',
      activeBg: 'bg-blue-600',
      activeRing: 'ring-blue-500/30',
    },
    MERAH: {
      name: 'Dompet Merah',
      shortName: 'D. Merah',
      sub: 'Dana Siaga (Ready)',
      balance: saldoMerah,
      dotBg: 'bg-rose-500',
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

  // 3 Primary shortcut routes neatly fitted in a 3-column grid without overflow
  const mainPresets: {
    from: WalletId;
    to: WalletId;
    title: string;
    desc: string;
    fromDot: string;
    toDot: string;
  }[] = [
    {
      from: 'UMUM',
      to: 'MERAH',
      title: 'Umum ➔ Merah',
      desc: 'Ke Siaga',
      fromDot: 'bg-emerald-500',
      toDot: 'bg-rose-500',
    },
    {
      from: 'UMUM',
      to: 'BIRU',
      title: 'Umum ➔ Biru',
      desc: 'Ke Dingin',
      fromDot: 'bg-emerald-500',
      toDot: 'bg-blue-500',
    },
    {
      from: 'MERAH',
      to: 'UMUM',
      title: 'Merah ➔ Umum',
      desc: 'Ke Harian',
      fromDot: 'bg-rose-500',
      toDot: 'bg-emerald-500',
    },
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
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-serif text-xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          Pindah Dana Antar Dompet
        </h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-5 pt-3 pb-8 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Quick Route Shortcuts (3-column grid, no overflow cutoff) */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#767A73] dark:text-[#8E948B] uppercase mb-2">
              Alur Cepat Antar Dompet
            </label>
            <div className="grid grid-cols-3 gap-2">
              {mainPresets.map((preset) => {
                const isActive = fromWallet === preset.from && toWallet === preset.to;
                return (
                  <button
                    key={`${preset.from}-${preset.to}`}
                    type="button"
                    onClick={() => selectRoute(preset.from, preset.to)}
                    className={`py-2 px-1.5 rounded-2xl border text-center transition-all ${
                      isActive
                        ? 'bg-[#1B3B2B] text-white border-[#1B3B2B] shadow-sm'
                        : 'bg-white dark:bg-[#1C221E] text-[#1C201D] dark:text-[#E8F0EA] border-[#DDD9CD] dark:border-white/10 hover:bg-[#F2EFE6]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                      <span className={`w-2 h-2 rounded-full ${preset.fromDot} flex-shrink-0`} />
                      <ArrowRight size={10} className={isActive ? 'text-white/70' : 'text-[#767A73]'} />
                      <span className={`w-2 h-2 rounded-full ${preset.toDot} flex-shrink-0`} />
                    </div>
                    <p className={`text-[10px] font-medium mt-1 truncate ${isActive ? 'text-white/80' : 'text-[#767A73] dark:text-[#8E948B]'}`}>
                      {preset.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean Interactive Transfer Box */}
          <div className="bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-white/10 rounded-3xl p-4 shadow-sm space-y-3.5">
            {/* Dari (Source) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#767A73] dark:text-[#8E948B]">
                  DARI DOMPET (SUMBER)
                </span>
                <span className="text-xs font-bold text-[#1C201D] dark:text-[#E8F0EA]">
                  Saldo: {formatRupiah(fromInfo.balance)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['UMUM', 'BIRU', 'MERAH'] as WalletId[]).map((w) => {
                  const info = walletInfo[w];
                  const isSelected = fromWallet === w;
                  return (
                    <button
                      key={`from-${w}`}
                      type="button"
                      onClick={() => handleSelectFrom(w)}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? `${info.activeBg} text-white shadow-sm ring-2 ${info.activeRing} scale-[1.02]`
                          : 'bg-[#F2EFE9] dark:bg-[#252E27] text-[#565A53] dark:text-[#A0A69D] hover:bg-[#EAE6DE]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${info.dotBg} flex-shrink-0 ${isSelected ? 'ring-2 ring-white/50' : ''}`} />
                      <span className="truncate">{info.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center Swap Divider */}
            <div className="relative py-1 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E7E5D9] dark:border-white/10" />
              </div>
              <button
                type="button"
                onClick={handleSwap}
                className="relative z-10 px-3.5 py-1.5 rounded-full bg-[#F2EFE9] dark:bg-[#252E27] hover:bg-[#EAE6DE] dark:hover:bg-[#2F3A32] text-[#1C201D] dark:text-[#E8F0EA] border border-[#DDD9CD] dark:border-white/10 text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                title="Tukar arah pemindahan"
              >
                <ArrowLeftRight size={13} className="text-[#1B3B2B] dark:text-[#8EE0B0]" />
                <span>Tukar Arah</span>
              </button>
            </div>

            {/* Ke (Destination) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#767A73] dark:text-[#8E948B]">
                  KE DOMPET (TUJUAN)
                </span>
                <span className="text-xs font-bold text-[#1C201D] dark:text-[#E8F0EA]">
                  Saldo: {formatRupiah(toInfo.balance)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['UMUM', 'BIRU', 'MERAH'] as WalletId[]).map((w) => {
                  const info = walletInfo[w];
                  const isSelected = toWallet === w;
                  return (
                    <button
                      key={`to-${w}`}
                      type="button"
                      onClick={() => handleSelectTo(w)}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? `${info.activeBg} text-white shadow-sm ring-2 ${info.activeRing} scale-[1.02]`
                          : 'bg-[#F2EFE9] dark:bg-[#252E27] text-[#565A53] dark:text-[#A0A69D] hover:bg-[#EAE6DE]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${info.dotBg} flex-shrink-0 ${isSelected ? 'ring-2 ring-white/50' : ''}`} />
                      <span className="truncate">{info.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Nominal Transfer Hero Card */}
          <div className="text-center py-4 bg-white dark:bg-[#1C221E] rounded-3xl border border-[#DDD9CD] dark:border-white/10 p-4 shadow-sm">
            <p className="text-[11px] font-bold tracking-widest text-[#767A73] dark:text-[#8E948B] uppercase mb-1">
              NOMINAL TRANSFER
            </p>
            <div className="relative inline-flex items-center justify-center max-w-full">
              <span className="font-display text-3xl sm:text-4xl font-extrabold mr-1 text-[#1B3B2B] dark:text-[#8EE0B0]">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={numericAmount > 0 ? numericAmount.toLocaleString('id-ID') : ''}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-48 sm:w-56 font-display text-3xl sm:text-4xl font-extrabold bg-transparent outline-none border-b-2 border-transparent focus:border-[#1B3B2B] dark:focus:border-[#8EE0B0] text-left text-[#1B3B2B] dark:text-[#8EE0B0]"
                autoFocus
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-3 mt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmountInput(q.toString())}
                  className="px-2.5 py-1 rounded-full bg-[#F2EFE9] dark:bg-[#252E27] hover:bg-[#EAE6DE] border border-[#DDD9CD] dark:border-white/10 text-[11px] font-semibold text-[#565A53] dark:text-[#D1D7CE] active:scale-95 transition-all"
                >
                  +{q >= 1000000 ? `${q / 1000000}jt` : `${q / 1000}rb`}
                </button>
              ))}
              {fromInfo.balance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmountInput(fromInfo.balance.toString())}
                  className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 active:scale-95 transition-all"
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
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-white/10 rounded-2xl px-4 py-3 text-xs text-[#1C201D] dark:text-[#E8F0EA] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
            />
          </div>

          {/* Live Balance Impact Preview */}
          {numericAmount > 0 && (
            <div className="bg-[#EAF3ED] dark:bg-[#162D20] border border-[#C5E1CF] dark:border-[#254C38] rounded-2xl p-3.5 space-y-2 text-xs">
              <p className="font-bold text-[#1B3B2B] dark:text-[#8EE0B0]">
                Perkiraan Saldo Setelah Pemindahan:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div className="bg-white/70 dark:bg-black/20 p-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#767A73] dark:text-[#8E948B] mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${fromInfo.dotBg} flex-shrink-0`} />
                    <span className="font-medium truncate">{fromInfo.name}</span>
                  </div>
                  <p className="font-serif font-bold text-sm text-[#A73C2C] dark:text-[#F6B3A9]">
                    {formatRupiah(Math.max(0, fromInfo.balance - numericAmount))}
                  </p>
                  <p className="text-[10px] text-red-600 dark:text-red-400">
                    −{formatRupiah(numericAmount)}
                  </p>
                </div>

                <div className="bg-white/70 dark:bg-black/20 p-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#767A73] dark:text-[#8E948B] mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${toInfo.dotBg} flex-shrink-0`} />
                    <span className="font-medium truncate">{toInfo.name}</span>
                  </div>
                  <p className="font-serif font-bold text-sm text-[#1B3B2B] dark:text-[#8EE0B0]">
                    {formatRupiah(toInfo.balance + numericAmount)}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    +{formatRupiah(numericAmount)}
                  </p>
                </div>
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
