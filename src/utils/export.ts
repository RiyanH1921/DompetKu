import * as XLSX from 'xlsx';
import { Transaction, Category } from '../types';
import { formatIndonesianDate } from './format';

export interface ExportDataRow {
  Tanggal: string;
  Tipe: string;
  Kategori: string;
  Nominal: number | string;
  Catatan: string;
}

export function generateExportData(
  transactions: Transaction[],
  categoriesMap: Map<string, Category>,
  includeSummary: boolean = true
): {
  rows: ExportDataRow[];
  totalIncome: number;
  totalExpense: number;
  netDiff: number;
} {
  let totalIncome = 0;
  let totalExpense = 0;

  const rows: ExportDataRow[] = transactions.map((tx) => {
    const category = categoriesMap.get(tx.category_id);
    const catName = category ? category.name : 'Lainnya';
    const typeLabel = tx.type === 'INCOME' ? 'Pendapatan' : 'Pengeluaran';

    if (tx.type === 'INCOME') {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
    }

    return {
      Tanggal: formatIndonesianDate(tx.date),
      Tipe: typeLabel,
      Kategori: catName,
      Nominal: tx.type === 'INCOME' ? tx.amount : -tx.amount,
      Catatan: tx.note || '-',
    };
  });

  const netDiff = totalIncome - totalExpense;

  if (includeSummary) {
    // Add empty separator row
    rows.push({
      Tanggal: '',
      Tipe: '',
      Kategori: '',
      Nominal: '',
      Catatan: '',
    });
    // Add summary rows
    rows.push({
      Tanggal: 'RINGKASAN TOTAL',
      Tipe: 'Total Pendapatan',
      Kategori: '',
      Nominal: totalIncome,
      Catatan: '',
    });
    rows.push({
      Tanggal: 'RINGKASAN TOTAL',
      Tipe: 'Total Pengeluaran',
      Kategori: '',
      Nominal: -totalExpense,
      Catatan: '',
    });
    rows.push({
      Tanggal: 'RINGKASAN TOTAL',
      Tipe: 'Selisih (Bersih)',
      Kategori: '',
      Nominal: netDiff,
      Catatan: '',
    });
  }

  return { rows, totalIncome, totalExpense, netDiff };
}

/**
 * Export to Excel (.xlsx) file
 */
export function exportToExcel(
  transactions: Transaction[],
  categoriesMap: Map<string, Category>,
  filename: string = 'Rekap_DompetKu',
  includeSummary: boolean = true
): void {
  const { rows } = generateExportData(transactions, categoriesMap, includeSummary);

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 22 }, // Tanggal
    { wch: 18 }, // Tipe
    { wch: 20 }, // Kategori
    { wch: 16 }, // Nominal
    { wch: 30 }, // Catatan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Keuangan');

  // Trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export to CSV file
 */
export function exportToCSV(
  transactions: Transaction[],
  categoriesMap: Map<string, Category>,
  filename: string = 'Rekap_DompetKu',
  includeSummary: boolean = true
): void {
  const { rows } = generateExportData(transactions, categoriesMap, includeSummary);

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);

  // Add BOM for Indonesian / UTF-8 characters support in Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
