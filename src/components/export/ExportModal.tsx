import React, { useState, useMemo } from 'react';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { TimePeriod, ExportFormat } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { formatDateForInput, formatTransactionAmount } from '../../utils/format';
import { exportToExcel, exportToCSV } from '../../utils/export';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const { transactions, categoriesMap } = useWallet();

  const [period, setPeriod] = useState<TimePeriod>('bulanan');
  const [format, setFormat] = useState<ExportFormat>('xlsx');
  const [includeSummary, setIncludeSummary] = useState<boolean>(true);

  // Default date ranges based on current date
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState<string>(formatDateForInput(firstDayOfMonth));
  const [endDate, setEndDate] = useState<string>(formatDateForInput(lastDayOfMonth));

  // Update dates when period selection changes
  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
    const today = new Date();

    if (newPeriod === 'harian') {
      const todayStr = formatDateForInput(today);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (newPeriod === 'mingguan') {
      const startOfWeek = new Date(today);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
      startOfWeek.setDate(diff);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      setStartDate(formatDateForInput(startOfWeek));
      setEndDate(formatDateForInput(endOfWeek));
    } else if (newPeriod === 'bulanan') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setStartDate(formatDateForInput(start));
      setEndDate(formatDateForInput(end));
    } else if (newPeriod === 'tahunan') {
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear(), 11, 31);
      setStartDate(formatDateForInput(start));
      setEndDate(formatDateForInput(end));
    }
  };

  // Filter transactions within selected range
  const filteredTransactions = useMemo(() => {
    const startTimestamp = new Date(`${startDate}T00:00:00`).getTime();
    const endTimestamp = new Date(`${endDate}T23:59:59`).getTime();

    return transactions.filter((tx) => {
      const txTime = new Date(tx.date).getTime();
      return txTime >= startTimestamp && txTime <= endTimestamp;
    });
  }, [transactions, startDate, endDate]);

  const handleExport = () => {
    const filename = `Rekap_DompetKu_${startDate}_sd_${endDate}`;
    if (format === 'xlsx') {
      exportToExcel(filteredTransactions, categoriesMap, filename, includeSummary);
    } else {
      exportToCSV(filteredTransactions, categoriesMap, filename, includeSummary);
    }
  };

  // Preview rows (first 4 items)
  const previewList = filteredTransactions.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F5EE] dark:bg-[#121614] overflow-y-auto max-w-md mx-auto flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-[#F6F5EE]/90 dark:bg-[#121614]/90 backdrop-blur-sm z-10 border-b border-[#E3E1D5]/40 dark:border-white/5">
        <button
          onClick={onClose}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1C201D] dark:text-[#E8F0EA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-serif text-xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          Ekspor rekap
        </h1>
        <div className="w-8" />
      </header>

      <div className="flex-1 px-5 pt-3 pb-28 flex flex-col space-y-6">
        {/* Periode Selector (Page 7) */}
        <div>
          <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-2">
            Periode
          </label>
          <div className="flex flex-wrap gap-2">
            {(['harian', 'mingguan', 'bulanan', 'tahunan', 'kustom'] as TimePeriod[]).map((p) => {
              const isSelected = period === p;
              const label = p.charAt(0).toUpperCase() + p.slice(1);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePeriodChange(p)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#D4A054] text-[#1C201D] shadow-sm'
                      : 'bg-white dark:bg-[#1C221E] text-[#6F736C] dark:text-[#8E948B] border border-[#DDD9CD] dark:border-[#2D3630]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Dari
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPeriod('kustom');
              }}
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-[#1C201D] dark:text-[#E8F0EA] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-1.5">
              Sampai
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPeriod('kustom');
              }}
              className="w-full bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-[#1C201D] dark:text-[#E8F0EA] outline-none"
            />
          </div>
        </div>

        {/* Format Selector (Page 7) */}
        <div>
          <label className="block text-xs font-semibold text-[#767A73] dark:text-[#8E948B] mb-2">
            Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Excel (.xlsx) */}
            <button
              type="button"
              onClick={() => setFormat('xlsx')}
              className={`p-4 rounded-2xl text-left border transition-all ${
                format === 'xlsx'
                  ? 'bg-[#1B3B2B] text-white border-[#1B3B2B] shadow-sm'
                  : 'bg-white dark:bg-[#1C221E] text-[#1C201D] dark:text-[#E8F0EA] border-[#DDD9CD] dark:border-[#2D3630]'
              }`}
            >
              <div className="font-semibold text-sm">Excel</div>
              <div
                className={`text-xs mt-0.5 ${
                  format === 'xlsx' ? 'text-[#B0C4B8]' : 'text-[#767A73]'
                }`}
              >
                .xlsx
              </div>
            </button>

            {/* CSV */}
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`p-4 rounded-2xl text-left border transition-all ${
                format === 'csv'
                  ? 'bg-[#1B3B2B] text-white border-[#1B3B2B] shadow-sm'
                  : 'bg-white dark:bg-[#1C221E] text-[#1C201D] dark:text-[#E8F0EA] border-[#DDD9CD] dark:border-[#2D3630]'
              }`}
            >
              <div className="font-semibold text-sm">CSV</div>
              <div
                className={`text-xs mt-0.5 ${
                  format === 'csv' ? 'text-[#B0C4B8]' : 'text-[#767A73]'
                }`}
              >
                Untuk Google Sheets
              </div>
            </button>
          </div>
        </div>

        {/* Include Summary Toggle (Page 7) */}
        <div className="bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-xs sm:text-sm text-[#1C201D] dark:text-[#E8F0EA]">
              Sertakan ringkasan total
            </p>
            <p className="text-[11px] text-[#767A73] dark:text-[#8E948B] mt-0.5">
              Pendapatan, pengeluaran, selisih
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIncludeSummary(!includeSummary)}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 flex items-center ${
              includeSummary ? 'bg-[#2E7D52]' : 'bg-[#D1CFBF] dark:bg-[#343F37]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                includeSummary ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Pratinjau isi file (Page 7) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#767A73] dark:text-[#8E948B]">
              Pratinjau isi file ({filteredTransactions.length} baris)
            </label>
          </div>

          <div className="bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 bg-[#EDECE4] dark:bg-[#252E27] px-4 py-2 text-[11px] font-bold text-[#555A51] dark:text-[#B0C4B8]">
              <span className="col-span-4">Tanggal</span>
              <span className="col-span-4">Kategori</span>
              <span className="col-span-4 text-right">Nominal</span>
            </div>

            {previewList.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#767A73]">
                Tidak ada data transaksi pada rentang ini
              </div>
            ) : (
              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {previewList.map((tx) => {
                  const cat = categoriesMap.get(tx.category_id);
                  const d = new Date(tx.date);
                  const dateStr = `${d.getDate()} ${new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(d)}`;

                  return (
                    <div
                      key={tx.id}
                      className="grid grid-cols-12 px-4 py-2.5 text-xs text-[#1C201D] dark:text-[#E8F0EA]"
                    >
                      <span className="col-span-4 text-[#767A73] dark:text-[#9BA098]">
                        {dateStr}
                      </span>
                      <span className="col-span-4 font-medium truncate pr-2">
                        {cat?.name || 'Lainnya'}
                      </span>
                      <span
                        className={`col-span-4 text-right font-medium ${
                          tx.type === 'INCOME' ? 'text-[#25724A]' : 'text-[#1C201D] dark:text-[#E8F0EA]'
                        }`}
                      >
                        {formatTransactionAmount(tx.amount, tx.type)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-gradient-to-t from-[#F6F5EE] via-[#F6F5EE] to-transparent dark:from-[#121614] dark:via-[#121614]">
        <button
          onClick={handleExport}
          disabled={filteredTransactions.length === 0}
          className="w-full py-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#244C38] disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <FileSpreadsheet size={18} />
          <span>Ekspor & bagikan</span>
        </button>
      </div>
    </div>
  );
};
