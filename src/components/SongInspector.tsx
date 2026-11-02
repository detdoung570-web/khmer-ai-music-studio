import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  Edit3,
  Play,
  Pause,
  Music,
  Mic,
  MicOff,
  Radio,
  Sliders,
} from 'lucide-react';
import { Song } from '../types';
import { PlaybackState } from '../utils/audioSynth';
import { toKhmerNumber } from '../utils/khmerNumerals';

interface SongInspectorProps {
  song: Song | null;
  onCopyStyle: (song: Song) => void;
  onCopyLyrics: (song: Song) => void;
  onCopyBoth: (song: Song) => void;
  onPlayPreview: (song: Song) => void;
  isPlayingThisSong: boolean;
  playbackState: PlaybackState;
  onSetVolume: (vol: number) => void;
  onToggleVocal: () => void;
  onUpdateLyrics: (songId: string, newLyrics: string) => void;
  isKhmerUi: boolean;
}

export const SongInspector: React.FC<SongInspectorProps> = ({
  song,
  onCopyStyle,
  onCopyLyrics,
  onCopyBoth,
  onPlayPreview,
  isPlayingThisSong,
  playbackState,
  onSetVolume,
  onToggleVocal,
  onUpdateLyrics,
  isKhmerUi,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleCopy = (type: 'style' | 'lyrics' | 'both') => {
    if (!song) return;
    if (type === 'style') onCopyStyle(song);
    else if (type === 'lyrics') onCopyLyrics(song);
    else onCopyBoth(song);

    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  const styleCharCount = song ? song.style.length : 0;

  return (
    <>
      {/* Sticky Bottom Bar matching screenshot + Generate Music Hero Button & Player */}
      <footer className="sticky bottom-0 z-20 bg-[#141124]/95 backdrop-blur-md border-t border-[#2e264d] px-4 py-2.5 shadow-2xl flex flex-col gap-2">
        {/* Active Music Player Strip if audio is playing */}
        {isPlayingThisSong && song && (
          <div className="bg-gradient-to-r from-purple-950/80 via-[#211a3b] to-pink-950/80 border border-purple-500/40 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            {/* Visualizer & Song info */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Equalizer animation */}
              <div className="flex items-end gap-0.5 h-5 w-6 shrink-0">
                <span className="w-1 bg-pink-400 rounded-full animate-bounce [animation-delay:0.1s] h-3" />
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s] h-5" />
                <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s] h-4" />
                <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s] h-2" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate max-w-xs">
                    {song.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                    {playbackState.bpm} BPM
                  </span>
                </div>
                <div className="text-[11px] text-purple-300/80 font-mono">
                  {playbackState.formattedTime} / 02:30
                </div>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-2">
              {/* Vocal toggle */}
              <button
                type="button"
                onClick={onToggleVocal}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 border transition-all ${
                  playbackState.vocalEnabled
                    ? 'bg-pink-600 text-white border-pink-400 shadow-sm'
                    : 'bg-[#221c38] text-purple-300 border-[#3b325c] hover:text-white'
                }`}
                title="Toggle Vocal Speech recital over beat"
              >
                {playbackState.vocalEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3 text-slate-400" />}
                <span className="text-[10px]">{playbackState.vocalEnabled ? 'Vocal: On' : 'Vocal: Off'}</span>
              </button>

              {/* Volume Slider button */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className="p-1.5 rounded text-purple-300 hover:text-white hover:bg-purple-900/40"
                  title="Adjust Volume"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
                {showVolumeSlider && (
                  <div className="absolute bottom-8 right-0 bg-[#1e1a34] border border-[#3b325c] p-2 rounded-lg shadow-xl flex items-center gap-2 z-30">
                    <Volume2 className="w-3.5 h-3.5 text-purple-300" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={playbackState.volume}
                      onChange={(e) => onSetVolume(parseFloat(e.target.value))}
                      className="w-20 accent-pink-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Pause / Play toggle */}
              <button
                type="button"
                onClick={() => onPlayPreview(song)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black flex items-center gap-1 shadow-md shadow-cyan-950/40"
              >
                <Pause className="w-3 h-3 fill-current" />
                <span>{isKhmerUi ? 'ផ្អាក' : 'Pause'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Footer Control Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Info or Song Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <span className="text-base">👆</span>
              {song ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded bg-[#7c3aed] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {toKhmerNumber(song.index)}
                  </span>
                  <span className="font-bold text-white truncate max-w-[180px] sm:max-w-xs text-xs sm:text-sm">
                    {song.title}
                  </span>
                  <span className="hidden md:inline text-xs text-cyan-400 truncate max-w-sm">
                    ({song.style})
                  </span>
                </div>
              ) : (
                <span className="text-purple-300/80 text-xs sm:text-sm">
                  {isKhmerUi
                    ? 'ចុចប្រអប់បទណាមួយ ដើម្បីមើលពេញ'
                    : 'Click any song box to inspect full lyrics & audio preview'}
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions Row including HERO "Generate Music" Button */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            {/* HERO BUTTON: Generate Music */}
            <button
              type="button"
              disabled={!song}
              onClick={() => song && onPlayPreview(song)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                isPlayingThisSong
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white ring-2 ring-cyan-400/50 shadow-cyan-900/50 animate-pulse'
                  : 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white shadow-purple-950/60 hover:shadow-pink-900/40 ring-1 ring-pink-500/30'
              }`}
              title="Generate Music Preview & Beat for this song"
            >
              {isPlayingThisSong ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>{isKhmerUi ? '⏸️ ផ្អាកភ្លេង' : 'Pause Music'}</span>
                </>
              ) : (
                <>
                  <Music className="w-3.5 h-3.5 text-white animate-bounce" />
                  <span>{isKhmerUi ? '🎵 បង្កើតភ្លេង (Generate Music)' : '🎵 Generate Music'}</span>
                </>
              )}
            </button>

            {song && (
              /* View Full Lyrics button */
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#2a2247] hover:bg-[#352c59] text-purple-200 border border-[#43376e] flex items-center gap-1"
                title="Expand Full Lyrics Modal"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isKhmerUi ? 'មើលពេញ' : 'Expand'}</span>
              </button>
            )}

            {/* Quick Copy / Both (Green button) */}
            <button
              type="button"
              disabled={!song}
              onClick={() => handleCopy('both')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10b981] hover:bg-[#059669] text-white flex items-center gap-1.5 shadow-md shadow-emerald-950/40 disabled:opacity-40 transition-all active:scale-95"
            >
              {copiedType === 'both' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isKhmerUi ? 'ចម្លងរហ័ស' : 'Quick Copy'}</span>
            </button>

            {/* Copy Style (Cyan button) */}
            <button
              type="button"
              disabled={!song}
              onClick={() => handleCopy('style')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#06b6d4] hover:bg-[#0891b2] text-white flex items-center gap-1.5 shadow-md shadow-cyan-950/40 disabled:opacity-40 transition-all active:scale-95"
            >
              {copiedType === 'style' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Style</span>
            </button>

            {/* Copy Lyrics (Pink button) */}
            <button
              type="button"
              disabled={!song}
              onClick={() => handleCopy('lyrics')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ec4899] hover:bg-[#db2777] text-white flex items-center gap-1.5 shadow-md shadow-pink-950/40 disabled:opacity-40 transition-all active:scale-95"
            >
              {copiedType === 'lyrics' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Lyrics</span>
            </button>

            {/* Copy Both (Purple button) */}
            <button
              type="button"
              disabled={!song}
              onClick={() => handleCopy('both')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white flex items-center gap-1.5 shadow-md shadow-purple-950/40 disabled:opacity-40 transition-all active:scale-95"
            >
              {copiedType === 'both' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isKhmerUi ? 'ទាំងពីរ' : 'Both'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Expanded Modal for Full Lyrics Inspection & Music Generation */}
      {isModalOpen && song && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18152b] border border-[#3c3161] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#2e264d] bg-[#1d1933] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#7c3aed] text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {toKhmerNumber(song.index)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    {song.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-cyan-400 font-medium">{song.style}</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 text-[10px] border border-cyan-800/50">
                      {styleCharCount} chars
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-lg text-xs border transition-colors ${
                    isEditing
                      ? 'bg-pink-600 text-white border-pink-500'
                      : 'bg-[#2a2247] text-purple-200 border-[#3c3161] hover:text-white'
                  }`}
                  title="Edit lyrics"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg bg-[#2a2247] hover:bg-[#352c59] text-slate-300 hover:text-white border border-[#3c3161] transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Full Lyrics */}
            <div className="p-5 overflow-y-auto flex-1 font-sans text-slate-200">
              <div className="mb-4 p-3 rounded-xl bg-[#221c38] border border-[#372e59] flex items-center justify-between">
                <div className="text-xs text-purple-200">
                  <span className="font-semibold text-pink-400">Suno Prompt Formula: </span>
                  Paste Style into <span className="text-cyan-300 font-mono">Style of Music</span> and
                  Lyrics into <span className="text-pink-300 font-mono">Lyrics</span>.
                </div>
                <a
                  href="https://suno.com/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white"
                >
                  <span>Open Suno Create</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400">Edit Lyrics:</div>
                  <textarea
                    rows={16}
                    value={song.lyrics}
                    onChange={(e) => onUpdateLyrics(song.id, e.target.value)}
                    className="w-full bg-[#12101e] border border-purple-500/50 rounded-xl p-4 text-sm font-mono text-purple-100 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Full Lyrics &amp; Structural Tags
                  </div>
                  <pre className="font-sans whitespace-pre-wrap leading-relaxed text-sm bg-[#131020] p-5 rounded-xl border border-[#2b2545] text-slate-200 select-text">
                    {song.lyrics}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer with Generate Music & Actions */}
            <div className="p-4 border-t border-[#2e264d] bg-[#1d1933] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Generate Music in Modal */}
                <button
                  type="button"
                  onClick={() => onPlayPreview(song)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                    isPlayingThisSong
                      ? 'bg-cyan-500 text-black animate-pulse'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-400 hover:to-purple-500'
                  }`}
                >
                  {isPlayingThisSong ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingThisSong ? 'Pause Music' : '🎵 Generate & Play Music'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy('style')}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#06b6d4] hover:bg-[#0891b2] text-white flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Style</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy('lyrics')}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#ec4899] hover:bg-[#db2777] text-white flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Lyrics</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy('both')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white flex items-center gap-1.5 shadow-md shadow-purple-950/50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Copy Everything for Suno</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
