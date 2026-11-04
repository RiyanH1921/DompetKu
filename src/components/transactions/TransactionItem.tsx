import React from 'react';
import { Transaction, Category } from '../../types';
import {
  formatTransactionAmount,
  getCategoryInitial,
  getRelativeDateText,
  formatTime,
} from '../../utils/format';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  showTimeInsteadOfRelativeDate?: boolean;
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  category,
  showTimeInsteadOfRelativeDate = false,
  onClick,
}) => {
  const catName = category?.name || 'Lainnya';
  const initial = getCategoryInitial(catName);
  const color = category?.color || '#6F736C';

  const dateSubtext = showTimeInsteadOfRelativeDate
    ? formatTime(transaction.date)
    : getRelativeDateText(transaction.date);

  const isIncome = transaction.type === 'INCOME';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex items-center justify-between py-3.5 px-3 -mx-3 rounded-2xl transition-colors duration-150 ${
        onClick
          ? 'cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.04] active:bg-black/[0.06]'
          : ''
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Category Initial Avatar */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm"
          style={{
            backgroundColor: `${color}18`, // 10% opacity tint
            color: color,
          }}
        >
          {initial}
        </div>

        {/* Title and Category info */}
        <div className="min-w-0">
          <p className="font-semibold text-sm sm:text-base text-[#1C201D] dark:text-[#E8F0EA] truncate">
            {transaction.note || catName}
          </p>
          <p className="text-xs text-[#767A73] dark:text-[#8E948B] mt-0.5 truncate">
            {catName} · {dateSubtext}
          </p>
        </div>
      </div>

      {/* Amount */}
      <div className="flex-shrink-0 ml-3 text-right">
        <span
          className={`font-semibold text-sm sm:text-base ${
            isIncome
              ? 'text-[#25724A] dark:text-[#52C485]'
              : 'text-[#1C201D] dark:text-[#E8F0EA]'
          }`}
        >
          {formatTransactionAmount(transaction.amount, transaction.type)}
        </span>
      </div>
    </div>
  );
};

