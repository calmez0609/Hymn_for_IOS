import React, { useState } from 'react';
import { Delete } from 'lucide-react';

interface HomeScreenProps {
  onConfirm: (category: string, number: string) => void;
}

const CATEGORIES = ['詩歌', '補充', '新歌', '新詩', '藍本'];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onConfirm }) => {
  const [input, setInput] = useState<string>('詩歌-');

  const handleCategoryClick = (cat: string) => {
    setInput(`${cat}-`);
  };

  const handleNumberClick = (numStr: string) => {
    setInput((prev) => prev + numStr);
  };

  const handleBackspace = () => {
    if (!input) return;
    const hyphenIdx = input.indexOf('-');
    if (hyphenIdx !== -1 && input.length > hyphenIdx + 1) {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  const handleConfirmClick = () => {
    const parts = input.split('-');
    if (parts.length === 2 && parts[1]) {
      onConfirm(parts[0], parts[1]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 overflow-y-auto relative bg-slate-50">
      {/* Top Input Header & Backspace Button */}
      <div className="w-full flex items-center justify-between pb-4 pt-2 shrink-0">
        <div className="text-4xl font-bold text-slate-800 tracking-wide select-none h-12 flex items-center">
          {input}
        </div>
        <button
          onClick={handleBackspace}
          className="w-12 h-12 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-full flex items-center justify-center shadow-md transition-all shrink-0"
          title="倒退 (Backspace)"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      {/* Special Category Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 shrink-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className="bg-[#009688] hover:bg-[#00796b] active:scale-95 text-white font-medium px-4 py-2 rounded-full text-sm shadow-sm transition-all"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Number Keypad Grid (1-9 and 0) */}
      <div className="flex-1 min-h-0 flex flex-col justify-center max-w-sm w-full mx-auto self-center">
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="bg-[#009688]/90 hover:bg-[#00796b] active:scale-95 text-white text-2xl font-semibold h-16 rounded-2xl flex items-center justify-center shadow transition-all"
            >
              {num}
            </button>
          ))}
          <div className="col-start-2">
            <button
              onClick={() => handleNumberClick('0')}
              className="w-full bg-[#009688]/90 hover:bg-[#00796b] active:scale-95 text-white text-2xl font-semibold h-16 rounded-2xl flex items-center justify-center shadow transition-all"
            >
              0
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="mt-auto shrink-0 pt-2 pb-4">
        <button
          onClick={handleConfirmClick}
          className="w-full bg-[#009688] hover:bg-[#00796b] active:scale-[0.98] text-white text-xl font-bold h-14 rounded-full shadow-lg transition-all"
        >
          確定
        </button>
      </div>
    </div>
  );
};
