export interface Song {
  id: string;
  index: number;
  title: string;
  style: string;
  lyrics: string;
  previewSnippet: string;
  bpm?: number;
  language?: string;
  isFavorite?: boolean;
}

export type LyricsLanguage = 'ខ្មែរ' | 'English' | '中文' | 'ไทย' | 'តាមពាក្យគន្លឹះ';
export type LyricsLength = 'ខ្លី' | 'មធ្យម' | 'វែង' | 'វែងខ្លាំង';

export interface GenerationConfig {
  prompt: string;
  language: LyricsLanguage;
  lengthType: LyricsLength;
  count: number;
  maxStyleLength: number;
  model: string;
  autoContinuous: boolean;
}
