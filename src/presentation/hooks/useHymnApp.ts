import { useState, useEffect, useCallback } from 'react';
import type { Hymn } from '../../domain/entities/Hymn';
import { CATEGORY_BOOK_MAP } from '../../domain/entities/Hymn';
import type { HistoryRecord } from '../../domain/entities/HistoryRecord';
import type { SchedulePlan } from '../../domain/entities/SchedulePlan';
import { isPlanExpired } from '../../domain/entities/SchedulePlan';
import type { Settings } from '../../domain/entities/Settings';
import { HymnRepositoryImpl } from '../../data/repositories/HymnRepositoryImpl';
import { HistoryRepositoryImpl } from '../../data/repositories/HistoryRepositoryImpl';
import { LocalStorageDataSource } from '../../data/datasources/LocalStorageDataSource';

const hymnRepo = new HymnRepositoryImpl();
const historyRepo = new HistoryRepositoryImpl();
const storage = new LocalStorageDataSource();
const PICKER_TAB_INDEX = 1;

function sortSchedulePlans(plans: SchedulePlan[]): SchedulePlan[] {
  return [...plans].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'error' | 'success' | 'info';
}

export function useHymnApp() {
  const rememberedHymn = storage.getRememberedHymn();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeHymn, setActiveHymnState] = useState<Hymn | null>(
    rememberedHymn?.sourceTab === PICKER_TAB_INDEX ? rememberedHymn.hymn : null
  );
  const [activeHymnTab, setActiveHymnTabState] = useState<number | null>(rememberedHymn?.sourceTab ?? null);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [schedulePlans, setSchedulePlans] = useState<SchedulePlan[]>(sortSchedulePlans(storage.getSchedulePlans()));
  const [settings, setSettings] = useState<Settings>(storage.getSettings());
  const [homeDraft, setHomeDraftState] = useState<string>(storage.getHomeDraft());
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

  const setHomeDraft = useCallback((value: string) => {
    setHomeDraftState(value);
    storage.saveHomeDraft(value);
  }, []);

  const persistRememberedHymn = useCallback((nextRememberedHymn: { hymn: Hymn; sourceTab: number } | null) => {
    storage.saveRememberedHymn(nextRememberedHymn);
  }, []);

  const updateSchedulePlansState = useCallback((updater: (prev: SchedulePlan[]) => SchedulePlan[]) => {
    setSchedulePlans((prev) => {
      const updated = sortSchedulePlans(updater(prev));
      storage.saveSchedulePlans(updated);
      return updated;
    });
  }, []);

  const setActiveHymn = useCallback((hymn: Hymn | null) => {
    setActiveHymnState(hymn);
  }, []);

  const setActiveHymnTab = useCallback((tab: number | null) => {
    setActiveHymnTabState(tab);
  }, []);

  const closeActiveHymn = useCallback((options?: { clearRemembered?: boolean }) => {
    const shouldClearRemembered = options?.clearRemembered ?? activeHymnTab === PICKER_TAB_INDEX;

    setActiveHymnState(null);
    setActiveHymnTabState(null);

    if (shouldClearRemembered) {
      persistRememberedHymn(null);
    }
  }, [activeHymnTab, persistRememberedHymn]);

  const restoreRememberedPickerHymn = useCallback(() => {
    const nextRememberedHymn = storage.getRememberedHymn();
    if (!nextRememberedHymn || nextRememberedHymn.sourceTab !== PICKER_TAB_INDEX) {
      return;
    }

    setActiveHymnState(nextRememberedHymn.hymn);
    setActiveHymnTabState(PICKER_TAB_INDEX);
  }, []);

  const openHymn = useCallback(async (hymn: Hymn) => {
    setActiveHymnState(hymn);
    setActiveHymnTabState(activeTab);
    if (activeTab === PICKER_TAB_INDEX) {
      persistRememberedHymn({ hymn, sourceTab: PICKER_TAB_INDEX });
    }
    await historyRepo.addHistory(hymn);
    await refreshHistory();
  }, [activeTab, persistRememberedHymn, refreshHistory]);

  const openHymnByNumber = useCallback(async (bookId: number, number: number): Promise<void> => {
    const found = await hymnRepo.getHymnByNumber(bookId, number);
    if (found) {
      await openHymn(found);
      return;
    }

    showToast(`找不到對應詩歌內容`, 'error');
  }, [openHymn, showToast]);

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

  const addSchedulePlan = useCallback((name: string, scheduledAt: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      showToast('請輸入行程名稱', 'error');
      return false;
    }

    if (!scheduledAt) {
      showToast('請選擇行程時間', 'error');
      return false;
    }

    updateSchedulePlansState((prev) => [
      ...prev,
      {
        id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: trimmedName,
        scheduledAt,
        items: [],
        createdAt: new Date().toISOString(),
      },
    ]);
    showToast('行程已新增', 'success');
    return true;
  }, [showToast, updateSchedulePlansState]);

  const deleteSchedulePlan = useCallback((planId: string) => {
    updateSchedulePlansState((prev) => prev.filter((plan) => plan.id !== planId));
    showToast('行程已刪除', 'info');
  }, [showToast, updateSchedulePlansState]);

  const clearExpiredSchedulePlans = useCallback(() => {
    const expiredCount = schedulePlans.filter((plan) => isPlanExpired(plan)).length;
    if (expiredCount === 0) {
      showToast('目前沒有已過期的行程', 'info');
      return 0;
    }

    updateSchedulePlansState((prev) => prev.filter((plan) => !isPlanExpired(plan)));
    showToast(`已刪除 ${expiredCount} 個已過期行程`, 'success');
    return expiredCount;
  }, [schedulePlans, showToast, updateSchedulePlansState]);

  const addHymnToSchedulePlan = useCallback(async (planId: string, category: string, numberStr: string) => {
    const num = parseInt(numberStr, 10);
    if (isNaN(num)) {
      showToast('請輸入有效的詩歌編號', 'error');
      return false;
    }

    const bookId = CATEGORY_BOOK_MAP[category] || 1;
    const hymn = await hymnRepo.getHymnByNumber(bookId, num);

    if (!hymn) {
      showToast(`沒有找到對應的${category} 第${num}首`, 'error');
      return false;
    }

    updateSchedulePlansState((prev) => prev.map((plan) => {
      if (plan.id !== planId) {
        return plan;
      }

      return {
        ...plan,
        items: [
          ...plan.items,
          {
            id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            bookId: hymn.bookId,
            number: hymn.number,
            title: hymn.title,
          },
        ],
      };
    }));

    showToast('已加入行程', 'success');
    return true;
  }, [showToast, updateSchedulePlansState]);

  const removeHymnFromSchedulePlan = useCallback((planId: string, itemId: string) => {
    updateSchedulePlansState((prev) => prev.map((plan) => {
      if (plan.id !== planId) {
        return plan;
      }

      return {
        ...plan,
        items: plan.items.filter((item) => item.id !== itemId),
      };
    }));
    showToast('已移除詩歌', 'info');
  }, [showToast, updateSchedulePlansState]);

  const moveSchedulePlanItem = useCallback((planId: string, itemId: string, direction: 'up' | 'down') => {
    updateSchedulePlansState((prev) => prev.map((plan) => {
      if (plan.id !== planId) {
        return plan;
      }

      const currentIndex = plan.items.findIndex((item) => item.id === itemId);
      if (currentIndex === -1) {
        return plan;
      }

      const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex < 0 || nextIndex >= plan.items.length) {
        return plan;
      }

      const nextItems = [...plan.items];
      const [movedItem] = nextItems.splice(currentIndex, 1);
      nextItems.splice(nextIndex, 0, movedItem);

      return {
        ...plan,
        items: nextItems,
      };
    }));
  }, [updateSchedulePlansState]);

  return {
    activeTab,
    setActiveTab,
    activeHymn,
    setActiveHymn,
    activeHymnTab,
    setActiveHymnTab,
    closeActiveHymn,
    restoreRememberedPickerHymn,
    historyRecords,
    schedulePlans,
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
    addSchedulePlan,
    deleteSchedulePlan,
    clearExpiredSchedulePlans,
    addHymnToSchedulePlan,
    removeHymnFromSchedulePlan,
    moveSchedulePlanItem,
  };
}
