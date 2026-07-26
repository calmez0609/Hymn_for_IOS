import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Radio } from 'lucide-react';

export type IosDevicePreset = 'auto' | 'iphone-x' | 'iphone-pro' | 'iphone-promax';

interface IosDeviceWrapperProps {
  children: React.ReactNode;
}

export const IosDeviceWrapper: React.FC<IosDeviceWrapperProps> = ({ children }) => {
  const [preset, setPreset] = useState<IosDevicePreset>('auto');
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Determine current active specs
  const getDeviceSpecs = () => {
    if (preset === 'iphone-x') {
      return { width: 375, height: 812, name: 'iPhone X / 10 (一般版)', type: 'notch' };
    }
    if (preset === 'iphone-pro') {
      return { width: 393, height: 852, name: 'iPhone 15 / 16 Pro (Pro 版)', type: 'island' };
    }
    if (preset === 'iphone-promax') {
      return { width: 430, height: 932, name: 'iPhone 16 Pro Max (Pro Max 版)', type: 'island' };
    }

    // Auto Detect based on window width
    if (windowWidth < 380) {
      return { width: '100%', height: '100%', name: 'Auto RWD - iPhone 10 (一般版)', type: 'notch' };
    } else if (windowWidth < 410) {
      return { width: '100%', height: '100%', name: 'Auto RWD - iPhone Pro 系列', type: 'island' };
    } else {
      return { width: '100%', height: '100%', name: 'Auto RWD - iPhone Pro Max 系列', type: 'island' };
    }
  };

  const specs = getDeviceSpecs();
  const isFrameMode = preset !== 'auto';

  // If on a real mobile device (width < 640) and preset is auto, just render full screen without fake frame
  if (windowWidth < 640 && preset === 'auto') {
    return (
      <div className="w-full h-[100dvh] bg-slate-50 flex flex-col relative overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4">
      {/* Top Device Switcher Control Toolbar */}
      <div className="w-full max-w-xl mb-3 bg-slate-800/90 backdrop-blur-md rounded-2xl p-2.5 border border-slate-700 shadow-lg flex flex-wrap items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-teal-400" />
          <span className="text-xs font-semibold text-slate-200">
            {specs.name}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setPreset('auto')}
            className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              preset === 'auto'
                ? 'bg-teal-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="自動偵測裝置寬度 (Auto RWD)"
          >
            <Monitor className="w-3.5 h-3.5 inline mr-1" />
            自動偵測
          </button>
          <button
            onClick={() => setPreset('iphone-x')}
            className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              preset === 'iphone-x'
                ? 'bg-teal-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            一般版 (X)
          </button>
          <button
            onClick={() => setPreset('iphone-pro')}
            className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              preset === 'iphone-pro'
                ? 'bg-teal-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pro 版
          </button>
          <button
            onClick={() => setPreset('iphone-promax')}
            className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              preset === 'iphone-promax'
                ? 'bg-teal-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pro Max
          </button>
        </div>
      </div>

      {/* Screen Frame Container */}
      <div
        className={`relative transition-all duration-300 ${
          isFrameMode
            ? 'border-[12px] border-slate-800 rounded-[50px] shadow-2xl overflow-hidden bg-white ring-1 ring-slate-700'
            : 'w-full max-w-md h-[840px] max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden bg-white ring-1 ring-slate-800'
        }`}
        style={{
          width: isFrameMode ? `${specs.width}px` : undefined,
          height: isFrameMode ? `${specs.height}px` : undefined,
        }}
      >
        {/* iOS Dynamic Island / Notch Cutout */}
        {specs.type === 'island' ? (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-950/80 border border-emerald-800" />
          </div>
        ) : (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl z-40 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
          </div>
        )}

        {/* iOS Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-11 px-6 pt-1 flex items-center justify-between z-30 pointer-events-none text-slate-800">
          <span className="text-xs font-semibold tracking-tight">{timeStr || '9:41'}</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Radio className="w-3 h-3 text-slate-800" />
            <Wifi className="w-3.5 h-3.5 text-slate-800" />
            <Battery className="w-4 h-4 text-slate-800" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full h-full pt-14 pb-6 flex flex-col bg-slate-50 relative overflow-hidden">
          {children}
        </div>

        {/* iOS Home Bar Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/60 rounded-full z-40 pointer-events-none" />
      </div>
    </div>
  );
};
