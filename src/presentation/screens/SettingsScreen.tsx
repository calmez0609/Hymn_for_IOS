import React from 'react';
import type { Settings as SettingsEntity } from '../../domain/entities/Settings';
import { Sliders, Database, RotateCcw, UserCheck } from 'lucide-react';

interface SettingsScreenProps {
  settings: SettingsEntity;
  onUpdateSettings: (newSettings: Partial<SettingsEntity>) => void;
  dataSourceInfo: string;
  onImportDb: (file: File) => void;
  onResetDb: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  dataSourceInfo,
  onImportDb,
  onResetDb,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportDb(e.target.files[0]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-y-auto space-y-4">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-200">
        <Sliders className="w-5 h-5 text-teal-600" />
        設置 (Settings)
      </h2>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-slate-700">字體大小 (Font Size)</label>
          <span className="text-sm font-medium text-teal-600 font-mono">{settings.fontSize}px</span>
        </div>
        <input
          type="range"
          min="12"
          max="32"
          step="1"
          value={settings.fontSize}
          onChange={(e) => onUpdateSettings({ fontSize: parseFloat(e.target.value) })}
          className="w-full accent-teal-600 cursor-pointer"
        />

        <div
          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 transition-all text-center"
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          這是一段預覽文字。 This is sample text with the current settings.
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-slate-800">資料來源 (.db 檔案管理)</h3>
        </div>

        <div className="text-xs bg-teal-50 border border-teal-200 text-teal-900 p-2.5 rounded-lg">
          目前狀態：<span className="font-semibold">{dataSourceInfo}</span>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <label className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg text-xs text-center cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-1.5">
            <Database className="w-4 h-4" />
            匯入 .db SQLite 資料庫檔案
            <input
              type="file"
              accept=".db,.sqlite,.sqlite3"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={onResetDb}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置為內建資料庫 (hymn_data.json)
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center space-y-1">
        <p className="text-xs text-slate-500 font-medium">Version: 1.0.0 (100% Client-Side Static)</p>
        <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-teal-600" />
          Author: Lenny(梁隆基)
        </p>
      </div>
    </div>
  );
};
