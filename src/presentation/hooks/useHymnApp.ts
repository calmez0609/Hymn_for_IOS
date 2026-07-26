import { useState, useEffect, useCallback } from 'react';
import type { Hymn } from '../../domain/entities/Hymn';
import { CATEGORY_BOOK_MAP } from '../../domain/entities/Hymn';
import type { HistoryRecord } from '../../domain/entities/HistoryRecord';
import type { Settings } from '../../domain/entities/Settings';
import { HymnRepositoryImpl } from '../../data/repositories/HymnRepositoryImpl';
import { HistoryRepositoryImpl } from '../../data/repositories/HistoryRepositoryImpl';
import { LocalStorageDataSource } from '../../data/datasources/LocalStorageDataSource';

const hymnRepo = new HymnRepositoryImpl();
const historyRepo = new HistoryRepositoryImpl();
const storage = new LocalStorageDataSource();

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'error' | 'success' | 'info';
}

export function useHymnApp() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeHymn, setActiveHymn] = useState<Hymn | null>(null);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [settings, setSettings] = useState<Settings>(storage.getSettings());
  const [dataSourceInfo, setDataSourceInfo] = useState<string>(hymnRepo.getLoadedSourceInfo());
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'error' | 'success' | 'info' = 'error') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    async function init() {
      setIsInitializing(true);
      await hymnRepo.init();
      const hist = await historyRepo.getHistory();
      setHistoryRecords(hist);
      setDataSourceInfo(hymnRepo.getLoadedSourceInfo());
      setIsInitializing(false);
    }
    init();
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      storage.saveSettings(updated);
      return updated;
    });
  }, []);

  const refreshHistory = useCallback(async () => {
    const hist = await historyRepo.getHistory();
    setHistoryRecords(hist);
  }, []);

  const openHymn = useCallback(async (hymn: Hymn) => {
    setActiveHymn(hymn);
    await historyRepo.addHistory(hymn);
    await refreshHistory();
  }, [refreshHistory]);

  const findAndOpenHymn = useCallback(async (category: string, numberStr: string) => {
    const num = parseInt(numberStr, 10);
    if (isNaN(num)) {
      showToast(`請輸入有效的詩歌編號`, 'error');
      return;
    }

    const bookId = CATEGORY_BOOK_MAP[category] || 1;
    const found = await hymnRepo.getHymnByNumber(bookId, num);

    if (found) {
      await openHymn(found);
    } else {
      showToast(`沒有找到對應的${category} 第${num}首`, 'error');
    }
  }, [openHymn, showToast]);

  const searchHymns = useCallback(async (query: string, searchByTitle: boolean) => {
    return await hymnRepo.searchHymns(query, searchByTitle);
  }, []);

  const importSqliteDb = useCallback(async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await hymnRepo.loadFromSqliteDb(arrayBuffer);
      setDataSourceInfo(hymnRepo.getLoadedSourceInfo());
      showToast(`成功載入 .db 資料庫！共 ${result.count} 首詩歌`, 'success');
    } catch (err: any) {
      showToast(`載入 .db 失敗: ${err.message || '無效的 SQLite 檔案'}`, 'error');
    }
  }, [showToast]);

  const resetToDefaultJson = useCallback(async () => {
    await hymnRepo.resetToDefaultJson();
    setDataSourceInfo(hymnRepo.getLoadedSourceInfo());
    showToast(`已重置為內建資料庫 (hymn_data.json)`, 'info');
  }, [showToast]);

  const clearHistory = useCallback(async () => {
    await historyRepo.clearHistory();
    await refreshHistory();
    showToast(`歷史紀錄已清除`, 'info');
  }, [refreshHistory, showToast]);

  return {
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
    showToast,
    openHymn,
    findAndOpenHymn,
    searchHymns,
    importSqliteDb,
    resetToDefaultJson,
    clearHistory,
  };
}
