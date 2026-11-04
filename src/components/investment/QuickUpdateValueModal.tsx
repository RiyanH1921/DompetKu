import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { InvestmentAsset } from '../../types';
import { formatRupiah } from '../../utils/format';

interface QuickUpdateValueModalProps {
  asset: InvestmentAsset;
  onClose: () => void;
  onSave: (id: string, newValue: number) => void;
}

export const QuickUpdateValueModal: React.FC<QuickUpdateValueModalProps> = ({
  asset,
  onClose,
  onSave,
}) => {
  const [valInput, setValInput] = useState<string>(asset.current_value.toString());

  const numericValue = parseInt(valInput.replace(/[^0-9]/g, '') || '0', 10);
  const profitLoss = numericValue - asset.invested_amount;
  const returnPct = asset.invested_amount > 0 ? (profitLoss / asset.invested_amount) * 100 : 0;
  const isPositive = profitLoss >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(asset.id, numericValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1C221E] rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#767A73] dark:text-[#8E948B]">
              Update Nilai Terkini
            </span>
            <h3 className="font-serif font-bold text-lg text-[#1C201D] dark:text-[#E8F0EA]">
              {asset.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#767A73] hover:text-[#1C201D] dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-2xl bg-[#F6F5EE] dark:bg-[#121614] flex justify-between text-xs">
            <span className="text-[#767A73] dark:text-[#8E948B]">Modal Awal:</span>
            <span className="font-semibold text-[#1C201D] dark:text-[#E8F0EA]">
              {formatRupiah(asset.invested_amount)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Nilai Saldo Terkini Saat Ini
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-bold text-[#767A73]">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={numericValue > 0 ? numericValue.toLocaleString('id-ID') : ''}
                onChange={(e) => setValInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
                className="w-full bg-[#F6F5EE] dark:bg-[#121614] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl pl-10 pr-4 py-3 text-base font-bold font-serif text-[#1C201D] dark:text-[#E8F0EA] outline-none focus:ring-2 focus:ring-[#1B3B2B]/20"
                autoFocus
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div
            className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
              isPositive
                ? 'bg-[#EAF3ED] border-[#C5E1CF] text-[#1B3B2B] dark:bg-[#172D20] dark:text-[#8EE0B0]'
                : 'bg-[#FDF2F0] border-[#F8C8C2] text-[#9E2A20] dark:bg-[#341C1A] dark:text-[#FFA49A]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-medium">
                {isPositive ? 'Keuntungan' : 'Kerugian'}:
              </span>
            </div>
            <span className="font-bold font-sans">
              {isPositive ? '+' : ''}
              {formatRupiah(profitLoss)} ({returnPct >= 0 ? '+' : ''}
              {returnPct.toFixed(1)}%)
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#DDD9CD] dark:border-[#2D3630] text-xs font-semibold text-[#555A51] dark:text-[#D1D7CE]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#1B3B2B] hover:bg-[#254C38] text-white text-xs font-semibold shadow-sm transition-all"
            >
              Simpan Nilai Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

