import React, { useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { TabType, BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { HistoryScreen } from './components/history/HistoryScreen';
import { ChartScreen } from './components/charts/ChartScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { TransactionForm } from './components/transactions/TransactionForm';
import { EditTransactionModal } from './components/transactions/EditTransactionModal';
import { CategoryManager } from './components/categories/CategoryManager';
import { CategoryFormModal } from './components/categories/CategoryFormModal';
import { ExportModal } from './components/export/ExportModal';
import { PinLockModal } from './components/common/PinLockModal';
import { Transaction, TransactionType, Category } from './types';

const MainApp: React.FC = () => {
  const { settings } = useWallet();

  const [activeTab, setActiveTab] = useState<TabType>('beranda');

  // Modals state
  const [transactionFormState, setTransactionFormState] = useState<{
    isOpen: boolean;
    type: TransactionType;
  }>({
    isOpen: false,
    type: 'EXPENSE',
  });

  const [selectedTxForEdit, setSelectedTxForEdit] = useState<Transaction | null>(null);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState<boolean>(false);
  const [categoryFormState, setCategoryFormState] = useState<{
    isOpen: boolean;
    type: TransactionType;
    editingCategory?: Category | null;
  }>({
    isOpen: false,
    type: 'EXPENSE',
    editingCategory: null,
  });

  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(() => settings.pinLockEnabled);

  return (
    <div className="min-h-screen bg-[#EDECE4] dark:bg-[#0B0D0C] flex justify-center selection:bg-[#1B3B2B] selection:text-white">
      {/* Mobile container */}
      <div className="w-full max-w-md min-h-screen bg-[#F6F5EE] dark:bg-[#121614] flex flex-col relative shadow-2xl border-x border-[#DDD9CD]/50 dark:border-white/5">
        {/* Main Tabs Content */}
        <main className="flex-1">
          {activeTab === 'beranda' && (
            <HomeScreen
              onOpenCreateTransaction={(type) =>
                setTransactionFormState({ isOpen: true, type })
              }
              onViewAllTransactions={() => setActiveTab('riwayat')}
              onSelectTransaction={(tx) => setSelectedTxForEdit(tx)}
              onOpenSettings={() => setActiveTab('pengaturan')}
            />
          )}

          {activeTab === 'riwayat' && (
            <HistoryScreen
              onSelectTransaction={(tx) => setSelectedTxForEdit(tx)}
            />
          )}

          {activeTab === 'grafik' && (
            <ChartScreen onOpenExport={() => setIsExportOpen(true)} />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsScreen
              onOpenManageCategories={() => setIsManageCategoriesOpen(true)}
              onOpenExport={() => setIsExportOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Overlays / Modals */}
        {transactionFormState.isOpen && (
          <TransactionForm
            initialType={transactionFormState.type}
            onClose={() =>
              setTransactionFormState({ isOpen: false, type: 'EXPENSE' })
            }
            onOpenManageCategories={() => {
              setTransactionFormState({ isOpen: false, type: 'EXPENSE' });
              setIsManageCategoriesOpen(true);
            }}
            onOpenNewCategory={(type) => {
              setCategoryFormState({ isOpen: true, type, editingCategory: null });
            }}
          />
        )}

        {selectedTxForEdit && (
          <EditTransactionModal
            transaction={selectedTxForEdit}
            onClose={() => setSelectedTxForEdit(null)}
          />
        )}

        {isManageCategoriesOpen && (
          <CategoryManager
            onClose={() => setIsManageCategoriesOpen(false)}
            onOpenCreateCategory={(type) =>
              setCategoryFormState({ isOpen: true, type, editingCategory: null })
            }
            onOpenEditCategory={(cat) =>
              setCategoryFormState({
                isOpen: true,
                type: cat.type,
                editingCategory: cat,
              })
            }
          />
        )}

        {categoryFormState.isOpen && (
          <CategoryFormModal
            initialType={categoryFormState.type}
            editingCategory={categoryFormState.editingCategory}
            onClose={() =>
              setCategoryFormState({
                isOpen: false,
                type: 'EXPENSE',
                editingCategory: null,
              })
            }
          />
        )}

        {isExportOpen && (
          <ExportModal onClose={() => setIsExportOpen(false)} />
        )}

        {/* PIN Lock Screen if active */}
        {isLocked && settings.pinLockEnabled && (
          <PinLockModal onUnlock={() => setIsLocked(false)} />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <MainApp />
    </WalletProvider>
  );
}
