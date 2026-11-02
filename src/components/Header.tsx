import React from 'react';
import { Music, ExternalLink, HelpCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderProps {
  isKhmerUi: boolean;
  setIsKhmerUi: (val: boolean) => void;
  isPlayingAudio: boolean;
  onStopAudio: () => void;
  onOpenHelp: () => void;
  onOpenApiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isKhmerUi,
  setIsKhmerUi,
  isPlayingAudio,
  onStopAudio,
  onOpenHelp,
  onOpenApiModal,
}) => {
  return (
    <header className="border-b border-[#2b2545] bg-[#161327]/90 backdrop-blur sticky top-0 z-30 px-4 py-2.5 flex items-center justify-between">
      {/* Left Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/40">
          <Music className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent font-['Kantumruy_Pro',sans-serif]">
              {isKhmerUi ? 'បង្កើតបទចម្រៀង សម្រាប់ Suno' : 'Suno Music & Lyrics Generator'}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Sparkles className="w-2.5 h-2.5" /> AI Studio
            </span>
          </div>
          <p className="text-xs text-purple-300/80 hidden sm:block">
            {isKhmerUi
              ? 'វាយពាក្យ ➔ ៣០ បទខុសៗគ្នា (Lyrics + Style) ➔ Copy ទៅបិទភ្ជាប់ក្នុង suno.com'
              : 'Enter keyword ➔ Generate up to 30 custom songs (Lyrics + Style) ➔ Copy & paste into suno.com'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Audio active indicator */}
        {isPlayingAudio && (
          <button
            onClick={onStopAudio}
            title="Stop audio synth preview"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse hover:bg-cyan-500/30 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span className="hidden md:inline">Playing Beat</span>
            <VolumeX className="w-3 h-3 text-red-400" />
          </button>
        )}

        {/* Suno API & Limits modal button */}
        <button
          onClick={onOpenApiModal}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/30 hover:bg-pink-500/20 transition-all font-medium"
          title={isKhmerUi ? 'ព័ត៌មាន Suno API & Credits' : 'Suno API & Limits Info'}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
          <span>{isKhmerUi ? 'Suno API' : 'Suno API'}</span>
        </button>

        {/* Suno Help / Guide button */}
        <button
          onClick={onOpenHelp}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#221c38] text-purple-200 border border-purple-800/40 hover:bg-[#2e264c] hover:border-purple-600 transition-colors"
          title={isKhmerUi ? 'របៀបប្រើក្នុង Suno' : 'Suno Usage Guide'}
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline">{isKhmerUi ? 'របៀបប្រើ' : 'Guide'}</span>
        </button>

        {/* Suno.com Direct Link */}
        <a
          href="https://suno.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-medium hover:from-purple-600 hover:to-indigo-500 shadow-sm transition-all"
        >
          <span>suno.com</span>
          <ExternalLink className="w-3 h-3 text-white/80" />
        </a>

        {/* Language switcher */}
        <button
          onClick={() => setIsKhmerUi(!isKhmerUi)}
          className="text-xs px-2.5 py-1.5 rounded-lg bg-[#221c38] text-purple-300 hover:text-white border border-[#3b325c] hover:border-purple-500 transition-all font-medium"
          title="Switch Language"
        >
          {isKhmerUi ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}
        </button>
      </div>
    </header>
  );
};
