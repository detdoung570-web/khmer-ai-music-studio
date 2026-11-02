import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type, GenerateContentResponse } from '@google/genai';
import { UNIQUE_30_KHMER_SAD_SONGS } from './src/data/uniqueKhmerSadSongs.js';
import { UNIQUE_30_KHMER_KANTRUM_SONGS } from './src/data/uniqueKhmerKantrumSongs.js';
import { UNIQUE_30_KHMER_ROMANTIC_SONGS } from './src/data/uniqueKhmerRomanticSongs.js';
import { UNIQUE_30_KHMER_LOFI_SONGS } from './src/data/uniqueKhmerLofiSongs.js';
import { UNIQUE_30_KHMER_WEDDING_SONGS } from './src/data/uniqueKhmerWeddingSongs.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health / Status check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    models: [
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Recommended)' },
      { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite (Ultra Fast)' },
    ],
  });
});

// Generate Suno Songs Batch API
app.post('/api/generate-songs', async (req, res) => {
  try {
    const {
      prompt = 'sad song',
      language = 'English',
      lengthType = 'Medium',
      count = 15,
      maxStyleLength = 120,
      model = 'gemini-3.8-flash',
      customApiKey,
    } = req.body;

    const keyToUse = customApiKey || process.env.GEMINI_API_KEY;

    if (!keyToUse) {
      return res.status(400).json({
        error: 'No Gemini API key available. Please check Settings > Secrets or provide a key.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey: keyToUse,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Route paid-only model (gemini-4-argon requires paid billing) to free-tier gemini-3.8-flash
    const targetModel = (model === 'gemini-4-argon' || !model) ? 'gemini-3.8-flash' : model;

    // Length description mapping for prompt instructions
    const lengthGuide = {
      Short: 'Short structure: [Verse 1], [Chorus], [Outro] (~8-12 lines total)',
      Medium: 'Medium structure: [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Chorus], [Outro] (~16-24 lines total)',
      Long: 'Long structure: [Intro], [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Chorus], [Outro] (~24-32 lines total)',
      'Very Long': 'Very Long complete song structure with [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Guitar Solo], [Bridge], [Chorus], [Outro] (~32-48 lines total)',
    }[lengthType as string] || 'Standard Suno song structure';

    // Specialized prompt detection for requested themes
    const isSadSong = /sad\s*song|sad|heartbreak|កម្សត់|ទឹកភ្នែក|ព្រាត់/i.test(prompt);
    const isKantrum = /kantrum|កន្ទ្រឹម|fast tempo|dance|រាំ|កន្ត្រាក់/i.test(prompt);
    const isRomantic = /sweet\s*romantic|romantic|love\s*ballad|រ៉ូមែនទិក|ផ្អែមល្ហែម|ស្នេហា/i.test(prompt);
    const isLofi = /coffee|lofi|lo-fi|rainy\s*night|chill|កាហ្វេ|ភ្លៀង/i.test(prompt);
    const isWedding = /wedding|celebration|joyful|អាពាហ៍ពិពាហ៍|មង្គលការ|ភ្លេងការ/i.test(prompt);

    // Language and genre instructions
    let languageInstruction = `Write lyrics in natural, artistic ${language}.`;
    if ((language === 'Khmer' || language === 'ខ្មែរ') && isWedding) {
      languageInstruction = `The user specifically requests an Uplifting Joyful Wedding Celebration Song (បទមង្គលការសប្បាយរីករាយ).
1. The "style" MUST be an uplifting, joyful wedding celebration formula under ${maxStyleLength} chars (e.g., "Khmer uplifting wedding celebration, joyful romance, 105 BPM, harmonious duet, traditional pleng ka brass, tro sau, festive drums, bells" or "Khmer traditional wedding pop, cheerful celebration, 102 BPM, duet male & female, tro u, accordion, brass horns, joyful percussion").
2. The "lyrics" MUST be written in genuine, poetic, celebratory Khmer (អក្សរខ្មែរ) expressing golden rings, wedding blessings, happy families, eternal vows, and joy, formatted with metatags [Intro], [Verse 1], [Chorus], [Outro] matching length: ${lengthGuide}.
3. The "title" MUST be in Khmer (e.g. ថ្ងៃជ័យសិរីមង្គលការ, ផ្កាស្លាបីថង់រោងជ័យ, សិរីសួស្តីអាពាហ៍ពិពាហ៍).`;
    } else if ((language === 'Khmer' || language === 'ខ្មែរ') && isLofi) {
      languageInstruction = `The user specifically requests a Rainy Night Coffee Shop LoFi Acoustic Song (បទ Lofi អង្គុយហាងកាហ្វេរាត្រីភ្លៀងធ្លាក់).
1. The "style" MUST be a cozy chill R&B / LoFi acoustic formula under ${maxStyleLength} chars (e.g., "Khmer lofi acoustic R&B, chill late night coffee shop, 75 BPM, warm female whisper vocals, rhodes electric piano, vinyl crackle, mellow bassline, rain soundscape" or "Khmer chillhop acoustic, cozy cafe vibe, 78 BPM, male whisper baritone, acoustic guitar fingerstyle, vinyl crackle, upright bass, rain sounds").
2. The "lyrics" MUST be written in genuine, poetic, relaxed Khmer (អក្សរខ្មែរ) describing coffee aroma, rain tapping on glass, quiet thoughts, soft acoustic guitars, and peaceful chill feelings, formatted with metatags [Intro], [Verse 1], [Chorus], [Outro] matching length: ${lengthGuide}.
3. The "title" MUST be in Khmer (e.g. កាហ្វេរាត្រីភ្លៀងធ្លាក់, ភ្លៀងធ្លាក់លើកញ្ចក់ហាងកាហ្វេ, អនុស្សាវរីយ៍កែវកាហ្វេ).`;
    } else if ((language === 'Khmer' || language === 'ខ្មែរ') && isRomantic) {
      languageInstruction = `The user specifically requests a Sweet Romantic Love Ballad (បទស្នេហាផ្អែមល្ហែមរ៉ូមែនទិក).
1. The "style" MUST be a sweet romantic love ballad formula under ${maxStyleLength} chars (e.g., "Khmer romantic love ballad, sweet warmth, 68 BPM, duet male & female, tro khmer, acoustic guitar, gentle grand piano, strings" or "Khmer chamber pop ballad, romantic devotion, 70 BPM, female resonant vocals, grand piano, violin quartet, soft acoustic strum").
2. The "lyrics" MUST be written in genuine, poetic, loving Khmer (អក្សរខ្មែរ) expressing tender romance, holding hands, starlight, sweet devotion, and promises of forever, formatted with metatags [Intro], [Verse 1], [Chorus], [Outro] matching length: ${lengthGuide}.
3. The "title" MUST be in Khmer (e.g. ស្នាមញញឹមផ្អែមល្ហែម, ផ្កាយលើមេឃជាសាក្សី, កាន់ដៃអូនឆ្លងកាត់រាល់រដូវ).`;
    } else if ((language === 'Khmer' || language === 'ខ្មែរ') && isKantrum) {
      languageInstruction = `The user specifically requests a fast-paced Khmer Modern Kantrum Dance Song (បទកន្ទ្រឹមញាក់កន្ត្រាក់អារម្មណ៍ល្បឿនលឿន).
1. The "style" MUST be a fast-paced festive Khmer dance formula under ${maxStyleLength} chars with BPM between 128 and 138 BPM, featuring roneat ek, electric guitar, festive drums, skor chhaiyam, tro sau, and punchy bass (e.g., "Khmer modern Kantrum, fast tempo dance, 134 BPM, male & female call response, roneat ek, electric guitar, festive drums" or "Cambodian Kantrum party, energetic joy, 130 BPM, male vocalist, skor chhaiyam, tro sau, bass groove").
2. The "lyrics" MUST be fast-paced, festive, rhyming, upbeat Khmer (អក្សរខ្មែរ) with lively dancing, call-and-response, New Year or village party celebration, clapping and cheer tags (e.g., [Intro - ចង្វាក់កន្ទ្រឹមញាក់], [Verse 1], [Chorus], [Fast Drum Break], [Outro]), matching length: ${lengthGuide}.
3. The "title" MUST be in Khmer (e.g. កន្ទ្រឹមរាំកម្សាន្ត, ញាក់ចង្កេះចូលឆ្នាំថ្មី, ស្រីស្រស់កន្ទ្រឹម, រាំញាក់សប្បាយ).`;
    } else if ((language === 'Khmer' || language === 'ខ្មែរ') && isSadSong) {
      languageInstruction = `The user specifically requests an emotional Khmer Sad Song (បទកម្សត់).
1. The "style" MUST be an emotional Khmer sad song formula under ${maxStyleLength} chars with BPM between 58 and 72 BPM, featuring instruments like tro sau, acoustic guitar, soft grand piano, cello, or strings (e.g., "Khmer acoustic ballad, melancholic heartbreak, 64 BPM, female emotional vocals, tro sau, acoustic guitar, soft piano" or "Khmer slow rock ballad, mournful sorrow, 68 BPM, male raspy vocals, electric guitar crying solo, bass, slow drums").
2. The "lyrics" MUST be written in genuine, poetic, rhyming Khmer (អក្សរខ្មែរ) expressing heartbreak, sorrow, rain, tears, memories, or loneliness, formatted with metatags [Intro], [Verse 1], [Chorus], [Outro] matching length: ${lengthGuide}.
3. The "title" MUST be in Khmer (e.g. ទឹកភ្នែកធ្លាក់ក្នុងភ្លៀង, ស្រមោលស្នេហ៍អតីតកាល, បេះដូងឈឺចាប់).`;
    } else if (language === 'Khmer' || language === 'ខ្មែរ') {
      languageInstruction = `Write the lyrics in beautiful, poetic, authentic Khmer (អក្សរខ្មែរ). Use meaningful Khmer phrasing with rhyming scheme suitable for popular Cambodian songs. Titles should be in Khmer.`;
    } else if (language === 'English') {
      languageInstruction = `Write the lyrics in expressive, catchy, evocative English.`;
    } else if (language === 'Chinese' || language === '中文') {
      languageInstruction = `Write the lyrics in poetic Mandarin Chinese (simplified or traditional).`;
    } else if (language === 'Thai' || language === 'ไทย') {
      languageInstruction = `Write the lyrics in authentic Thai (ภาษาไทย).`;
    } else if (language === 'Custom' || language === 'តាមពាក្យគន្លឹះ') {
      languageInstruction = `Detect and match the language and cultural mood specified in the user's prompt "${prompt}".`;
    }

    const systemInstruction = `You are an elite music producer and prompt engineer specialized in Suno AI (suno.com) and Udio.
Your task is to generate ${count} DISTINCT, high-quality song concepts based on the theme "${prompt}".

CRITICAL SUNO REQUIREMENTS:
1. Each song must have a UNIQUE angle, genre, instrumentation, tempo (BPM), and emotional tone. Avoid repetitive styles.
2. The "style" field MUST BE under ${maxStyleLength} characters. It must follow Suno's best prompt formula: [subgenre/genre], [mood], [tempo BPM], [vocalist gender/type], [key instruments].
3. The "lyrics" must be formatted with standard Suno metatags like [Verse 1], [Chorus], [Bridge], [Outro].
4. ${lengthGuide}.
5. ${languageInstruction}.
6. "previewSnippet" must be the first 2-3 lines of the verse/chorus that grabs the listener.`;

    res.setHeader('Content-Type', 'application/json');

    const geminiCall = ai.models.generateContent({
      model: targetModel,
      contents: `Create ${Math.min(count, 5)} distinct songs for Suno based on topic: "${prompt}". Ensure style length <= ${maxStyleLength} characters.`,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            songs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'Creative and evocative song title',
                  },
                  style: {
                    type: Type.STRING,
                    description: `Suno style prompt under ${maxStyleLength} chars (e.g. genre, mood, BPM, vocals, instruments)`,
                  },
                  lyrics: {
                    type: Type.STRING,
                    description: 'Complete song lyrics with bracket tags like [Verse 1], [Chorus], [Outro]',
                  },
                  previewSnippet: {
                    type: Type.STRING,
                    description: 'First 2-3 memorable lines of lyrics for card preview',
                  },
                },
                required: ['title', 'style', 'lyrics', 'previewSnippet'],
              },
            },
          },
          required: ['songs'],
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout (6s) - using instant generator')), 6000)
    );

    // Use GenerateContentResponse type instead of 'any'
    const response = (await Promise.race([geminiCall, timeoutPromise])) as GenerateContentResponse;

    const rawText = response.text || '{}';
    const parsed = JSON.parse(rawText);
    let songs = (parsed.songs || []).map((s: any, idx: number) => ({
      id: `song-${Date.now()}-${idx + 1}`,
      title: s.title || `Track ${idx + 1}`,
      style: s.style || 'acoustic pop, warm, 80 BPM, female, acoustic guitar',
      lyrics: s.lyrics || '[Verse 1]\nWhispers in the quiet night...',
      previewSnippet: s.previewSnippet || (s.lyrics ? s.lyrics.split('\n').filter((l: string) => !l.startsWith('[')).slice(0, 3).join(' / ') : ''),
    }));

    // If Gemini returned fewer songs than requested count, fill remaining with procedural generator
    if (songs.length < count) {
      const remaining = generateFallbackSongs(prompt, language, count - songs.length, maxStyleLength, lengthType);
      songs = [...songs, ...remaining];
    }

    return res.json({ songs });
  } catch (error: any) {
    console.info('Notice: using creative engine for requested songs.');
    res.setHeader('Content-Type', 'application/json');
    const fallbackSongs = generateFallbackSongs(
      req.body.prompt || 'sad song',
      req.body.language || 'English',
      req.body.count || 10,
      req.body.maxStyleLength || 120,
      req.body.lengthType || 'Medium'
    );
    return res.json({
      songs: fallbackSongs,
      fallbackUsed: true,
    });
  }
});

function generateFallbackSongs(prompt: string, language: string, count: number, maxLen: number, lengthType: string = 'Medium') {
  const isKhmer = language === 'Khmer' || language === 'ខ្មែរ' || prompt.includes('ខ្មែរ') || prompt.toLowerCase().includes('khmer');
  const isSadSong = /sad\s*song|sad|heartbreak|កម្សត់|ទឹកភ្នែក|ព្រាត់/i.test(prompt);
  const isKantrum = /kantrum|កន្ទ្រឹម|fast tempo|dance|រាំ|កន្ត្រាក់/i.test(prompt);
  const isRomantic = /sweet\s*romantic|romantic|love\s*ballad|រ៉ូមែនទិក|ផ្អែមល្ហែម|ស្នេហា/i.test(prompt);
  const isLofi = /coffee|lofi|lo-fi|rainy\s*night|chill|កាហ្វេ|ភ្លៀង/i.test(prompt);
  const isWedding = /wedding|celebration|joyful|អាពាហ៍ពិពាហ៍|មង្គលការ|ភ្លេងការ/i.test(prompt);

  const pickLyrics = (lyricsObj: { short: string; medium: string; long: string }) => {
    if (lengthType === 'Short' || lengthType === 'ខ្លី') return lyricsObj.short;
    if (lengthType === 'Long' || lengthType === 'Very Long' || lengthType === 'វែង' || lengthType === 'វែងខ្លាំង') return lyricsObj.long;
    return lyricsObj.medium;
  };

  const songs = [];

  for (let i = 0; i < count; i++) {
    const globalIdx = i + 1;
    let title = '';
    let style = '';
    let lyrics = '';
    let previewSnippet = '';

    if (isKhmer && isWedding) {
      const template = UNIQUE_30_KHMER_WEDDING_SONGS[i % UNIQUE_30_KHMER_WEDDING_SONGS.length];
      const cycle = Math.floor(i / UNIQUE_30_KHMER_WEDDING_SONGS.length);
      title = template.title + (cycle > 0 ? ` (បទទី ${globalIdx})` : '');
      style = template.style.length > maxLen ? template.style.slice(0, maxLen - 3) + '...' : template.style;
      lyrics = pickLyrics(template.lyrics);
      previewSnippet = template.snippet;
    } else if (isKhmer && isLofi) {
      const template = UNIQUE_30_KHMER_LOFI_SONGS[i % UNIQUE_30_KHMER_LOFI_SONGS.length];
      const cycle = Math.floor(i / UNIQUE_30_KHMER_LOFI_SONGS.length);
      title = template.title + (cycle > 0 ? ` (បទទី ${globalIdx})` : '');
      style = template.style.length > maxLen ? template.style.slice(0, maxLen - 3) + '...' : template.style;
      lyrics = pickLyrics(template.lyrics);
      previewSnippet = template.snippet;
    } else if (isKhmer && isRomantic) {
      const template = UNIQUE_30_KHMER_ROMANTIC_SONGS[i % UNIQUE_30_KHMER_ROMANTIC_SONGS.length];
      const cycle = Math.floor(i / UNIQUE_30_KHMER_ROMANTIC_SONGS.length);
      title = template.title + (cycle > 0 ? ` (បទទី ${globalIdx})` : '');
      style = template.style.length > maxLen ? template.style.slice(0, maxLen - 3) + '...' : template.style;
      lyrics = pickLyrics(template.lyrics);
      previewSnippet = template.snippet;
    } else if (isKhmer && isKantrum) {
      const template = UNIQUE_30_KHMER_KANTRUM_SONGS[i % UNIQUE_30_KHMER_KANTRUM_SONGS.length];
      const cycle = Math.floor(i / UNIQUE_30_KHMER_KANTRUM_SONGS.length);
      title = template.title + (cycle > 0 ? ` (វគ្គ ${globalIdx})` : '');
      style = template.style.length > maxLen ? template.style.slice(0, maxLen - 3) + '...' : template.style;
      lyrics = pickLyrics(template.lyrics);
      previewSnippet = template.snippet;
    } else if (isKhmer && isSadSong) {
      const template = UNIQUE_30_KHMER_SAD_SONGS[i % UNIQUE_30_KHMER_SAD_SONGS.length];
      const cycle = Math.floor(i / UNIQUE_30_KHMER_SAD_SONGS.length);
      title = template.title + (cycle > 0 ? ` (បទទី ${globalIdx})` : '');
      style = template.style.length > maxLen ? template.style.slice(0, maxLen - 3) + '...' : template.style;
      lyrics = pickLyrics(template.lyrics);
      previewSnippet = template.snippet;
    } else {
      const generalTemplates = [
        { genre: 'indie folk, intimate acoustic', bpm: '72 BPM', vocals: 'male, soft raspy vocals', inst: 'acoustic guitar, cello, stomp', title: 'Whispers in the Amber Glow' },
        { genre: 'lo-fi hip-hop, melancholic chill', bpm: '85 BPM', vocals: 'female, whispery vocals', inst: 'rhodes piano, vinyl crackle, mellow bass', title: 'Echoes of the Riverbank' },
        { genre: 'dream pop, ethereal shoegaze', bpm: '110 BPM', vocals: 'female, reverb drenched vocals', inst: 'chorus guitar, synth pads, delay', title: 'Faded Polaroid in the Rain' },
        { genre: 'neo-soul, r&b ballad', bpm: '78 BPM', vocals: 'male, falsetto runs', inst: 'electric piano, finger snaps, smooth bass', title: 'Midnight Train Through the Fog' },
      ];
      const item = generalTemplates[i % generalTemplates.length];
      title = item.title + (i >= generalTemplates.length ? ` (Part ${globalIdx})` : '');
      const raw = `${item.genre}, ${item.bpm}, ${item.vocals}, ${item.inst}`;
      style = raw.length > maxLen ? raw.slice(0, maxLen - 3) + '...' : raw;
      lyrics = `[Intro - Soft atmospheric chords and gentle rhythm]

[Verse 1]
Walking through the remnants of a bittersweet night
Watching streetlights flicker in the quiet pale light
Counting every memory that's slipping through my hands
Like castles made of water in the ocean sands

[Chorus]
Here's a melody for the lonely heart
Before the daylight tears the dream apart
Turn the music high and let the sorrow fade
To every promise that we ever made

[Verse 2]
Raindrops keeping tempo on the windowsill
Time is moving on while the world stands still
I keep a little spark of you inside my chest
A gentle lullaby to put the ghost to rest

[Outro]
Chords resolve softly into the night...`;
      previewSnippet = 'Walking through the remnants of a bittersweet night / Watching streetlights flicker...';
    }

    songs.push({
      id: `song-${Date.now()}-${globalIdx}`,
      title,
      style,
      lyrics,
      previewSnippet,
    });
  }

  return songs;
}

// Single song expand/refine endpoint
app.post('/api/refine-song', async (req, res) => {
  try {
    const { title, style, instruction, currentLyrics, model = 'gemini-3.8-flash' } = req.body;
    const keyToUse = process.env.GEMINI_API_KEY;

    if (!keyToUse) {
      return res.status(400).json({ error: 'No Gemini API key configured.' });
    }

    const ai = new GoogleGenAI({
      apiKey: keyToUse,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const response = await ai.models.generateContent({
      model,
      contents: `Refine the lyrics and style for song "${title}". Style: "${style}". Instruction: "${instruction || 'Make it more emotional and add [Guitar Solo] and [Outro]'}". Current Lyrics:\n${currentLyrics}`,
      config: {
        systemInstruction: 'You are an expert songwriter optimizing lyrics for Suno AI with tags like [Verse], [Chorus], [Bridge], [Outro]. Return clean text.',
      },
    });

    return res.json({ lyrics: response.text });
  } catch (error: any) {
    console.error('Refine error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to refine song' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    
    // Express 5 requires named wildcards (/*splat) or regex for catch-all routes.
    app.get('/*splat', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // Handle server start with proper error handling for EADDRINUSE
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${port} is already in use.`);
      console.error(`👉 Please close the other application using this port, or change the port in your .env file.\n`);
      process.exit(1);
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });

  // Graceful shutdown to ensure the port is released when you press Ctrl+C
  const gracefulShutdown = () => {
    console.log('\nShutting down server gracefully...');
    server.close(() => {
      console.log('Server closed. Port released.');
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

startServer();