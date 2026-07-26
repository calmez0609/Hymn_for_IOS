import { useHymnApp } from './presentation/hooks/useHymnApp';
import { IosDeviceWrapper } from './presentation/components/IosDeviceWrapper';
import { HeaderTabBar } from './presentation/components/HeaderTabBar';
import { HomeScreen } from './presentation/screens/HomeScreen';
import { SearchScreen } from './presentation/screens/SearchScreen';
import { HistoryScreen } from './presentation/screens/HistoryScreen';
import { SettingsScreen } from './presentation/screens/SettingsScreen';
import { HymnDetailModal } from './presentation/components/HymnDetailModal';

export function App() {
  const {
    activeTab,
    setActiveTab,
    activeHymn,
    setActiveHymn,
    historyRecords,
    settings,
    updateSettings,
    dataSourceInfo,
    isInitializing,
    toasts,
    openHymn,
    findAndOpenHymn,
    searchHymns,
    importSqliteDb,
    resetToDefaultJson,
    clearHistory,
  } = useHymnApp();

  return (
    <IosDeviceWrapper>
      {/* Loading Overlay */}
      {isInitializing && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium text-slate-700">
            <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            載入資料庫中...
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="absolute top-14 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3 rounded-xl text-xs font-medium shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-top-2 duration-200 pointer-events-auto ${
              toast.type === 'error'
                ? 'bg-red-500/90 text-white'
                : toast.type === 'success'
                ? 'bg-emerald-600/90 text-white'
                : 'bg-slate-800/90 text-white'
            }`}
          >
            {toast.text}
          </div>
        ))}
      </div>

      {/* Header Tab Bar */}
      <HeaderTabBar 
        activeTab={activeTab} 
        onTabChange={(index) => {
          setActiveTab(index);
          setActiveHymn(null);
        }} 
      />

      {/* Main Tab Screens */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 0 && (
          <HomeScreen
            onConfirm={(category, number) => findAndOpenHymn(category, number)}
          />
        )}
        {activeTab === 1 && (
          <SearchScreen
            onSearch={searchHymns}
            onSelectHymn={openHymn}
          />
        )}
        {activeTab === 2 && (
          <HistoryScreen
            records={historyRecords}
            onSelectHymn={openHymn}
            onClearHistory={clearHistory}
          />
        )}
        {activeTab === 3 && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={updateSettings}
            dataSourceInfo={dataSourceInfo}
            onImportDb={importSqliteDb}
            onResetDb={resetToDefaultJson}
          />
        )}

        {/* Hymn Detail Fullscreen Modal */}
        <HymnDetailModal
          hymn={activeHymn}
          fontSize={settings.fontSize}
          onClose={() => setActiveHymn(null)}
        />
      </div>
    </IosDeviceWrapper>
  );
}

export default App;
