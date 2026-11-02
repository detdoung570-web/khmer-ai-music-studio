import React from 'react';
import { X, ExternalLink, Lightbulb, Music, Tag, FileText } from 'lucide-react';

interface SunoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isKhmerUi: boolean;
}

export const SunoGuideModal: React.FC<SunoGuideModalProps> = ({ isOpen, onClose, isKhmerUi }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18152b] border border-[#3c3161] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn text-slate-200">
        <div className="p-4 border-b border-[#2e264d] bg-[#1d1933] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              {isKhmerUi ? 'របៀបប្រើប្រាស់ជាមួយ Suno AI' : 'How to use with Suno.com'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#2a2247] hover:bg-[#352c59] text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-[#201a38] border border-[#352b57] space-y-2">
            <div className="flex items-center gap-2 font-bold text-pink-400 text-sm">
              <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs">
                1
              </span>
              <span>{isKhmerUi ? 'ជំហានទី ១: បើកគេហទំព័រ Suno.com' : 'Step 1: Open Suno.com'}</span>
            </div>
            <p className="text-slate-300">
              {isKhmerUi
                ? 'ចូលទៅកាន់ suno.com រួចចុច "Create" នៅរបារខាងឆ្វេង ហើយបើក "Custom Mode" (របៀបផ្ទាល់ខ្លួន)។'
                : 'Navigate to suno.com, click "Create" in the left sidebar, and switch on "Custom Mode".'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-[#201a38] border border-[#352b57] space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">
                2
              </span>
              <span>{isKhmerUi ? 'ជំហានទី ២: បិទភ្ជាប់ Style of Music' : 'Step 2: Paste "Style of Music"'}</span>
            </div>
            <p className="text-slate-300">
              {isKhmerUi
                ? 'ចុចប៊ូតុង [Style] លើបទណាមួយក្នុងកម្មវិធីនេះ រួច Paste ចូលក្នុងប្រអប់ "Style of Music" របស់ Suno (មានបញ្ជាក់ចង្វាក់ BPM, ឧបករណ៍ភ្លេង និងប្រភេទសំឡេង)។'
                : 'Click [Style] button on any card in this app, then paste into Suno\'s "Style of Music" box.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-[#201a38] border border-[#352b57] space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-400 text-sm">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs">
                3
              </span>
              <span>{isKhmerUi ? 'ជំហានទី ៣: បិទភ្ជាប់ Lyrics (ទំនុកច្រៀង)' : 'Step 3: Paste "Lyrics"'}</span>
            </div>
            <p className="text-slate-300">
              {isKhmerUi
                ? 'ចុចប៊ូតុង [Lyrics] រួច Paste ចូលក្នុងប្រអប់ "Lyrics" របស់ Suno។ ទំនុកច្រៀងមានភ្ជាប់ស្លាករចនាសម្ព័ន្ធ [Verse 1], [Chorus], [Outro] រួចជាស្រេច ដែលជួយឱ្យ AI ច្រៀងត្រូវចង្វាក់។'
                : 'Click [Lyrics] button and paste into Suno\'s "Lyrics" box. It already contains meta tags like [Verse 1], [Chorus], [Outro] for optimal musical structure.'}
            </p>
          </div>

          {/* Tips for Khmer songs */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-purple-800/40 space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>💡</span>
              <span>{isKhmerUi ? 'គន្លឹះពិសេសសម្រាប់បទខ្មែរ (Khmer Music Tips)' : 'Tips for Khmer Music'}</span>
            </div>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>{isKhmerUi ? 'ជ្រើសរើសភាសា "ខ្មែរ" ដើម្បីឱ្យទំនុកច្រៀងចេញជាអក្សរខ្មែរពិតប្រាកដ។' : 'Select "ខ្មែរ" to generate authentic poetic Khmer lyrics.'}</li>
              <li>{isKhmerUi ? 'អាចវាយពាក្យគន្លឹះដូចជា: "រាំវង់", "កន្ទ្រឹម", "ភ្លេងការ", ឬ "Khmer romantic pop" ក្នុងប្រអប់ស្វែងរក។' : 'Use keywords like "Khmer Romvong", "Kantrum fast tempo", or "Cambodian acoustic ballad".'}</li>
              <li>{isKhmerUi ? 'កម្រិត Style ត្រូវបានកំណត់មិនឱ្យលើសពី ១២០ តួអក្សរ ដើម្បីកុំឱ្យ Suno កាត់ចោល។' : 'Style lengths are kept under 120 chars so Suno doesn\'t truncate them.'}</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-[#2e264d] bg-[#1d1933] flex justify-between items-center">
          <a
            href="https://suno.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
          >
            <span>{isKhmerUi ? 'បើក Suno.com ឥឡូវនេះ' : 'Open Suno.com now'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
          >
            {isKhmerUi ? 'យល់ព្រម' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
