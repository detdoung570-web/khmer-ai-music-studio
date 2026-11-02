import React from 'react';
import {
  Check,
  Sparkles,
  Plus,
  Square,
  Copy,
  Download,
  Trash2,
  Music4,
  Settings2,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { GenerationConfig, LyricsLanguage, LyricsLength } from '../types';

interface SidebarProps {
  config: GenerationConfig;
  onChangeConfig: (newConfig: Partial<GenerationConfig>) => void;
  onGenerate: (append?: boolean) => void;
  onStop: () => void;
  onCopyAll: () => void;
  onSaveTxt: () => void;
  onClear: () => void;
  isGenerating: boolean;
  progressText: string;
  lastActionMessage: string;
  songCount: number;
  isKhmerUi: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  onChangeConfig,
  onGenerate,
  onStop,
  onCopyAll,
  onSaveTxt,
  onClear,
  isGenerating,
  progressText,
  lastActionMessage,
  songCount,
  isKhmerUi,
}) => {
  // ✅ "ไทย" removed from the array below
  const languages: LyricsLanguage[] = ['ខ្មែរ', 'English', '中文', 'តាមពាក្យគន្លឹះ'];
  const lengths: LyricsLength[] = ['ខ្លី', 'មធ្យម', 'វែង', 'វែងខ្លាំង'];

  const quickPresets = [
    {
      label: '😢 Sad Song',
      sub: isKhmerUi ? 'បទកម្សត់' : 'Sorrow',
      prompt: 'Sad Song',
    },
    {
      label: '💃 Khmer Modern Kantrum Fast Tempo Dance',
      sub: isKhmerUi ? 'កន្ទ្រឹមញាក់លឿន' : 'Fast Dance',
      prompt: 'Khmer Modern Kantrum Fast Tempo Dance',
    },
    {
      label: '💖 Sweet Romantic Love Ballad',
      sub: isKhmerUi ? 'ស្នេហាផ្អែមល្ហែម' : 'Romantic Ballad',
      prompt: 'Sweet Romantic Love Ballad',
    },
    {
      label: '☕ Rainy Night Coffee Shop LoFi Acoustic',
      sub: isKhmerUi ? 'កាហ្វេរាត្រីភ្លៀងធ្លាក់' : 'Chill Lofi R&B',
      prompt: 'Rainy Night Coffee Shop LoFi Acoustic',
    },
    {
      label: '🎉 Uplifting Joyful Wedding Celebration Song',
      sub: isKhmerUi ? 'បទមង្គលការសប្បាយ' : 'Joyful Wedding',
      prompt: 'Uplifting Joyful Wedding Celebration Song',
    },
  ];

  return (
    <aside className="w-full lg:w-[350px] shrink-0 bg-[#161327] border-r border-[#2b2545] p-4 flex flex-col gap-4 text-slate-200 text-xs overflow-y-auto">
      {/* 1. Model Selector */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Settings2 className="w-3.5 h-3.5 text-purple-400" />
          <span>{isKhmerUi ? 'ម៉ូដែល' : 'Model'}</span>
          <span className="ml-auto text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <Check className="w-3 h-3" />
            {isKhmerUi ? 'ភ្ជាប់រួច' : 'Connected'}
          </span>
        </label>
        <div className="relative">
          <select
            value={config.model}
            onChange={(e) => onChangeConfig({ model: e.target.value })}
            className="w-full bg-[#1e1a34] border border-[#3b325c] rounded-lg px-3 py-2 text-xs text-slate-100 appearance-none focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended / High Quality)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast / Low Latency)</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-400">
            ▼
          </div>
        </div>
      </div>

      {/* 2. Prompt Keyword Area */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Music4 className="w-3.5 h-3.5 text-pink-400" />
          <span>{isKhmerUi ? 'ចង់បានបទអី? (វាយពាក្យ)' : 'Song Theme / Keywords'}</span>
        </label>
        <textarea
          rows={3}
          value={config.prompt}
          onChange={(e) => onChangeConfig({ prompt: e.target.value })}
          placeholder={isKhmerUi ? 'sad song' : 'e.g. sad song, heartbreak, rainy night acoustic'}
          className="w-full bg-[#1e1a34] border border-[#3b325c] rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none font-sans"
        />
        <p className="text-[11px] text-purple-300/70 leading-relaxed">
          {isKhmerUi
            ? 'ឧ. បទស្នេហា ផ្អែម ព្រាត់ប្រាស់ ភ្លៀង ធ្លាក់ចំបើង ឬ បទរៀបការរាំកម្សាន្តសប្បាយ'
            : 'e.g. sweet love, heartbreak, rain, farm harvest, or fun wedding dance song'}
        </p>

        {/* Quick Presets */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-medium text-purple-300/80 flex items-center justify-between">
            <span>{isKhmerUi ? '⚡ រចនាប័ទ្មស្វ័យប្រវត្តិនីមួយៗ (៥ ប្រភេទ):' : '⚡ 5 Auto-Themed Styles:'}</span>
            <span className="text-[10px] text-pink-400">ខ្មែរ Auto</span>
          </div>
          <div className="flex flex-col gap-1">
            {quickPresets.map((p) => {
              const isActive = config.prompt.trim().toLowerCase() === p.prompt.trim().toLowerCase();
              return (
                <button
                  key={p.prompt}
                  type="button"
                  onClick={() => onChangeConfig({ prompt: p.prompt, language: 'ខ្មែរ' })}
                  className={`text-left px-2 py-1.5 rounded-lg border transition-all flex items-center justify-between text-[11px] ${
                    isActive
                      ? 'bg-purple-900/60 border-pink-500 text-white shadow-sm'
                      : 'bg-[#1e1a34] text-purple-200 border-[#3b325c] hover:border-purple-400 hover:text-white'
                  }`}
                >
                  <span className="font-medium truncate">{p.label}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 shrink-0 ml-1">
                    {p.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Lyrics Language */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">
          {isKhmerUi ? 'ភាសា Lyrics' : 'Lyrics Language'}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {languages.map((lang) => {
            const isSelected = config.language === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => onChangeConfig({ language: lang })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#d97706] text-white shadow-md shadow-amber-900/40 font-semibold'
                    : 'bg-[#221c38] text-slate-300 border border-[#3b325c] hover:bg-[#2b2447] hover:text-white'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Lyrics Length */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">
          {isKhmerUi ? 'ប្រវែង Lyrics' : 'Lyrics Length'}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {lengths.map((len) => {
            const isSelected = config.lengthType === len;
            return (
              <button
                key={len}
                type="button"
                onClick={() => onChangeConfig({ lengthType: len })}
                className={`py-1.5 text-center rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#d97706] text-white shadow-md shadow-amber-900/40 font-semibold'
                    : 'bg-[#221c38] text-slate-300 border border-[#3b325c] hover:bg-[#2b2447] hover:text-white'
                }`}
              >
                {len}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Batch Count & Style Limit */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">
            {isKhmerUi ? 'ចំនួនបទ' : 'Song Count'}
          </label>
          <div className="flex items-center bg-[#1e1a34] border border-[#3b325c] rounded-lg overflow-hidden">
            <input
              type="number"
              min={1}
              max={50}
              value={config.count}
              onChange={(e) =>
                onChangeConfig({ count: Math.max(1, Math.min(50, parseInt(e.target.value, 10) || 1)) })
              }
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">
            {isKhmerUi ? 'Style ≤ (តួអក្សរ)' : 'Style ≤ (Chars)'}
          </label>
          <div className="flex items-center bg-[#1e1a34] border border-[#3b325c] rounded-lg overflow-hidden">
            <input
              type="number"
              min={50}
              max={250}
              value={config.maxStyleLength}
              onChange={(e) =>
                onChangeConfig({
                  maxStyleLength: Math.max(50, Math.min(250, parseInt(e.target.value, 10) || 120)),
                })
              }
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 6. Big Pink Action Button */}
      <button
        type="button"
        disabled={isGenerating}
        onClick={() => onGenerate(false)}
        className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#ec4899] via-[#f43f5e] to-[#db2777] hover:from-[#f472b6] hover:to-[#e11d48] active:scale-[0.98] transition-all shadow-lg shadow-pink-900/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span>{isKhmerUi ? 'កំពុងបង្កើត...' : 'Generating...'}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-white animate-bounce" />
            <span>{isKhmerUi ? '✨ បង្កើតបទ' : '✨ Generate Songs'}</span>
          </>
        )}
      </button>

      {/* 7. Secondary Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => onGenerate(true)}
            className="flex-1 py-1.5 px-2 rounded-lg bg-[#6d28d9] hover:bg-[#7c3aed] text-white text-xs font-medium flex items-center justify-center gap-1 transition-all disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isKhmerUi ? '+ បង្កើតថែម' : '+ Generate More'}</span>
          </button>

          <label className="flex items-center gap-1.5 text-[11px] text-purple-200 cursor-pointer select-none bg-[#221c38] px-2 py-1.5 rounded-lg border border-[#3b325c]">
            <input
              type="checkbox"
              checked={config.autoContinuous}
              onChange={(e) => onChangeConfig({ autoContinuous: e.target.checked })}
              className="accent-pink-500 rounded cursor-pointer"
            />
            <span>{isKhmerUi ? 'បង្កើតបន្តបន្ទាប់ (Auto)' : 'Auto Loop'}</span>
          </label>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            disabled={!isGenerating}
            onClick={onStop}
            className="py-1.5 px-2 rounded-lg bg-[#991b1b] hover:bg-[#b91c1c] text-white text-xs font-medium flex items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:hover:bg-[#991b1b]"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>{isKhmerUi ? 'បញ្ឈប់' : 'Stop'}</span>
          </button>

          <button
            type="button"
            onClick={onCopyAll}
            className="py-1.5 px-2 rounded-lg bg-[#1f2937] hover:bg-[#374151] text-purple-200 text-xs font-medium border border-[#3b325c] flex items-center justify-center gap-1 transition-all"
            title="Copy all lyrics and styles formatted"
          >
            <Copy className="w-3 h-3" />
            <span>{isKhmerUi ? 'Copy ទាំងអស់' : 'Copy All'}</span>
          </button>

          <button
            type="button"
            onClick={onSaveTxt}
            className="py-1.5 px-2 rounded-lg bg-[#1f2937] hover:bg-[#374151] text-purple-200 text-xs font-medium border border-[#3b325c] flex items-center justify-center gap-1 transition-all"
            title="Download text file formatted for Suno"
          >
            <Download className="w-3 h-3" />
            <span>{isKhmerUi ? 'Save .txt' : 'Save .txt'}</span>
          </button>
        </div>
      </div>

      {/* 8. Status & History banner */}
      <div className="mt-auto pt-3 border-t border-[#2b2545] space-y-2">
        {lastActionMessage && (
          <div className="bg-[#10b981]/15 border border-[#10b981]/30 rounded-lg px-2.5 py-1.5 text-[11px] text-[#34d399] flex items-center gap-1.5 animate-fadeIn">
            <span>📋</span>
            <span className="truncate">{lastActionMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-purple-300/80">
          <div className="flex items-center gap-1.5">
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-400" />
            ) : (
              <span>🕒</span>
            )}
            <span>
              {progressText ||
                (isKhmerUi
                  ? `មានស្រាប់ ${songCount} បទ`
                  : `${songCount} songs loaded`)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors"
            title="Clear list"
          >
            <Trash2 className="w-3 h-3" />
            <span>{isKhmerUi ? 'លុបប្រវត្តិ' : 'Clear'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
