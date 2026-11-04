import React, { useState, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, RefreshCw, Edit3 } from 'lucide-react';
import { InvestmentAsset, InvestmentCategory } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { formatRupiah } from '../../utils/format';
import { QuickUpdateValueModal } from './QuickUpdateValueModal';

interface InvestmentScreenProps {
  onOpenCreateAsset: () => void;
  onOpenEditAsset: (asset: InvestmentAsset) => void;
}

export const InvestmentScreen: React.FC<InvestmentScreenProps> = ({
  onOpenCreateAsset,
  onOpenEditAsset,
}) => {
  const {
    investments,
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalReturnPercentage,
    goldTotalValue,
    cryptoTotalValue,
    updateInvestmentValue,
  } = useWallet();

  const [activeFilter, setActiveFilter] = useState<'ALL' | InvestmentCategory>('ALL');
  const [assetForQuickUpdate, setAssetForQuickUpdate] = useState<InvestmentAsset | null>(null);

  const filteredAssets = useMemo(() => {
    if (activeFilter === 'ALL') return investments;
    return investments.filter((a) => a.category === activeFilter);
  }, [investments, activeFilter]);

  const isPositiveOverall = totalProfitLoss >= 0;

  // Percentages for breakdown bar
  const goldPct = totalCurrentValue > 0 ? Math.round((goldTotalValue / totalCurrentValue) * 100) : 0;
  const cryptoPct = totalCurrentValue > 0 ? Math.round((cryptoTotalValue / totalCurrentValue) * 100) : 0;

  return (
    <div className="pb-28 pt-4 px-5 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[#767A73] dark:text-[#8E948B] font-medium">
            Portofolio Aset
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
            Investasi
          </h1>
        </div>

        <button
          onClick={onOpenCreateAsset}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#1B3B2B] hover:bg-[#254C38] active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus size={16} />
          <span>Tambah Aset</span>
        </button>
      </div>

      {/* Main Portfolio Summary Card */}
      <div className="w-full bg-[#1B3B2B] text-white rounded-3xl p-5 mb-5 shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <p className="text-[10px] font-bold tracking-widest text-[#B0C4B8] uppercase">
            TOTAL NILAI PORTOFOLIO
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1.5 mb-3 tracking-tight">
            {formatRupiah(totalCurrentValue)}
          </h2>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15 text-xs">
            <div>
              <p className="text-[#B0C4B8] mb-0.5">Total Modal Disetor</p>
              <p className="font-semibold text-white font-sans text-sm">
                {formatRupiah(totalInvested)}
              </p>
            </div>
            <div>
              <p className="text-[#B0C4B8] mb-0.5">Hasil (P&L)</p>
              <div className="flex items-center gap-1 font-semibold text-sm">
                {isPositiveOverall ? (
                  <TrendingUp size={14} className="text-[#8EE0B0]" />
                ) : (
                  <TrendingDown size={14} className="text-[#F6B3A9]" />
                )}
                <span className={isPositiveOverall ? 'text-[#8EE0B0]' : 'text-[#F6B3A9]'}>
                  {isPositiveOverall ? '+' : ''}
                  {formatRupiah(totalProfitLoss)} ({totalReturnPercentage >= 0 ? '+' : ''}
                  {totalReturnPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Asset Allocation Chips */}
          {totalCurrentValue > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#D0E2D7]">
              <span className="flex items-center gap-1">
                <span>🪙 Emas:</span>
                <strong className="text-white">{formatRupiah(goldTotalValue)}</strong>
                <span>({goldPct}%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span>⚡ Kripto:</span>
                <strong className="text-white">{formatRupiah(cryptoTotalValue)}</strong>
                <span>({cryptoPct}%)</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Chips: Semua | 🪙 Emas | ⚡ Kripto */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-4">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeFilter === 'ALL'
              ? 'bg-[#1B3B2B] text-white shadow-sm'
              : 'bg-white dark:bg-[#1C221E] text-[#6F736C] dark:text-[#8E948B] border border-[#DDD9CD] dark:border-[#2D3630]'
          }`}
        >
          Semua ({investments.length})
        </button>

        <button
          onClick={() => setActiveFilter('EMAS')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
            activeFilter === 'EMAS'
              ? 'bg-[#D4A054] text-[#1C201D] shadow-sm'
              : 'bg-white dark:bg-[#1C221E] text-[#6F736C] dark:text-[#8E948B] border border-[#DDD9CD] dark:border-[#2D3630]'
          }`}
        >
          <span>🪙</span>
          <span>Emas ({investments.filter((a) => a.category === 'EMAS').length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('KRIPTO')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
            activeFilter === 'KRIPTO'
              ? 'bg-[#1B3B2B] text-white shadow-sm'
              : 'bg-white dark:bg-[#1C221E] text-[#6F736C] dark:text-[#8E948B] border border-[#DDD9CD] dark:border-[#2D3630]'
          }`}
        >
          <span>⚡</span>
          <span>Kripto ({investments.filter((a) => a.category === 'KRIPTO').length})</span>
        </button>
      </div>

      {/* Assets List */}
      {filteredAssets.length === 0 ? (
        <div className="py-16 text-center text-[#767A73] dark:text-[#8E948B] bg-white/40 dark:bg-white/[0.02] rounded-3xl border border-[#DDD9CD]/60 dark:border-white/5 p-6">
          <div className="w-14 h-14 rounded-2xl bg-[#EDECE4] dark:bg-[#252E27] flex items-center justify-center text-2xl mx-auto mb-3">
            {activeFilter === 'EMAS' ? '🪙' : activeFilter === 'KRIPTO' ? '⚡' : '💼'}
          </div>
          <p className="font-semibold text-sm text-[#1C201D] dark:text-[#E8F0EA]">
            Belum ada aset {activeFilter === 'EMAS' ? 'emas' : activeFilter === 'KRIPTO' ? 'kripto' : 'investasi'}
          </p>
          <p className="text-xs mt-1 max-w-xs mx-auto leading-relaxed">
            Mulai catat modal dan nilai terkini untuk memantau keuntungan aset Anda secara offline
          </p>
          <button
            onClick={onOpenCreateAsset}
            className="mt-4 px-4 py-2.5 rounded-2xl bg-[#1B3B2B] text-white text-xs font-semibold shadow-sm"
          >
            + Tambah Aset Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAssets.map((asset) => {
            const pnl = asset.current_value - asset.invested_amount;
            const retPct = asset.invested_amount > 0 ? (pnl / asset.invested_amount) * 100 : 0;
            const isProfit = pnl >= 0;
            const isGold = asset.category === 'EMAS';

            return (
              <div
                key={asset.id}
                className="bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-3xl p-4 shadow-xs hover:border-[#1B3B2B]/30 transition-all"
              >
                {/* Header row: Icon, Name, Category badge, Edit */}
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{
                        backgroundColor: isGold ? '#F9F1E2' : '#EAF3ED',
                      }}
                    >
                      {isGold ? '🪙' : '⚡'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-[#1C201D] dark:text-[#E8F0EA]">
                        {asset.name}
                      </h4>
                      <p className="text-xs text-[#767A73] dark:text-[#8E948B]">
                        {isGold && asset.weight_grams ? `${asset.weight_grams} gram` : ''}
                        {asset.platform ? (isGold && asset.weight_grams ? ` · ${asset.platform}` : asset.platform) : ''}
                        {!asset.weight_grams && !asset.platform ? (isGold ? 'Emas' : 'Kripto') : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenEditAsset(asset)}
                    className="p-1.5 rounded-xl text-[#8E948B] hover:text-[#1C201D] dark:hover:text-white hover:bg-black/5"
                    title="Ubah detail aset"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>

                {/* Values row */}
                <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-black/[0.04] dark:border-white/[0.04] text-xs">
                  <div>
                    <span className="text-[#767A73] dark:text-[#8E948B] text-[11px] block">
                      Modal Beli
                    </span>
                    <span className="font-semibold text-[#1C201D] dark:text-[#E8F0EA]">
                      {formatRupiah(asset.invested_amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#767A73] dark:text-[#8E948B] text-[11px] block">
                      Nilai Saat Ini
                    </span>
                    <span className="font-bold text-[#1C201D] dark:text-[#E8F0EA] font-serif text-sm">
                      {formatRupiah(asset.current_value)}
                    </span>
                  </div>
                </div>

                {/* Bottom row: Return Badge + Quick Update Button */}
                <div className="flex items-center justify-between pt-2.5">
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isProfit
                        ? 'bg-[#EAF3ED] text-[#1B3B2B] dark:bg-[#162D20] dark:text-[#8EE0B0]'
                        : 'bg-[#FDF2F0] text-[#9E2A20] dark:bg-[#341C1A] dark:text-[#FFA49A]'
                    }`}
                  >
                    {isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>
                      {isProfit ? '+' : ''}
                      {formatRupiah(pnl)} ({retPct >= 0 ? '+' : ''}
                      {retPct.toFixed(1)}%)
                    </span>
                  </div>

                  <button
                    onClick={() => setAssetForQuickUpdate(asset)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDECE4] dark:bg-[#252E27] hover:bg-[#E3E1D5] text-[#1C201D] dark:text-[#E8F0EA] text-xs font-medium transition-colors"
                  >
                    <RefreshCw size={12} />
                    <span>Update Nilai</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Update Value Modal */}
      {assetForQuickUpdate && (
        <QuickUpdateValueModal
          asset={assetForQuickUpdate}
          onClose={() => setAssetForQuickUpdate(null)}
          onSave={(id, newVal) => updateInvestmentValue(id, newVal)}
        />
      )}
    </div>
  );
};

