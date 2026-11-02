import React, { useState } from 'react';
import { Bookmark, Check, Volume2, RotateCcw } from 'lucide-react';
import { Song } from '../types';
import { toKhmerNumber } from '../utils/khmerNumerals';

interface SongCardProps {
  song: Song;
  isSelected: boolean;
  onSelect: (song: Song) => void;
  onCopyStyle: (song: Song, e: React.MouseEvent) => void;
  onCopyLyrics: (song: Song, e: React.MouseEvent) => void;
  onCopyBoth: (song: Song, e: React.MouseEvent) => void;
  onPlayPreview: (song: Song, e: React.MouseEvent) => void;
  isPlayingThisSong: boolean;
  isKhmerUi: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  isSelected,
  onSelect,
  onCopyStyle,
  onCopyLyrics,
  onCopyBoth,
  onPlayPreview,
  isPlayingThisSong,
  isKhmerUi,
}) => {
  const [copiedQuick, setCopiedQuick] = useState(false);

  const handleQuickCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyBoth(song, e);
    setCopiedQuick(true);
    setTimeout(() => setCopiedQuick(false), 1500);
  };

  return (
    <div
      onClick={() => onSelect(song)}
      className={`group relative bg-[#18152b] rounded-xl p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer border hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-950/40 select-none ${
        isSelected
          ? 'border-pink-500 shadow-md shadow-pink-900/30 ring-1 ring-pink-500/50'
          : 'border-[#2e264d] hover:border-purple-500/70'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Number Badge */}
            <div className="w-6 h-6 shrink-0 rounded bg-[#7c3aed] text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-purple-900/50">
              {toKhmerNumber(song.index)}
            </div>

            {/* Title */}
            <h3 className="font-bold text-white text-xs sm:text-[13px] leading-tight truncate group-hover:text-pink-300 transition-colors">
              {song.title}
            </h3>
          </div>

          {/* Quick Copy / Bookmark button */}
          <button
            type="button"
            onClick={handleQuickCopy}
            className={`w-5 h-5 rounded flex items-center justify-center transition-all shrink-0 ${
              copiedQuick
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30'
            }`}
            title={isKhmerUi ? 'ចម្លងទាំងពីរ (Style + Lyrics)' : 'Quick copy both'}
          >
            {copiedQuick ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3 fill-current" />}
          </button>
        </div>

        {/* Style Prompt */}
        <p className="text-[11px] text-cyan-400 font-sans leading-snug line-clamp-2 mb-2 tracking-normal font-medium">
          {song.style}
        </p>

        {/* Lyrics Snippet */}
        <p className="text-[11px] text-slate-400 italic line-clamp-3 leading-relaxed mb-3">
          {song.previewSnippet || (song.lyrics ? song.lyrics.slice(0, 100) + '...' : '')}
        </p>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-2 border-t border-[#262040] flex items-center justify-between gap-1 mt-auto">
        <div className="flex items-center gap-1">
          {/* Copy Style Button */}
          <button
            type="button"
            onClick={(e) => onCopyStyle(song, e)}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0891b2] hover:bg-[#06b6d4] text-white shadow-sm transition-colors active:scale-95"
            title="Copy Style Prompt"
          >
            Style
          </button>

          {/* Copy Lyrics Button */}
          <button
            type="button"
            onClick={(e) => onCopyLyrics(song, e)}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ec4899] hover:bg-[#f472b6] text-white shadow-sm transition-colors active:scale-95"
            title="Copy Lyrics"
          >
            Lyrics
          </button>

          {/* Copy Both Button */}
          <button
            type="button"
            onClick={(e) => onCopyBoth(song, e)}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#6d28d9] hover:bg-[#7c3aed] text-white shadow-sm transition-colors active:scale-95"
            title="Copy Both for Suno"
          >
            {isKhmerUi ? 'ទាំង' : 'Both'}
          </button>
        </div>

        {/* Audio Synth Preview or Re-roll */}
        <button
          type="button"
          onClick={(e) => onPlayPreview(song, e)}
          className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
            isPlayingThisSong
              ? 'bg-cyan-500 text-white animate-pulse'
              : 'bg-[#221c38] text-purple-300 hover:text-white hover:bg-[#322953] border border-[#372e59]'
          }`}
          title={isPlayingThisSong ? 'Stop beat preview' : 'Audition beat preview'}
        >
          {isPlayingThisSong ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <RotateCcw className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
};
