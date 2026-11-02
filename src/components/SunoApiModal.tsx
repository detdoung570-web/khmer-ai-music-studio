import React, { useState } from 'react';
import { X, Check, AlertCircle, ExternalLink, Key, Zap, ShieldAlert, Coins } from 'lucide-react';

interface SunoApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  isKhmerUi: boolean;
}

export const SunoApiModal: React.FC<SunoApiModalProps> = ({ isOpen, onClose, isKhmerUi }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'credits' | 'connect'>('status');
  const [proxyUrl, setProxyUrl] = useState('');
  const [cookieToken, setCookieToken] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('suno_proxy_endpoint', proxyUrl);
    localStorage.setItem('suno_cookie_auth', cookieToken);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18152b] border border-[#3c3161] rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-[#2e264d] bg-[#1d1933] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isKhmerUi ? 'ព័ត៌មាន និងការតភ្ជាប់ Suno API' : 'Suno API Integration & Limits'}
              </h2>
              <p className="text-[11px] text-purple-300/70">
                Official limits, credit rules, and integration options
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#2a2247] hover:bg-[#352c59] text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2e264d] bg-[#141124] px-4">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-pink-500 text-pink-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isKhmerUi ? '១. ស្ថានភាព API ផ្លូវការ' : '1. Official API Status'}
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'credits'
                ? 'border-pink-500 text-pink-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isKhmerUi ? '២. កម្រិត Credits & Rate Limits' : '2. Credits & Rate Limits'}
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'connect'
                ? 'border-pink-500 text-pink-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {isKhmerUi ? '៣. ភ្ជាប់ API Wrapper / Proxy' : '3. Connect Proxy API'}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {activeTab === 'status' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-300">
                    {isKhmerUi
                      ? 'តើ Suno មាន Public Developer API ផ្លូវការដែរឬទេ?'
                      : 'Does Suno have an official public developer API?'}
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {isKhmerUi
                      ? 'បច្ចុប្បន្ន Suno មិនទាន់បើកចំហ Developer API ជាសាធារណៈសម្រាប់អ្នកបង្កើតទូទៅទេ។ គម្រោងបង់ប្រាក់ Pro ($10/ខែ) និង Premier ($30/ខែ) គឺផ្ដល់សិទ្ធិប្រើប្រាស់លើ Web App (suno.com) ប៉ុណ្ណោះ មិនមានផ្ដល់ API Key ផ្ទាល់ឡើយ។'
                      : 'Currently, Suno does NOT provide an open self-serve public REST API with developer keys for independent developers. Consumer subscriptions (Pro & Premier) grant generation access strictly through the Suno web and mobile apps, not via developer API keys.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#201a38] border border-[#352b57] space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  <span>
                    {isKhmerUi ? 'របៀបដែល Developer ភ្ជាប់ Suno នាពេលបច្ចុប្បន្ន' : 'How Developers Integrate Suno Today'}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                  <li>
                    <strong className="text-cyan-300">Open-Source Wrappers (ដូចជា gcui-art/suno-api):</strong> ប្រើប្រាស់ Session Cookie ពី Suno Web Account ដើម្បីបញ្ជូន Prompt ទៅបង្កើតចម្រៀង។
                  </li>
                  <li>
                    <strong className="text-purple-300">Third-Party API Providers (ដូចជា GoAPI, PiAPI):</strong> ផ្ដល់សេវា API Wrapper ដោយគិតថ្លៃតាមចំនួនបទចម្រៀង (Pay-as-you-go ប្រហែល $0.01 - $0.05 ក្នុង ១ បទ)។
                  </li>
                  <li>
                    <strong className="text-pink-300">វិធីសាស្រ្តដែលយើងកំពុងប្រើ (1-Click Paste &amp; Web Audio Synth):</strong> បង្កើត Style និង Lyrics តាមលក្ខខណ្ឌ Suno ដោយឥតគិតថ្លៃ និងមានម៉ាស៊ីនចាក់ភ្លេងសាកល្បងភ្លាមៗ រួច Copy ចូល suno.com ក្នុងមួយចុច។
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'credits' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {/* Free Tier */}
                <div className="p-3 rounded-xl bg-[#1d1933] border border-[#3b325c] space-y-1.5">
                  <div className="text-xs font-bold text-slate-400">FREE PLAN</div>
                  <div className="text-base font-extrabold text-white">$0 / ខែ</div>
                  <div className="text-xs text-purple-300 font-semibold">50 Credits / ថ្ងៃ</div>
                  <p className="text-[11px] text-slate-400">
                    បង្កើតបានប្រហែល ៥ ដង (១០ បទ) ក្នុង ១ ថ្ងៃ។ Credits មិនអាចបូកសន្សំបន្តខែបានទេ និងគ្មានសិទ្ធិពាណិជ្ជកម្ម។
                  </p>
                </div>

                {/* Pro Tier */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/50 space-y-1.5">
                  <div className="text-xs font-bold text-purple-400">PRO PLAN</div>
                  <div className="text-base font-extrabold text-white">$10 / ខែ</div>
                  <div className="text-xs text-pink-300 font-semibold">2,500 Credits / ខែ</div>
                  <p className="text-[11px] text-slate-300">
                    បង្កើតបានប្រហែល ២៥០ ដង (៥០០ បទ) ក្នុង ១ ខែ។ មានសិទ្ធិ Commercial Use ពេញលេញ និង Priority Queue។
                  </p>
                </div>

                {/* Premier Tier */}
                <div className="p-3 rounded-xl bg-pink-950/40 border border-pink-500/50 space-y-1.5">
                  <div className="text-xs font-bold text-pink-400">PREMIER PLAN</div>
                  <div className="text-base font-extrabold text-white">$30 / ខែ</div>
                  <div className="text-xs text-emerald-300 font-semibold">10,000 Credits / ខែ</div>
                  <p className="text-[11px] text-slate-300">
                    បង្កើតបានប្រហែល ១,០០០ ដង (២,០០០ បទ) ក្នុង ១ ខែ។ សមស្របសម្រាប់ស្ទូឌីយោ និងអ្នកផលិតចម្រៀងអាជីព។
                  </p>
                </div>
              </div>

              {/* Rate Limits breakdown */}
              <div className="p-3.5 rounded-xl bg-[#201a38] border border-[#352b57] space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>
                    {isKhmerUi ? 'តើមាន Unlimited Generation ដែរឬទេ?' : 'Is Unlimited Generation Supported?'}
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1.5">
                  <p>
                    <strong className="text-red-400">ចម្លើយគឺ ទេ (NO):</strong> Suno មិនមានគម្រោង "Unlimited Generation" ឡើយ។ រាល់ការបង្កើតត្រូវកាត់ Credits ជានិច្ច (១ ដង = ១០ Credits = ២ បទចម្រៀង)។
                  </p>
                  <p>
                    <strong className="text-amber-400">Rate Limit (កម្រិតល្បឿន):</strong> Suno អនុញ្ញាតឱ្យដំណើរការបង្កើតទន្ទឹមគ្នា (Concurrency) បានត្រឹមតែ ២ បទក្នុងពេលតែមួយប៉ុណ្ណោះក្នុង ១ គណនី ដើម្បីការពារ Server។
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'connect' && (
            <form onSubmit={handleSaveConfig} className="space-y-3.5">
              <p className="text-xs text-slate-300 leading-relaxed">
                {isKhmerUi
                  ? 'ប្រសិនបើអ្នកមាន Server Suno API Proxy (ដូចជា suno-api wrapper ឬ GoAPI) អ្នកអាចបញ្ចូល URL នៅខាងក្រោមដើម្បីតភ្ជាប់ការ Download MP3 ដោយផ្ទាល់៖'
                  : 'If you host a Suno API proxy wrapper (e.g. gcui-art/suno-api) or use a third-party key, enter your endpoint details below:'}
              </p>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Custom Suno API / Proxy Endpoint</span>
                </label>
                <input
                  type="text"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  placeholder="https://your-suno-api-wrapper.vercel.app"
                  className="w-full bg-[#12101e] border border-[#3b325c] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Suno Session Token / Cookie (Optional)
                </label>
                <input
                  type="password"
                  value={cookieToken}
                  onChange={(e) => setCookieToken(e.target.value)}
                  placeholder="Bearer token or cookie string..."
                  className="w-full bg-[#12101e] border border-[#3b325c] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {savedSuccess ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> បានរក្សាទុករួចរាល់!
                    </span>
                  ) : (
                    'ព័ត៌មានត្រូវបានរក្សាទុកក្នុង Local Browser Storage'
                  )}
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-md"
                >
                  {isKhmerUi ? 'រក្សាទុកការកំណត់' : 'Save Config'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2e264d] bg-[#1d1933] flex justify-between items-center">
          <a
            href="https://suno.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
          >
            <span>{isKhmerUi ? 'មើលតារាងតម្លៃ Suno Pricing' : 'View Suno Pricing & Plans'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
          >
            {isKhmerUi ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
