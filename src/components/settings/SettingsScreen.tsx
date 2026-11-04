import React, { useState, useRef } from 'react';
import { ChevronRight, Download, Upload, Check } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { formatRupiah } from '../../utils/format';

interface SettingsScreenProps {
  onOpenManageCategories: () => void;
  onOpenExport: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onOpenManageCategories,
  onOpenExport,
}) => {
  const {
    wallet,
    categories,
    settings,
    updateInitialBalance,
    updateSettings,
    resetData,
    restoreData,
  } = useWallet();

  const [isEditingBalance, setIsEditingBalance] = useState<boolean>(false);
  const [balanceInput, setBalanceInput] = useState<string>(wallet.initial_balance.toString());
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);
  const [backupStatus, setBackupStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category statistics: total and custom
  const totalCategories = categories.length;
  const customCategories = categories.filter((c) => !c.is_default).length;

  const handleSaveBalance = () => {
    const num = parseInt(balanceInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      updateInitialBalance(num);
    }
    setIsEditingBalance(false);
  };

  const handleDownloadBackup = () => {
    const backupJson = JSON.stringify(
      {
        version: '1.0',
        exported_at: new Date().toISOString(),
        wallet,
        categories,
        settings,
      },
      null,
      2
    );

    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DompetKu_Backup_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setBackupStatus('Backup data berhasil diunduh.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = restoreData(content);
      if (success) {
        setBackupStatus('Data berhasil dipulihkan dari file backup!');
      } else {
        setBackupStatus('Format file backup tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pb-28 pt-4 px-5 max-w-md mx-auto">
      {/* Title */}
      <h1 className="font-serif text-3xl font-bold text-[#1C201D] dark:text-[#E8F0EA] mb-4">
        Pengaturan
      </h1>

      {/* Profile Card (Page 9) */}
      <div className="w-full bg-[#1B3B2B] text-white rounded-3xl p-5 mb-6 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#D4A054] text-[#1C201D] font-serif font-bold text-xl flex items-center justify-center flex-shrink-0">
          A
        </div>
        <div>
          <h3 className="font-semibold text-base sm:text-lg text-white">
            {settings.userName}
          </h3>
          <p className="text-xs text-[#B0C4B8] mt-0.5">
            Data tersimpan di perangkat ini
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* DOMPET SECTION */}
        <div>
          <h4 className="text-[11px] font-bold tracking-wider text-[#767A73] dark:text-[#8E948B] uppercase mb-2">
            DOMPET
          </h4>
          <div className="bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl divide-y divide-black/[0.04] dark:divide-white/[0.04] overflow-hidden">
            {/* Saldo awal item */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-[#1C201D] dark:text-[#E8F0EA]">
                  Saldo awal
                </p>
                <p className="text-xs text-[#767A73] dark:text-[#8E948B] mt-0.5">
                  Dipakai untuk menghitung saldo
                </p>
              </div>

              {isEditingBalance ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={parseInt(balanceInput.replace(/[^0-9]/g, '') || '0', 10).toLocaleString('id-ID')}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    className="w-28 text-right font-serif font-bold text-sm bg-[#EDECE4] dark:bg-[#252E27] px-2 py-1 rounded-lg border border-[#DDD9CD] outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveBalance}
                    className="p-1.5 rounded-lg bg-[#1B3B2B] text-white"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingBalance(true)}
                  className="font-serif font-bold text-sm sm:text-base text-[#1C201D] dark:text-[#E8F0EA] hover:text-[#1B3B2B] transition-colors"
                >
                  {formatRupiah(wallet.initial_balance)}
                </button>
              )}
            </div>

            {/* Mata uang item */}
            <div className="p-4 flex items-center justify-between">
              <span className="font-semibold text-sm text-[#1C201D] dark:text-[#E8F0EA]">
                Mata uang
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#767A73] dark:text-[#8E948B]">
                {settings.currency}
              </span>
            </div>
          </div>
        </div>

        {/* DATA SECTION */}
        <div>
          <h4 className="text-[11px] font-bold tracking-wider text-[#767A73] dark:text-[#8E948B] uppercase mb-2">
            DATA
          </h4>
          <div className="bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl divide-y divide-black/[0.04] dark:divide-white/[0.04] overflow-hidden">
            {/* Kelola kategori */}
            <button
              onClick={onOpenManageCategories}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <p className="font-semibold text-sm text-[#1C201D] dark:text-[#E8F0EA]">
                  Kelola kategori
                </p>
                <p className="text-xs text-[#767A73] dark:text-[#8E948B] mt-0.5">
                  {totalCategories} kategori, {customCategories} buatanmu
                </p>
              </div>
              <ChevronRight size={18} className="text-[#8E948B]" />
            </button>

            {/* Ekspor rekap */}
            <button
              onClick={onOpenExport}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <p className="font-semibold text-sm text-[#1C201D] dark:text-[#E8F0EA]">
                  Ekspor rekap
                </p>
                <p className="text-xs text-[#767A73] dark:text-[#8E948B] mt-0.5">
                  Excel atau CSV
                </p>
              </div>
              <ChevronRight size={18} className="text-[#8E948B]" />
            </button>

            {/* Backup dan restore */}
            <button
              onClick={() => setShowBackupModal(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <p className="font-semibold text-sm text-[#1C201D] dark:text-[#E8F0EA]">
                  Backup dan restore
                </p>
                <p className="text-xs text-[#767A73] dark:text-[#8E948B] mt-0.5">
                  Simpan atau pulihkan data
                </p>
              </div>
              <ChevronRight size={18} className="text-[#8E948B]" />
            </button>
          </div>
        </div>

        {/* TAMPILAN & KEAMANAN SECTION */}
        <div>
          <h4 className="text-[11px] font-bold tracking-wider text-[#767A73] dark:text-[#8E948B] uppercase mb-2">
            TAMPILAN & KEAMANAN
          </h4>
          <div className="bg-white dark:bg-[#1C221E] border border-[#DDD9CD] dark:border-[#2D3630] rounded-2xl divide-y divide-black/[0.04] dark:divide-white/[0.04] overflow-hidden">
            {/* Mode gelap */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-[#1C201D] dark:text-[#E8F0EA]">
                  Mode gelap
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 flex items-center ${
                  settings.darkMode ? 'bg-[#2E7D52]' : 'bg-[#D1CFBF] dark:bg-[#343F37]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Kunci aplikasi */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-[#1C201D] dark:text-[#E8F0EA]">
                  Kunci aplikasi
                </p>
                <p className="text-xs text-[#767A73] dark:text-[#8E948B] mt-0.5">
                  PIN atau biometrik
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateSettings({ pinLockEnabled: !settings.pinLockEnabled })
                }
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 flex items-center ${
                  settings.pinLockEnabled ? 'bg-[#2E7D52]' : 'bg-[#D1CFBF] dark:bg-[#343F37]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    settings.pinLockEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backup & Restore Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C221E] rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-[#1C201D] dark:text-[#E8F0EA] mb-2">
              Backup & Restore Data
            </h3>
            <p className="text-xs text-[#767A73] dark:text-[#8E948B] mb-5 leading-relaxed">
              Anda dapat mengunduh seluruh data (dompet, kategori, transaksi) ke dalam format file JSON atau memulihkannya kembali kapan saja.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleDownloadBackup}
                className="w-full py-3 px-4 rounded-xl bg-[#1B3B2B] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#254C38]"
              >
                <Download size={16} />
                <span>Unduh Backup (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border border-[#DDD9CD] dark:border-[#2D3630] text-xs font-semibold text-[#1C201D] dark:text-[#E8F0EA] flex items-center justify-center gap-2 hover:bg-black/5"
              >
                <Upload size={16} />
                <span>Pulihkan dari File Backup</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin mengatur ulang data ke kondisi awal?')) {
                    resetData();
                    setBackupStatus('Data berhasil di-reset ke default.');
                  }
                }}
                className="w-full py-2.5 text-xs text-[#A73C2C] hover:underline"
              >
                Reset ke Data Bawaan
              </button>
            </div>

            {backupStatus && (
              <p className="text-xs text-[#2E7D52] dark:text-[#8EE0B0] font-medium mt-3 text-center">
                {backupStatus}
              </p>
            )}

            <button
              onClick={() => {
                setShowBackupModal(false);
                setBackupStatus('');
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#EDECE4] dark:bg-[#252E27] text-xs font-semibold text-[#555A51] dark:text-[#E8F0EA]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
