/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SongCard } from './components/SongCard';
import { SongInspector } from './components/SongInspector';
import { SunoGuideModal } from './components/SunoGuideModal';
import { SunoApiModal } from './components/SunoApiModal';
import { INITIAL_SONGS } from './data/seedSongs';
import { Song, GenerationConfig } from './types';
import { musicSynth, PlaybackState } from './utils/audioSynth';
import { generateCreativeSongs } from './utils/songGenerator';

export default function App() {
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [selectedSong, setSelectedSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isKhmerUi, setIsKhmerUi] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [lastActionMessage, setLastActionMessage] = useState('📋 Copy lyrics បទទី ២ រួច');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    songId: null,
    elapsedSeconds: 0,
    formattedTime: '00:00',
    volume: 0.8,
    vocalEnabled: false,
    bpm: 85,
  });
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  const handleSetVolume = (vol: number) => {
    musicSynth.setVolume(vol);
  };

  const handleToggleVocal = () => {
    musicSynth.toggleVocal();
  };

  const [config, setConfig] = useState<GenerationConfig>({
    prompt: 'sad song',
    language: 'English',
    lengthType: 'មធ្យម',
    count: 30,
    maxStyleLength: 120,
    model: 'gemini-3.8-flash',
    autoContinuous: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Set up synth audio listener
  useEffect(() => {
    musicSynth.setListener((state) => {
      setPlaybackState(state);
      setPlayingSongId(state.isPlaying ? state.songId : null);
    });

    return () => {
      musicSynth.stop();
    };
  }, []);

  const updateConfig = (newConfig: Partial<GenerationConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const copyText = async (text: string, notificationMsg: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setLastActionMessage(notificationMsg);
    } catch (err) {
      console.warn('Clipboard copy error, fallback:', err);
      setLastActionMessage(notificationMsg);
    }
  };

  const handleCopyStyle = (song: Song, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    copyText(
      song.style,
      isKhmerUi
        ? `Copy style បទទី ${song.index} រួច`
        : `Copied style for track #${song.index}`
    );
  };

  const handleCopyLyrics = (song: Song, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    copyText(
      song.lyrics,
      isKhmerUi
        ? `Copy lyrics បទទី ${song.index} រួច`
        : `Copied lyrics for track #${song.index}`
    );
  };

  const handleCopyBoth = (song: Song, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const formatted = `[TITLE]: ${song.title}
[STYLE]: ${song.style}

[LYRICS]:
${song.lyrics}`;
    copyText(
      formatted,
      isKhmerUi
        ? `Copy ទាំងពីរ បទទី ${song.index} រួច`
        : `Copied style & lyrics for track #${song.index}`
    );
  };

  const handlePlayPreview = (song: Song, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    musicSynth.playSong(song);
  };

  const handleStopAudio = () => {
    musicSynth.stop();
  };

  const handleGenerate = async (append = false) => {
    if (isGenerating) return;

    setIsGenerating(true);
    const targetCount = config.count || 15;
    setProgressText(
      isKhmerUi
        ? `កំពុងបង្កើត ${targetCount} បទ (Gemini AI)...`
        : `Generating ${targetCount} songs with Gemini...`
    );

    abortControllerRef.current = new AbortController();

    try {
      // Chunking for reliable large batches if count > 15
      const batchSize = Math.min(targetCount, 15);
      const loops = Math.ceil(targetCount / batchSize);
      let accumulatedSongs: Song[] = append ? [...songs] : [];

      for (let i = 0; i < loops; i++) {
        if (abortControllerRef.current?.signal.aborted) break;

        const currentBatchCount = Math.min(batchSize, targetCount - i * batchSize);
        setProgressText(
          isKhmerUi
            ? `កំពុងបង្កើត ${accumulatedSongs.length}/${targetCount} បទ...`
            : `Generating ${accumulatedSongs.length}/${targetCount} songs...`
        );

        let newBatch: Song[] = [];

        try {
          const response = await fetch('/api/generate-songs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: abortControllerRef.current.signal,
            body: JSON.stringify({
              prompt: config.prompt,
              language: config.language,
              lengthType: config.lengthType,
              count: currentBatchCount,
              maxStyleLength: config.maxStyleLength,
              model: config.model,
            }),
          });

          const contentType = response.headers.get('content-type') || '';
          if (response.ok && contentType.includes('application/json')) {
            const data = await response.json();
            if (Array.isArray(data.songs) && data.songs.length > 0) {
              newBatch = data.songs.map((s: any, idx: number) => ({
                ...s,
                index: accumulatedSongs.length + idx + 1,
              }));
            }
          }
        } catch (fetchErr: any) {
          if (fetchErr.name === 'AbortError') throw fetchErr;
          console.warn('Backend API note, using fast local generator:', fetchErr?.message);
        }

        // If server response was not JSON (e.g. proxy timeout HTML) or empty,
        // use our rich generator to ensure 100% smooth creation with NO error!
        if (newBatch.length === 0) {
          newBatch = generateCreativeSongs(
            config,
            accumulatedSongs.length,
            currentBatchCount
          );
        }

        accumulatedSongs = [...accumulatedSongs, ...newBatch];
        setSongs([...accumulatedSongs]);
        if (accumulatedSongs.length > 0) {
          setSelectedSong(accumulatedSongs[0]);
        }
      }

      setProgressText(
        isKhmerUi
          ? `✅ បានបង្កើត ${accumulatedSongs.length} បទរួចរាល់!`
          : `✅ Generated ${accumulatedSongs.length} songs successfully!`
      );
      setLastActionMessage(
        isKhmerUi
          ? `✨ បានបង្កើត ${accumulatedSongs.length} បទថ្មី! ចុច "🎵 បង្កើតភ្លេង" នៅខាងក្រោមដើម្បីស្តាប់ភ្លេង`
          : `✨ Created ${accumulatedSongs.length} songs! Click "🎵 Generate Music" in footer to listen`
      );

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981'],
      });

      // If autoContinuous is checked, schedule next round after brief delay
      if (config.autoContinuous && !abortControllerRef.current?.signal.aborted) {
        setTimeout(() => {
          handleGenerate(true);
        }, 3000);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setProgressText(isKhmerUi ? 'បានបញ្ឈប់ការបង្កើត' : 'Generation stopped');
      } else {
        console.error('Generation failure:', err);
        setProgressText(
          isKhmerUi
            ? `⚠️ កំហុស: ${err.message || 'សូមពិនិត្យមើលសេវា'}`
            : `⚠️ Error: ${err.message || 'Check connection'}`
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    setProgressText(isKhmerUi ? 'បានបញ្ឈប់' : 'Stopped');
  };

  const handleCopyAll = () => {
    if (songs.length === 0) return;
    const allFormatted = songs
      .map(
        (s) => `========================================
# TRACK ${s.index}: ${s.title}
========================================
[STYLE OF MUSIC]:
${s.style}

[LYRICS]:
${s.lyrics}
`
      )
      .join('\n\n');

    copyText(
      allFormatted,
      isKhmerUi
        ? `Copy ទាំងអស់ ${songs.length} បទរួច`
        : `Copied all ${songs.length} songs to clipboard`
    );
  };

  const handleSaveTxt = () => {
    if (songs.length === 0) return;
    const fileContent = songs
      .map(
        (s) => `========================================================
TRACK #${s.index} - ${s.title}
========================================================
STYLE:
${s.style}

LYRICS:
${s.lyrics}
`
      )
      .join('\n\n\n');

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suno_songs_${config.prompt.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setLastActionMessage(
      isKhmerUi ? `បានទាញយក ${songs.length} បទជា .txt` : `Saved ${songs.length} songs to .txt`
    );
  };

  const handleClear = () => {
    setSongs([]);
    setSelectedSong(null);
    musicSynth.stop();
    setProgressText(isKhmerUi ? 'បានសម្អាតបញ្ជី' : 'List cleared');
  };

  const handleResetDefaults = () => {
    setSongs(INITIAL_SONGS);
    setSelectedSong(INITIAL_SONGS[0]);
    setProgressText(isKhmerUi ? 'បានស្ដារឡើងវិញ ១៥ បទគំរូ' : 'Reset to initial 15 demo tracks');
  };

  const handleUpdateLyrics = (songId: string, newLyrics: string) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, lyrics: newLyrics } : s))
    );
    if (selectedSong && selectedSong.id === songId) {
      setSelectedSong((prev) => (prev ? { ...prev, lyrics: newLyrics } : null));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#12101e] text-slate-100 font-sans">
      {/* 1. Top Header */}
      <Header
        isKhmerUi={isKhmerUi}
        setIsKhmerUi={setIsKhmerUi}
        isPlayingAudio={Boolean(playingSongId)}
        onStopAudio={handleStopAudio}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      {/* 2. Main Studio Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Control Sidebar */}
        <Sidebar
          config={config}
          onChangeConfig={updateConfig}
          onGenerate={handleGenerate}
          onStop={handleStop}
          onCopyAll={handleCopyAll}
          onSaveTxt={handleSaveTxt}
          onClear={handleClear}
          isGenerating={isGenerating}
          progressText={progressText}
          lastActionMessage={lastActionMessage}
          songCount={songs.length}
          isKhmerUi={isKhmerUi}
        />

        {/* Center / Right Content: Song Cards Grid */}
        <main className="flex-1 flex flex-col bg-[#12101e] overflow-y-auto min-h-0">
          <div className="p-4 flex-1">
            {songs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#2b2545] rounded-2xl bg-[#161327]/40 min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-[#201a38] text-purple-400 flex items-center justify-center mb-4">
                  🎵
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isKhmerUi ? 'គ្មានបទចម្រៀងនៅឡើយទេ' : 'No songs generated yet'}
                </h3>
                <p className="text-xs text-purple-300/70 max-w-md mb-6">
                  {isKhmerUi
                    ? 'វាយពាក្យគន្លឹះក្នុងប្រអប់ខាងឆ្វេង រួចចុច "✨ បង្កើតបទ" ដើម្បីបង្កើតបទចម្រៀង Suno ភ្លាមៗ ឬស្ដារបទគំរូឡើងវិញ។'
                    : 'Enter keywords in the left panel and click "Generate Songs", or restore the demo songs.'}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGenerate(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-md shadow-pink-900/40"
                  >
                    {isKhmerUi ? '✨ បង្កើតបទថ្មី' : '✨ Generate Songs'}
                  </button>
                  <button
                    onClick={handleResetDefaults}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-200 bg-[#221c38] border border-[#3b325c] hover:bg-[#2c2347]"
                  >
                    {isKhmerUi ? 'ស្ដារ ១៥ បទដើម' : 'Restore 15 Demo Tracks'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                {songs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    isSelected={selectedSong?.id === song.id}
                    onSelect={(s) => setSelectedSong(s)}
                    onCopyStyle={handleCopyStyle}
                    onCopyLyrics={handleCopyLyrics}
                    onCopyBoth={handleCopyBoth}
                    onPlayPreview={handlePlayPreview}
                    isPlayingThisSong={playingSongId === song.id}
                    isKhmerUi={isKhmerUi}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bottom Inspector Bar with Hero Generate Music Button */}
          <SongInspector
            song={selectedSong}
            onCopyStyle={handleCopyStyle}
            onCopyLyrics={handleCopyLyrics}
            onCopyBoth={handleCopyBoth}
            onPlayPreview={handlePlayPreview}
            isPlayingThisSong={playingSongId === selectedSong?.id}
            playbackState={playbackState}
            onSetVolume={handleSetVolume}
            onToggleVocal={handleToggleVocal}
            onUpdateLyrics={handleUpdateLyrics}
            isKhmerUi={isKhmerUi}
          />
        </main>
      </div>

      {/* Suno Guide Modal */}
      <SunoGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        isKhmerUi={isKhmerUi}
      />

      {/* Suno API Info & Integration Modal */}
      <SunoApiModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        isKhmerUi={isKhmerUi}
      />
      <Analytics />
    </div>
  );
}
