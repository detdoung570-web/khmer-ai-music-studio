import { Song, LyricsLanguage, LyricsLength } from '../types';
import { UNIQUE_30_KHMER_SAD_SONGS } from '../data/uniqueKhmerSadSongs';
import { UNIQUE_30_KHMER_KANTRUM_SONGS } from '../data/uniqueKhmerKantrumSongs';
import { UNIQUE_30_KHMER_ROMANTIC_SONGS } from '../data/uniqueKhmerRomanticSongs';
import { UNIQUE_30_KHMER_LOFI_SONGS } from '../data/uniqueKhmerLofiSongs';
import { UNIQUE_30_KHMER_WEDDING_SONGS } from '../data/uniqueKhmerWeddingSongs';

interface GenerationParams {
  prompt: string;
  language: LyricsLanguage;
  lengthType: LyricsLength;
  count: number;
  maxStyleLength: number;
}

// Unique English / World templates for non-Khmer requests
const UNIQUE_30_ENGLISH_SONGS = [
  {
    title: 'Whispers in the Amber Glow',
    style: 'indie folk, intimate acoustic, 72 BPM, male soft raspy vocals, acoustic guitar, cello, gentle stomp',
    snippet: 'Walking through the amber light / Watching autumn leaves drift by / Whispering your name...',
    lyrics: `[Intro - Gentle fingerpicked acoustic guitar]

[Verse 1]
Walking through the amber light
Watching autumn leaves drift by
Whispering your name into the quiet breeze
Every step reminds me of the memories

[Chorus]
Whispers in the amber glow
Tell me things I used to know
Hold the warmth before the cold descends
Where the endless river bends

[Outro]
Soft acoustic chords fade into evening mist...`,
  },
  {
    title: 'Neon Shadows in the Fog',
    style: 'dark synthwave, cyberpunk night, 108 BPM, male vocoder, analog arpeggiator, gated reverb snare, moog bass',
    snippet: 'Reflections on the asphalt glow / Raindrops falling in slow mo / Chasing neon shadows...',
    lyrics: `[Intro - Pulsing analog synth arpeggio]

[Verse 1]
Reflections on the asphalt glow
Raindrops falling in slow mo
Chasing neon shadows through the haze
Lost inside the digital maze

[Chorus]
Neon shadows in the fog
Burning through the midnight smog
Running fast to beat the dawn
Before the final spark is gone

[Outro]
Arpeggios trail off into the digital rain...`,
  },
  {
    title: 'Coffee Rings on Paper Planes',
    style: 'lo-fi bedroom pop, nostalgic chill, 82 BPM, female breathy vocals, rhodes piano, vinyl crackle, mellow bass',
    snippet: 'Folding letters into wings / Stained with morning coffee rings / Throwing them across the floor...',
    lyrics: `[Intro - Rhodes chords with vinyl record crackle]

[Verse 1]
Folding letters into wings
Stained with morning coffee rings
Throwing them across the empty floor
Waiting for a knock upon my door

[Chorus]
Paper planes that never fly
Drifting under quiet skies
Holding all the thoughts I cannot say
As the daylight fades away

[Outro]
Mellow rhodes chords fade into warm static...`,
  },
  {
    title: 'Rust and Gasoline',
    style: 'alt-rock, 90s grunge ballad, 116 BPM, male gritty passionate lead, distorted power chords, heavy crash drums',
    snippet: 'Broken highway stretching out ahead / Counting miles where angels fear to tread / Smell of rust...',
    lyrics: `[Intro - Distorted bass riff and crash cymbals]

[Verse 1]
Broken highway stretching out ahead
Counting miles where angels fear to tread
Smell of rust and burning gasoline
Fading pictures from a movie screen

[Chorus]
Rust and gasoline in my veins
Breaking all the heavy rusty chains
Scream into the howling western wind
Where the fire of the soul begins

[Outro]
Screaming electric guitar feedback resolves into silence...`,
  },
];

export function generateCreativeSongs(
  params: GenerationParams,
  startIndex: number = 0,
  batchCount: number = 10
): Song[] {
  const { prompt, language, lengthType, maxStyleLength } = params;

  const isKhmer = language === 'ខ្មែរ' || prompt.includes('ខ្មែរ') || prompt.toLowerCase().includes('khmer');

  // Detect 5 specific requested themes
  const isSadSong = /sad\s*song|sad|heartbreak|កម្សត់|ទឹកភ្នែក|ព្រាត់/i.test(prompt);
  const isKantrum = /kantrum|កន្ទ្រឹម|fast tempo|dance|រាំ|កន្ត្រាក់/i.test(prompt);
  const isRomantic = /sweet\s*romantic|romantic|love\s*ballad|រ៉ូមែនទិក|ផ្អែមល្ហែម|ស្នេហា/i.test(prompt);
  const isLofi = /coffee|lofi|lo-fi|rainy\s*night|chill|កាហ្វេ|ភ្លៀង/i.test(prompt);
  const isWedding = /wedding|celebration|joyful|អាពាហ៍ពិពាហ៍|មង្គលការ|ភ្លេងការ/i.test(prompt);

  const generated: Song[] = [];

  for (let i = 0; i < batchCount; i++) {
    const globalIdx = startIndex + i + 1;

    let title = '';
    let styleCandidate = '';
    let lyrics = '';
    let previewSnippet = '';

    if (isKhmer && isWedding) {
      // -----------------------------------------------------------------
      // THEME 5: UPLIFTING JOYFUL WEDDING CELEBRATION SONG
      // -----------------------------------------------------------------
      const template = UNIQUE_30_KHMER_WEDDING_SONGS[(globalIdx - 1) % UNIQUE_30_KHMER_WEDDING_SONGS.length];
      const cycle = Math.floor((globalIdx - 1) / UNIQUE_30_KHMER_WEDDING_SONGS.length);

      title = template.title + (cycle > 0 ? ` (បទទី ${globalIdx})` : '');
      styleCandidate = template.style;
      previewSnippet = template.snippet;

      if (lengthType === 'ខ្លី') {
        lyrics = template.lyrics.short;
      } else if (lengthType === 'វែង' || lengthType === 'វែងខ្លាំង') {
        lyrics = template.lyrics.long;
      } else {
        lyrics = template.lyrics.medium;
      }

    } else if (isKhmer && isLofi) {
      // -----------------------------------------------------------------
      // THEME 4: RAINY NIGHT COFFEE SHOP LOFI ACOUSTIC
      // -----------------------------------------------------------------
      const template = UNIQUE_30_KHMER_LOFI_SONGS[(globalIdx - 1) % UNIQUE_30_KHMER_LOFI_SONGS.length];
      const cycle = Math.floor((globalIdx - 1) / UNIQUE_30_KHMER_LOFI_SONGS.length);

      title = template.title + (cycle > 0 ? ` (បទទី ${globalIdx})` : '');
      styleCandidate = template.style;
      previewSnippet = template.snippet;

      if (lengthType === 'ខ្លី') {
        lyrics = template.lyrics.short;
      } else if (lengthType === 'វែង' || lengthType === 'វែងខ្លាំង') {
        lyrics = template.lyrics.long;
      } else {
        lyrics = template.lyrics.medium;
      }

    } else if (isKhmer && isRomantic) {
      // -----------------------------------------------------------------
      // THEME 3: SWEET ROMANTIC LOVE BALLAD
      // -----------------------------------------------------------------
      const template = UNIQUE_30_KHMER_ROMANTIC_SONGS[(globalIdx - 1) % UNIQUE_30_KHMER_ROMANTIC_SONGS.length];
      const cycle = Math.floor((globalIdx - 1) / UNIQUE_30_KHMER_ROMANTIC_SONGS.length);

      title = template.title + (cycle > 0 ? ` (បទទី ${globalIdx})` : '');
      styleCandidate = template.style;
      previewSnippet = template.snippet;

      if (lengthType === 'ខ្លី') {
        lyrics = template.lyrics.short;
      } else if (lengthType === 'វែង' || lengthType === 'វែងខ្លាំង') {
        lyrics = template.lyrics.long;
      } else {
        lyrics = template.lyrics.medium;
      }

    } else if (isKhmer && isKantrum) {
      // -----------------------------------------------------------------
      // THEME 2: KHMER MODERN KANTRUM FAST TEMPO DANCE
      // -----------------------------------------------------------------
      const template = UNIQUE_30_KHMER_KANTRUM_SONGS[(globalIdx - 1) % UNIQUE_30_KHMER_KANTRUM_SONGS.length];
      const cycle = Math.floor((globalIdx - 1) / UNIQUE_30_KHMER_KANTRUM_SONGS.length);

      title = template.title + (cycle > 0 ? ` (វគ្គ ${globalIdx})` : '');
      styleCandidate = template.style;
      previewSnippet = template.snippet;

      if (lengthType === 'ខ្លី') {
        lyrics = template.lyrics.short;
      } else if (lengthType === 'វែង' || lengthType === 'វែងខ្លាំង') {
        lyrics = template.lyrics.long;
      } else {
        lyrics = template.lyrics.medium;
      }

    } else if (isKhmer && isSadSong) {
      // -----------------------------------------------------------------
      // THEME 1: SAD SONG (បទកម្សត់)
      // -----------------------------------------------------------------
      const template = UNIQUE_30_KHMER_SAD_SONGS[(globalIdx - 1) % UNIQUE_30_KHMER_SAD_SONGS.length];
      const cycle = Math.floor((globalIdx - 1) / UNIQUE_30_KHMER_SAD_SONGS.length);

      title = template.title + (cycle > 0 ? ` (បទទី ${globalIdx})` : '');
      styleCandidate = template.style;
      previewSnippet = template.snippet;

      if (lengthType === 'ខ្លី') {
        lyrics = template.lyrics.short;
      } else if (lengthType === 'វែង' || lengthType === 'វែងខ្លាំង') {
        lyrics = template.lyrics.long;
      } else {
        lyrics = template.lyrics.medium;
      }

    } else {
      // -----------------------------------------------------------------
      // GENERAL / ENGLISH / WORLD
      // -----------------------------------------------------------------
      const template = UNIQUE_30_ENGLISH_SONGS[(globalIdx - 1) % UNIQUE_30_ENGLISH_SONGS.length];
      const cycle = Math.floor((globalIdx - 1) / UNIQUE_30_ENGLISH_SONGS.length);

      title = template.title + (cycle > 0 ? ` (Vol ${cycle + 1})` : '');
      styleCandidate = template.style;
      lyrics = template.lyrics;
      previewSnippet = template.snippet;
    }

    // Enforce maxStyleLength constraint
    if (styleCandidate.length > maxStyleLength) {
      styleCandidate = styleCandidate.substring(0, maxStyleLength - 3) + '...';
    }

    generated.push({
      id: `song-${Date.now()}-${globalIdx}`,
      index: globalIdx,
      title,
      style: styleCandidate,
      lyrics,
      previewSnippet,
    });
  }

  return generated;
}
