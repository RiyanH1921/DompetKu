import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TransactionType, TimePeriod, Category } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { formatRupiah } from '../../utils/format';

interface ChartScreenProps {
  onOpenExport: () => void;
}

export const ChartScreen: React.FC<ChartScreenProps> = ({ onOpenExport }) => {
  const { transactions, categoriesMap } = useWallet();

  const [activeType, setActiveType] = useState<TransactionType>('INCOME');
  const [period, setPeriod] = useState<TimePeriod>('bulanan');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Filter transactions by active type (INCOME or EXPENSE)
  const filteredTxs = useMemo(() => {
    return transactions.filter((tx) => tx.type === activeType);
  }, [transactions, activeType]);

  // Total amount for the selected period
  const { chartData, totalAmount, periodLabel } = useMemo(() => {
    const currentYear = new Date().getFullYear();

    if (period === 'bulanan') {
      // 12 Months: J, F, M, A, M, J, J, A, S, O, N, D
      const monthNamesShort = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
      const monthTotals = Array(12).fill(0);

      filteredTxs.forEach((tx) => {
        const d = new Date(tx.date);
        if (d.getFullYear() === currentYear) {
          monthTotals[d.getMonth()] += tx.amount;
        }
      });

      const currentMonthIndex = new Date().getMonth();

      const data = monthTotals.map((val, idx) => ({
        label: monthNamesShort[idx],
        fullName: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(currentYear, idx, 1)),
        amount: val,
        isCurrent: idx === currentMonthIndex,
      }));

      const sum = monthTotals.reduce((a, b) => a + b, 0);
      return {
        chartData: data,
        totalAmount: sum,
        periodLabel: `tahun ${currentYear}`,
      };
    }

    if (period === 'harian') {
      // 7 Days
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const daysData = [];
      const now = new Date();
      let sum = 0;

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayString = d.toISOString().substring(0, 10);

        const dayTotal = filteredTxs
          .filter((tx) => tx.date.substring(0, 10) === dayString)
          .reduce((acc, tx) => acc + tx.amount, 0);

        sum += dayTotal;
        daysData.push({
          label: dayNames[d.getDay()],
          fullName: new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }).format(d),
          amount: dayTotal,
          isCurrent: i === 0,
        });
      }

      return {
        chartData: daysData,
        totalAmount: sum,
        periodLabel: '7 hari terakhir',
      };
    }

    if (period === 'mingguan') {
      // Weeks in current month (M1, M2, M3, M4, M5)
      const now = new Date();
      const currentMonth = now.getMonth();
      const weeks = [
        { label: 'M1', name: 'Minggu 1 (Tgl 1-7)', amount: 0 },
        { label: 'M2', name: 'Minggu 2 (Tgl 8-14)', amount: 0 },
        { label: 'M3', name: 'Minggu 3 (Tgl 15-21)', amount: 0 },
        { label: 'M4', name: 'Minggu 4 (Tgl 22-28)', amount: 0 },
        { label: 'M5', name: 'Minggu 5 (Tgl 29+)', amount: 0 },
      ];

      filteredTxs.forEach((tx) => {
        const d = new Date(tx.date);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          const day = d.getDate();
          if (day <= 7) weeks[0].amount += tx.amount;
          else if (day <= 14) weeks[1].amount += tx.amount;
          else if (day <= 21) weeks[2].amount += tx.amount;
          else if (day <= 28) weeks[3].amount += tx.amount;
          else weeks[4].amount += tx.amount;
        }
      });

      const currentDay = now.getDate();
      const currentWeekIndex = Math.min(4, Math.floor((currentDay - 1) / 7));

      const data = weeks.map((w, idx) => ({
        label: w.label,
        fullName: w.name,
        amount: w.amount,
        isCurrent: idx === currentWeekIndex,
      }));

      const sum = data.reduce((acc, cur) => acc + cur.amount, 0);
      return {
        chartData: data,
        totalAmount: sum,
        periodLabel: `bulan ${new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(now)}`,
      };
    }

    // Tahunan (Last 4 years)
    const yearsData = [];
    let sum = 0;
    for (let i = 3; i >= 0; i--) {
      const year = currentYear - i;
      const yearTotal = filteredTxs
        .filter((tx) => new Date(tx.date).getFullYear() === year)
        .reduce((acc, tx) => acc + tx.amount, 0);

      sum += yearTotal;
      yearsData.push({
        label: String(year),
        fullName: `Tahun ${year}`,
        amount: yearTotal,
        isCurrent: i === 0,
      });
    }

    return {
      chartData: yearsData,
      totalAmount: sum,
      periodLabel: '4 tahun terakhir',
    };
  }, [period, filteredTxs]);

  // Category breakdown list
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { category: Category; amount: number }>();

    filteredTxs.forEach((tx) => {
      const cat = categoriesMap.get(tx.category_id);
      if (!cat) return;

      const current = map.get(cat.id) || { category: cat, amount: 0 };
      current.amount += tx.amount;
      map.set(cat.id, current);
    });

    const list = Array.from(map.values()).sort((a, b) => b.amount - a.amount);
    const maxAmount = list.length > 0 ? list[0].amount : 1;

    return list.map((item) => ({
      ...item,
      percentage: totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0,
      barWidthPercentage: maxAmount > 0 ? Math.round((item.amount / maxAmount) * 100) : 0,
    }));
  }, [filteredTxs, categoriesMap, totalAmount]);

  const barColor = activeType === 'INCOME' ? '#86C5A2' : '#E6A49B';
  const barActiveColor = activeType === 'INCOME' ? '#1B3B2B' : '#A73C2C';

  return (
    <div className="pb-24 pt-4 px-5 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-serif text-3xl font-bold text-[#1C201D] dark:text-[#E8F0EA]">
          Grafik
        </h1>
        <button
          onClick={onOpenExport}
          className="px-4 py-2 rounded-full bg-[#1B3B2B] hover:bg-[#254C38] text-white text-xs font-semibold shadow-sm transition-all"
        >
          Ekspor Excel
        </button>
      </div>

      {/* Income vs Expense Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-[#E9E7DC] dark:bg-[#1C221E] p-1.5 rounded-2xl mb-4">
        <button
          onClick={() => setActiveType('INCOME')}
          className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeType === 'INCOME'
              ? 'bg-[#1B3B2B] text-white shadow-sm'
              : 'text-[#6F736C] dark:text-[#8E948B]'
          }`}
        >
          Pendapatan
        </button>
        <button
          onClick={() => setActiveType('EXPENSE')}
          className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeType === 'EXPENSE'
              ? 'bg-[#A73C2C] text-white shadow-sm'
              : 'text-[#6F736C] dark:text-[#8E948B]'
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Time Period Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-5">
        {(['harian', 'mingguan', 'bulanan', 'tahunan'] as TimePeriod[]).map((p) => {
          const isSelected = period === p;
          const label = p.charAt(0).toUpperCase() + p.slice(1);
          return (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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

      {/* Total Card */}
      <div className="mb-4">
        <p className="text-xs text-[#767A73] dark:text-[#8E948B]">
          Total {activeType === 'INCOME' ? 'pendapatan' : 'pengeluaran'} {periodLabel}
        </p>
        <h2
          className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${
            activeType === 'INCOME'
              ? 'text-[#1B3B2B] dark:text-[#52C485]'
              : 'text-[#A73C2C] dark:text-[#F6B3A9]'
          }`}
        >
          {formatRupiah(totalAmount)}
        </h2>
      </div>

      {/* Interactive Bar Chart (Recharts) */}
      <div className="bg-white/40 dark:bg-white/[0.02] rounded-3xl p-3 border border-[#E7E5D9] dark:border-white/5 mb-6">
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 6, left: 6, bottom: 0 }}
              onMouseMove={(state) => {
                if (state.isTooltipActive) {
                  setHoveredBarIndex(state.activeTooltipIndex ?? null);
                }
              }}
              onMouseLeave={() => setHoveredBarIndex(null)}
            >
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#767A73' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-[#1C201D] text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-white/10 pointer-events-none">
                        <p className="font-medium text-[#B0C4B8]">{item.fullName}</p>
                        <p className="font-serif font-bold text-sm text-white mt-0.5">
                          {formatRupiah(item.amount)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" radius={[6, 6, 2, 2]}>
                {chartData.map((entry, index) => {
                  const isHovered = hoveredBarIndex === index;
                  const isCur = entry.isCurrent;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isHovered || isCur ? barActiveColor : barColor}
                      className="transition-colors duration-200 cursor-pointer"
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-center text-[#8E948B] mt-1 font-medium">
          Sentuh atau arahkan ke batang untuk melihat nominal
        </p>
      </div>

      {/* Category Breakdown (Page 5 & 6) */}
      <div>
        <h3 className="font-serif text-lg font-bold text-[#1C201D] dark:text-[#E8F0EA] mb-3">
          {activeType === 'INCOME' ? 'Sumber pendapatan' : 'Pengeluaran per kategori'}
        </h3>

        {categoryBreakdown.length === 0 ? (
          <p className="text-xs text-[#767A73] py-4 text-center">
            Belum ada data pada periode ini
          </p>
        ) : (
          <div className="space-y-4">
            {categoryBreakdown.map((item) => (
              <div key={item.category.id}>
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-1.5">
                  <span className="text-[#1C201D] dark:text-[#E8F0EA]">
                    {item.category.name}
                  </span>
                  <span className="font-sans text-[#1C201D] dark:text-[#E8F0EA]">
                    {formatRupiah(item.amount)}
                  </span>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#E5E3D8] dark:bg-[#252E27] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.barWidthPercentage}%`,
                      backgroundColor:
                        activeType === 'INCOME' ? '#1B3B2B' : '#A73C2C',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

