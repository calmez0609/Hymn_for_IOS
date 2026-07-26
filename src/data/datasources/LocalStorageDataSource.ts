import type { HistoryRecord } from '../../domain/entities/HistoryRecord';
import type { Settings } from '../../domain/entities/Settings';

const HISTORY_KEY = 'hymn_history_records';
const SETTINGS_KEY = 'hymn_app_settings';

export class LocalStorageDataSource {
  getHistory(): HistoryRecord[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveHistory(records: HistoryRecord[]): void {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save history to LocalStorage:', e);
    }
  }

  clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear history from LocalStorage:', e);
    }
  }

  getSettings(): Settings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return { fontSize: 18, backgroundColor: '#ffffff' };
  }

  saveSettings(settings: Settings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }
}
