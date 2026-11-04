/**
 * Formats a number to Indonesian Rupiah currency format without decimals
 * Example: 12450000 -> "Rp 12.450.000"
 */
export function formatRupiah(amount: number): string {
  const integerAmount = Math.round(Math.abs(amount));
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(integerAmount);
  return `Rp ${formatted}`;
}

/**
 * Formats amount with signed prefix for transactions
 * Example: INCOME 6500000 -> "+Rp 6.500.000"
 * Example: EXPENSE 45000 -> "−Rp 45.000"
 */
export function formatTransactionAmount(amount: number, type: 'INCOME' | 'EXPENSE'): string {
  const sign = type === 'INCOME' ? '+' : '−';
  return `${sign}${formatRupiah(amount)}`;
}

/**
 * Get category initial (first uppercase character)
 */
export function getCategoryInitial(name: string): string {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
}

/**
 * Grouping label for dates: "HARI INI", "KEMARIN", "2 HARI LALU", etc.
 */
export function getDateGroupLabel(dateString: string): string {
  const targetDate = new Date(dateString);
  const today = new Date();

  // Reset hours to compare purely dates
  const tYear = targetDate.getFullYear();
  const tMonth = targetDate.getMonth();
  const tDay = targetDate.getDate();

  const cYear = today.getFullYear();
  const cMonth = today.getMonth();
  const cDay = today.getDate();

  const targetMidnight = new Date(tYear, tMonth, tDay).getTime();
  const todayMidnight = new Date(cYear, cMonth, cDay).getTime();

  const diffDays = Math.round((todayMidnight - targetMidnight) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'HARI INI';
  if (diffDays === 1) return 'KEMARIN';
  if (diffDays === 2) return '2 HARI LALU';
  if (diffDays > 2 && diffDays <= 7) return `${diffDays} HARI LALU`;

  // Format as date: "15 Oktober 2026"
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(targetDate).toUpperCase();
}

/**
 * Format relative date for transaction subtitle:
 * Example: "Hari ini", "Kemarin", "2 hari lalu"
 */
export function getRelativeDateText(dateString: string): string {
  const label = getDateGroupLabel(dateString);
  if (label === 'HARI INI') return 'Hari ini';
  if (label === 'KEMARIN') return 'Kemarin';
  if (label.endsWith('HARI LALU')) return label.toLowerCase();
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short'
  }).format(new Date(dateString));
}

/**
 * Format time like "07.30", "12.10"
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}.${minutes}`;
}

/**
 * Format full date in Indonesian: "4 November 2026"
 */
export function formatIndonesianDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d);
}

/**
 * Format date for input: "YYYY-MM-DD"
 */
export function formatDateForInput(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
