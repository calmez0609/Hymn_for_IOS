import React, { useEffect, useState } from 'react';
import type { Hymn } from '../../domain/entities/Hymn';
import { getCategoryText } from '../../domain/entities/Hymn';
import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, Share2 } from 'lucide-react';

interface HymnDetailModalProps {
  hymn: Hymn | null;
  fontSize: number;
  onClose: () => void;
  onShare: () => void;
  onFontSizeChange: (nextFontSize: number) => void;
}

export const HymnDetailModal: React.FC<HymnDetailModalProps> = ({
  hymn,
  fontSize,
  onClose,
  onShare,
  onFontSizeChange,
}) => {
  const [isFontSidebarExpanded, setIsFontSidebarExpanded] = useState(false);

  useEffect(() => {
    setIsFontSidebarExpanded(false);
  }, [hymn?.id]);

  if (!hymn) return null;

  const categoryText = getCategoryText(hymn.bookId);
  const canDecrease = fontSize > 12;
  const canIncrease = fontSize < 32;

  return (
    <div className="hymn-modal overflow-hidden">
      <div className="hymn-modal-header px-3 d-flex align-items-center gap-3 flex-shrink-0 user-select-none">
        <button
          onClick={onClose}
          className="hymn-modal-close d-inline-flex align-items-center justify-content-center"
          title="返回"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="mb-0 fs-6 fw-semibold text-truncate flex-grow-1">
          ({categoryText}){hymn.number} - {hymn.title}
        </h1>
        <button
          type="button"
          onClick={onShare}
          className="hymn-modal-close d-inline-flex align-items-center justify-content-center flex-shrink-0"
          title="分享"
          aria-label="分享詩歌內容"
        >
          <Share2 size={20} />
        </button>
      </div>

      <div className="flex-grow-1 overflow-auto px-4 px-sm-5 py-4 bg-white">
        <div className="mx-auto d-flex flex-column align-items-center text-center gap-4 pb-4" style={{ maxWidth: '36rem' }}>
          <h2 className="hymn-title display-6 fw-bold lh-sm mb-0">
            {hymn.title}
          </h2>

          <div
            className="lyrics-content text-body text-center w-100"
            style={{ fontSize: `${fontSize}px` }}
          >
            {hymn.body}
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`font-sidebar-handle ${isFontSidebarExpanded ? 'font-sidebar-handle--expanded' : ''}`}
        onClick={() => setIsFontSidebarExpanded((prev) => !prev)}
        aria-label={isFontSidebarExpanded ? '收合字體工具' : '展開字體工具'}
        title={isFontSidebarExpanded ? '收合字體工具' : '展開字體工具'}
      >
        {isFontSidebarExpanded ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div
        className={`font-sidebar d-flex flex-column align-items-center gap-2 ${
          isFontSidebarExpanded ? 'font-sidebar--expanded' : 'font-sidebar--collapsed'
        }`}
      >
        <button
          type="button"
          className="font-sidebar__button"
          onClick={() => onFontSizeChange(fontSize + 1)}
          disabled={!canIncrease}
          aria-label="放大字體"
          title="放大字體"
        >
          <Plus size={18} />
        </button>
        <div className="font-sidebar__value">{fontSize}px</div>
        <button
          type="button"
          className="font-sidebar__button"
          onClick={() => onFontSizeChange(fontSize - 1)}
          disabled={!canDecrease}
          aria-label="縮小字體"
          title="縮小字體"
        >
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
};
