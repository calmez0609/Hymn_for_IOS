import React from 'react';
import type { HistoryRecord } from '../../domain/entities/HistoryRecord';
import type { Hymn } from '../../domain/entities/Hymn';
import { getCategoryText } from '../../domain/entities/Hymn';
import { Trash2, Clock } from 'lucide-react';

interface HistoryScreenProps {
  records: HistoryRecord[];
  onSelectHymn: (hymn: Hymn) => void;
  onClearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ records, onSelectHymn, onClearHistory }) => {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 shrink-0">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          歷史紀錄 (History)
        </h2>
        {records.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清除紀錄
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {records.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">尚無歷史紀錄</div>
        ) : (
          records.map((rec) => {
            const categoryText = getCategoryText(rec.bookId);
            const date = new Date(rec.timestamp);
            const dateFormatted = `${date.getMonth() + 1}/${date.getDate()} ${date
              .getHours()
              .toString()
              .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

            return (
              <button
                key={rec.id}
                onClick={() =>
                  onSelectHymn({
                    id: rec.bookId * 10000 + rec.number,
                    bookId: rec.bookId,
                    number: rec.number,
                    title: rec.title,
                    body: '',
                    tagId: 0,
                  })
                }
                className="w-full text-left p-3.5 hover:bg-teal-50/50 active:bg-teal-100/60 transition-colors flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">
                    ({categoryText}){rec.number} - {rec.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{dateFormatted}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
