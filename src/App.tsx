import { useHymnApp } from './presentation/hooks/useHymnApp';
import { IosDeviceWrapper } from './presentation/components/IosDeviceWrapper';
import { HeaderTabBar } from './presentation/components/HeaderTabBar';
import { HomeScreen } from './presentation/screens/HomeScreen';
import { SearchScreen } from './presentation/screens/SearchScreen';
import { HistoryScreen } from './presentation/screens/HistoryScreen';
import { SettingsScreen } from './presentation/screens/SettingsScreen';
import { HymnDetailModal } from './presentation/components/HymnDetailModal';
import { getCategoryText } from './domain/entities/Hymn';

export function App() {
  const {
    activeTab,
    setActiveTab,
    activeHymn,
    activeHymnTab,
    closeActiveHymn,
    restoreRememberedHomeHymn,
    historyRecords,
    settings,
    updateSettings,
    homeDraft,
    setHomeDraft,
    dataSourceInfo,
    isInitializing,
    toasts,
    showToast,
    openHymn,
    openHymnByNumber,
    findAndOpenHymn,
    searchHymns,
    importSqliteDb,
    resetToDefaultJson,
    clearHistory,
  } = useHymnApp();

  const handleShareHymn = async () => {
    if (!activeHymn) return;

    const categoryText = getCategoryText(activeHymn.bookId);
    const shareTitle = `(${categoryText})${activeHymn.number} - ${activeHymn.title}`;
    const shareText = `${shareTitle}\n\n${activeHymn.body}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        });
        return;
      }

      await navigator.clipboard.writeText(shareText);
      showToast('已複製詩歌內容，可以貼到聊天軟體分享', 'success');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      try {
        await navigator.clipboard.writeText(shareText);
        showToast('已複製詩歌內容，可以貼到聊天軟體分享', 'success');
      } catch {
        showToast('目前無法分享，請稍後再試', 'error');
      }
    }
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);

    if (index === 0) {
      if (activeHymn && activeHymnTab !== 0) {
        closeActiveHymn({ clearRemembered: false });
      }

      if (!activeHymn || activeHymnTab !== 0) {
        restoreRememberedHomeHymn();
      }
      return;
    }

    if (activeHymn) {
      closeActiveHymn({ clearRemembered: false });
    }
  };

  return (
    <IosDeviceWrapper>
      {isInitializing && (
        <div className="app-loading-overlay">
          <div className="bg-white rounded-4 shadow-lg px-4 py-3 d-flex align-items-center gap-3 text-secondary fw-semibold small">
            <div
              className="app-spinner spinner-border text-success"
              role="status"
              aria-hidden="true"
            />
            載入資料庫中...
          </div>
        </div>
      )}

      <div className="app-toast-stack d-flex flex-column gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-card rounded-4 px-3 py-2 small fw-semibold ${
              toast.type === 'error'
                ? 'toast-card--error'
                : toast.type === 'success'
                  ? 'toast-card--success'
                  : 'toast-card--info'
            }`}
          >
            {toast.text}
          </div>
        ))}
      </div>

      <div className="app-shell">
        {activeTab === 0 && (
          <HomeScreen
            input={homeDraft}
            onInputChange={setHomeDraft}
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
            onSelectHymn={openHymnByNumber}
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

        <HymnDetailModal
          hymn={activeHymn}
          fontSize={settings.fontSize}
          onFontSizeChange={(nextFontSize) =>
            updateSettings({
              fontSize: Math.max(12, Math.min(32, nextFontSize)),
            })
          }
          onShare={handleShareHymn}
          onClose={() => closeActiveHymn({ clearRemembered: true })}
        />
      </div>

      <HeaderTabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </IosDeviceWrapper>
  );
}

export default App;
