import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, ChevronDown } from 'lucide-react';
import type { Hymn } from '../../domain/entities/Hymn';
import { getCategoryText } from '../../domain/entities/Hymn';

interface SearchScreenProps {
  onSearch: (query: string, searchByTitle: boolean) => Promise<Hymn[]>;
  onSelectHymn: (hymn: Hymn) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onSearch, onSelectHymn }) => {
  const [query, setQuery] = useState<string>('');
  const [searchByTitle, setSearchByTitle] = useState<boolean>(true);
  const [results, setResults] = useState<Hymn[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    let isSubscribed = true;
    async function doSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      const res = await onSearch(query, searchByTitle);
      if (isSubscribed) {
        setResults(res);
        setIsSearching(false);
      }
    }

    const timer = setTimeout(doSearch, 200);
    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [query, searchByTitle, onSearch]);

  return (
    <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="尋找詩歌..."
            className="w-full pl-3 pr-9 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500 text-sm text-slate-800 bg-white shadow-sm"
          />
          <SearchIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="relative bg-white border border-slate-300 rounded-lg shrink-0">
          <select
            value={searchByTitle ? 'Title' : 'Body'}
            onChange={(e) => {
              setSearchByTitle(e.target.value === 'Title');
              setQuery('');
              setResults([]);
            }}
            className="appearance-none bg-transparent pl-3 pr-7 py-2.5 text-sm text-slate-700 focus:outline-none font-medium cursor-pointer"
          >
            <option value="Title">標題</option>
            <option value="Body">內容</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white rounded-xl shadow-sm border border-slate-200">
        {isSearching && (
          <div className="p-6 text-center text-slate-400 text-sm">搜尋中...</div>
        )}

        {!isSearching && query.trim() && results.length === 0 && (
          <div className="p-6 text-center text-slate-400 text-sm">未找到符合的詩歌</div>
        )}

        {!isSearching && !query.trim() && (
          <div className="p-6 text-center text-slate-400 text-sm">請輸入關鍵字進行搜尋</div>
        )}

        {results.map((hymn) => {
          const categoryText = getCategoryText(hymn.bookId);
          return (
            <button
              key={`${hymn.bookId}-${hymn.number}`}
              onClick={() => onSelectHymn(hymn)}
              className="w-full text-left p-3.5 hover:bg-teal-50/50 active:bg-teal-100/60 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
                  {categoryText} 第{hymn.number}首
                </span>
                <span className="text-sm font-medium text-slate-800 truncate">
                  {hymn.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
