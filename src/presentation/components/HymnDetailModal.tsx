import React from 'react';
import type { Hymn } from '../../domain/entities/Hymn';
import { getCategoryText } from '../../domain/entities/Hymn';
import { ArrowLeft } from 'lucide-react';

interface HymnDetailModalProps {
  hymn: Hymn | null;
  fontSize: number;
  onClose: () => void;
}

export const HymnDetailModal: React.FC<HymnDetailModalProps> = ({ hymn, fontSize, onClose }) => {
  if (!hymn) return null;

  const categoryText = getCategoryText(hymn.bookId);

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-right duration-200">
      <div className="bg-[#009688] text-white h-14 px-3 flex items-center gap-3 shadow-md shrink-0 select-none">
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-teal-700/50 rounded-full transition-colors active:scale-95"
          title="返回"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-base font-semibold truncate flex-1 pr-4">
          ({categoryText}){hymn.number} - {hymn.title}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-white">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center space-y-5 pb-8">
          <h2 className="text-2xl font-bold text-[#009688] tracking-tight leading-snug">
            {hymn.title}
          </h2>

          <div
            className="lyrics-content text-slate-800 font-normal leading-relaxed text-center w-full"
            style={{ fontSize: `${fontSize}px` }}
          >
            {hymn.body}
          </div>
        </div>
      </div>
    </div>
  );
};
