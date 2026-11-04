import React, { useState } from 'react';
import { ArrowLeft, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { InvestmentAsset, InvestmentCategory } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { formatRupiah } from '../../utils/format';

interface InvestmentFormModalProps {
  editingAsset?: InvestmentAsset | null;
  onClose: () => void;
}

export const InvestmentFormModal: React.FC<InvestmentFormModalProps> = ({
  editingAsset = null,
  onClose,
}) => {
  const { addInvestment, updateInvestment, deleteInvestment } = useWallet();

  const [category, setCategory] = useState<InvestmentCategory>(
    editingAsset ? editingAsset.category : 'EMAS'
  );

  // Emas mode: 'GRAM' or 'DIRECT'
  const [goldInputMode, setGoldInputMode] = useState<'GRAM' | 'DIRECT'>(
    editingAsset?.weight_grams ? 'GRAM' : 'GRAM'
  );

  // Fields
  const [name, setName] = useState<string>(editingAsset ? editingAsset.name : '');
  const [grams, setGrams] = useState<string>(
    editingAsset?.weight_grams ? editingAsset.weight_grams.toString() : '10'
  );
  const [buyPricePerGram, setBuyPricePerGram] = useState<string>(
    editingAsset?.buy_price_per_gram ? editingAsset.buy_price_per_gram.toString() : '1250000'
  );
  const [curPricePerGram, setCurPricePerGram] = useState<string>(
    editingAsset?.current_price_per_gram ? editingAsset.current_price_per_gram.toString() : '1450000'
  );

  // Direct amounts for Kripto or direct Emas
  const [investedAmount, setInvestedAmount] = useState<string>(
    editingAsset ? editingAsset.invested_amount.toString() : '10000000'
  );
  const [currentValue, setCurrentValue] = useState<string>(
    editingAsset ? editingAsset.current_value.toString() : '13500000'
  );

  const [platform, setPlatform] = useState<string>(editingAsset?.platform || '');
  const [notes, setNotes] = useState<string>(editingAsset?.notes || '');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Calculate modal & current values dynamically
  const calculatedModal = React.useMemo(() => {
    if (category === 'EMAS' && goldInputMode === 'GRAM') {
      const g = parseFloat(grams) || 0;
      const bp = parseInt(buyPricePerGram.replace(/[^0-9]/g, '') || '0', 10);
      return Math.round(g * bp);
    }
    return parseInt(investedAmount.replace(/[^0-9]/g, '') || '0', 10);
  }, [category, goldInputMode, grams, buyPricePerGram, investedAmount]);

  const calculatedCurrent = React.useMemo(() => {
    if (category === 'EMAS' && goldInputMode === 'GRAM') {
      const g = parseFloat(grams) || 0;
      const cp = parseInt(curPricePerGram.replace(/[^0-9]/g, '') || '0', 10);
      return Math.round(g * cp);
    }
    return parseInt(currentValue.replace(/[^0-9]/g, '') || '0', 10);
  }, [category, goldInputMode, grams, curPricePerGram, currentValue]);

  const profitLoss = calculatedCurrent - calculatedModal;
  const returnPct = calculatedModal > 0 ? (profitLoss / calculatedModal) * 100 : 0;
  const isPositive = profitLoss >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalName = name.trim() || (category === 'EMAS' ? 'Emas Antam' : 'Aset Kripto');

    if (calculatedModal <= 0) {
      setErrorMsg('Modal investasi harus lebih dari 0');
      return;
    }

    if (editingAsset) {
      updateInvestment(editingAsset.id, {
        name: finalName,
        category,
        invested_amount: calculatedModal,
        current_value: calculatedCurrent,
        weight_grams: category === 'EMAS' && goldInputMode === 'GRAM' ? parseFloat(grams) || undefined : undefined,
        buy_price_per_gram: category === 'EMAS' && goldInputMode === 'GRAM' ? parseInt(buyPricePerGram.replace(/[^0-9]/g, '') || '0', 10) : undefined,
        current_price_per_gram: category === 'EMAS' && goldInputMode === 'GRAM' ? parseInt(curPricePerGram.replace(/[^0-9]/g, '') || '0', 10) : undefined,
        platform: platform.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addInvestment({
        name: finalName,
        category,
        invested_amount: calculatedModal,
        current_value: calculatedCurrent,
        weight_grams: category === 'EMAS' && goldInputMode === 'GRAM' ? parseFloat(grams) || undefined : undefined,
        buy_price_per_gram: category === 'EMAS' && goldInputMode === 'GRAM' ? parseInt(buyPricePerGram.replace(/[^0-9]/g, '') || '0', 10) : undefined,
        current_price_per_gram: category === 'EMAS' && goldInputMode === 'GRAM' ? parseInt(curPricePerGram.replace(/[^0-9]/g, '') || '0', 10) : undefined,
        platform: platform.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (editingAsset) {
      deleteInvestment(editingAsset.id);
      onClose();
    }
  };

  const cryptoShortcuts = ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Solana (SOL)', 'USDT', 'BNB'];
  const platformShortcuts = ['Indodax', 'Tokocrypto', 'Pintu', 'Binance', 'Hardware Wallet'];

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
          {editingAsset ? 'Ubah Aset' : 'Tambah Aset Investasi'}
        </h1>
        {editingAsset ? (
          <button
            type="button"
            onClick={handleDelete}
            className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-[#A73C2C] hover:bg-[#A73C2C]/10 transition-colors"
            title="Hapus aset"
          >
            <Trash2 size={20} />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-5 pt-3 pb-8 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Category Switcher: Emas vs Kripto */}
          <div className="grid grid-cols-2 gap-2 bg-[#E9E7DC] dark:bg-[#1C221E] p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setCategory('EMAS');
                if (!name || cryptoShortcuts.includes(name)) setName('Emas Antam Fisik');
              }}
              className={`py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                category === 'EMAS'
                  ? 'bg-[#D4A054] text-[#1C201D] shadow-sm'
                  : 'text-[#6F736C] dark:text-[#8E948B]'
              }`}
            >
              <span>🪙</span>
              <span>Emas</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCategory('KRIPTO');
                if (!name || name.includes('Emas')) setName('Bitcoin (BTC)');
              }}
              className={`py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                category === 'KRIPTO'
                  ? 'bg-[#1B3B2B] text-white shadow-sm'
                  : 'text-[#6F736C] dark:text-[#8E948B]'
              }`}
            >
              <span>⚡</span>
              <span>Kripto</span>
            </button>
          </div>

          {/* Asset Name */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Nama Aset
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={category === 'EMAS' ? 'Contoh: Emas Antam 10gr / Emas Pegadaian' : 'Contoh: Bitcoin (BTC)'}
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm font-semibold text-[#1C201D] dark:text-[#E8F0EA] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
            />
            {category === 'KRIPTO' && (
              <div className="flex gap-1.5 overflow-x-auto py-1 mt-1.5">
                {cryptoShortcuts.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setName(c)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] text-[11px] font-medium text-[#555A51] dark:text-[#D1D7CE] whitespace-nowrap"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* EMAS SPECIFIC INPUTS */}
          {category === 'EMAS' ? (
            <div className="space-y-4">
              {/* Gramasi vs Nominal Toggle */}
              <div className="flex items-center justify-between text-xs font-semibold text-[#767A73] dark:text-[#8E948B]">
                <span>Metode Pencatatan Emas:</span>
                <div className="flex gap-1 bg-[#E9E7DC] dark:bg-[#1C221E] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setGoldInputMode('GRAM')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      goldInputMode === 'GRAM' ? 'bg-[#1B3B2B] text-white' : 'text-[#767A73]'
                    }`}
                  >
                    Gramasi
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoldInputMode('DIRECT')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      goldInputMode === 'DIRECT' ? 'bg-[#1B3B2B] text-white' : 'text-[#767A73]'
                    }`}
                  >
                    Nominal Rupiah
                  </button>
                </div>
              </div>

              {goldInputMode === 'GRAM' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
                      Jumlah Berat (Gram)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={grams}
                      onChange={(e) => setGrams(e.target.value)}
                      placeholder="Contoh: 10"
                      className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm font-semibold text-[#1C201D] dark:text-[#E8F0EA] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
                        Harga Beli / Gram
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={parseInt(buyPricePerGram.replace(/[^0-9]/g, '') || '0', 10).toLocaleString('id-ID')}
                        onChange={(e) => setBuyPricePerGram(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-3 py-3 text-xs sm:text-sm font-semibold text-[#1C201D] dark:text-[#E8F0EA] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
                        Harga Pasar Kini / Gram
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={parseInt(curPricePerGram.replace(/[^0-9]/g, '') || '0', 10).toLocaleString('id-ID')}
                        onChange={(e) => setCurPricePerGram(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-3 py-3 text-xs sm:text-sm font-semibold text-[#1C201D] dark:text-[#E8F0EA] outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
                      Total Modal Beli Emas (Rp)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={parseInt(investedAmount.replace(/[^0-9]/g, '') || '0', 10).toLocaleString('id-ID')}
                      onChange={(e) => setInvestedAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm font-semibold text-[#1C201D] dark:text-[#E8F0EA] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
                      Nilai Emas Saat Ini (Rp)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={parseInt(currentValue.replace(/[^0-9]/g, '') || '0', 10).toLocaleString('id-ID')}
                      onChange={(e) => setCurrentValue(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm font-semibold text-[#1C201D] dark:text-[#E8F0EA] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* KRIPTO SPECIFIC INPUTS */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
                  Total Modal Pembelian (Rupiah)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={parseInt(investedAmount.replace(/[^0-9]/g, '') || '0', 10).toLocaleString('id-ID')}
                  onChange={(e) => setInvestedAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                  className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm font-semibold text-[#1C201D] dark:text-[#E8F0EA] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
                  Nilai Saldo Terkini di Aplikasi Exchange (Rupiah)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={parseInt(currentValue.replace(/[^0-9]/g, '') || '0', 10).toLocaleString('id-ID')}
                  onChange={(e) => setCurrentValue(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                  className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-3 text-sm font-semibold text-[#1C201D] dark:text-[#E8F0EA] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
                  Tempat Penyimpanan / Exchange (Opsional)
                </label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="Contoh: Indodax, Tokocrypto, Pintu, Binance"
                  className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-2.5 text-xs text-[#1C201D] dark:text-[#E8F0EA] outline-none"
                />
                <div className="flex gap-1.5 overflow-x-auto py-1 mt-1">
                  {platformShortcuts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] text-[10px] text-[#767A73] whitespace-nowrap"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Catatan */}
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Beli saat harga koreksi / Simpan di brankas"
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-4 py-2.5 text-xs text-[#1C201D] dark:text-[#E8F0EA] outline-none"
            />
          </div>

          {/* LIVE RETURN PREVIEW BOX */}
          <div
            className={`p-4 rounded-3xl border shadow-sm ${
              isPositive
                ? 'bg-[#EAF3ED] border-[#C5E1CF] text-[#1B3B2B] dark:bg-[#162D20] dark:text-[#8EE0B0]'
                : 'bg-[#FDF2F0] border-[#F8C8C2] text-[#9E2A20] dark:bg-[#341C1A] dark:text-[#FFA49A]'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold flex items-center gap-1.5">
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{isPositive ? 'Hasil Untung (Profit)' : 'Hasil Rugi (Loss)'}</span>
              </span>
              <span className="font-bold font-sans text-sm">
                {returnPct >= 0 ? '+' : ''}
                {returnPct.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/5 dark:border-white/5">
              <span>Modal: {formatRupiah(calculatedModal)}</span>
              <span className="font-bold">
                {isPositive ? '+' : ''}
                {formatRupiah(profitLoss)}
              </span>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-medium text-center">{errorMsg}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#254C38] text-white font-medium text-sm shadow-sm transition-all"
          >
            {editingAsset ? 'Simpan Perubahan' : 'Simpan Aset Investasi'}
          </button>
        </div>
      </form>
    </div>
  );
};

