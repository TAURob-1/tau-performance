import { useState } from 'react';
import { Sparkles, Copy, Save, Download, RefreshCw, CheckCircle, TrendingUp, AlertCircle, Eye, Zap } from 'lucide-react';
import AlertCard from '../shared/AlertCard';
import SectionHeader from '../shared/SectionHeader';

// Pre-generated copy variations for Experian use cases
const VARIATION_TEMPLATES = {
  free_credit_score: [
    {
      id: 'v1', score: 92, strength: 'Strong',
      h1: 'Check Your Free Credit Score Today',
      h2: "Experian — UK's #1 Credit Bureau",
      h3: 'No Card Required. Instant Results.',
      d1: 'See your Experian Credit Score for free. Updated monthly, no credit check needed to view.',
      d2: 'Join 20 million+ people who trust Experian. Get personalised tips to boost your score fast.',
      cta: 'Check My Score Free',
      charH: [31, 32, 31], charD: [84, 88],
      prediction: { ctr: 9.8, convRate: 4.2, qualityScore: 9 },
      tag: 'Top Performer',
    },
    {
      id: 'v2', score: 87, strength: 'Strong',
      h1: 'Free Credit Score — Experian',
      h2: 'Instant Report. No Hidden Fees.',
      h3: 'Trusted by 20 Million+ UK Users',
      d1: 'Get your free Experian credit score now. View your full credit report with personalised advice.',
      d2: 'Discover what lenders see. Improve your score with our free step-by-step recommendations.',
      cta: 'View Free Score',
      charH: [29, 31, 30], charD: [88, 86],
      prediction: { ctr: 8.9, convRate: 3.8, qualityScore: 8 },
      tag: null,
    },
    {
      id: 'v3', score: 78, strength: 'Good',
      h1: 'Your Experian Credit Score — Free',
      h2: 'See What Affects Your Score',
      h3: 'Start Improving Today',
      d1: 'Check your free Experian credit score. Find out how to get a better deal on loans, mortgages & cards.',
      d2: 'Your credit score matters. Experian helps you understand and improve it — completely free of charge.',
      cta: 'Get My Free Score',
      charH: [30, 28, 22], charD: [91, 87],
      prediction: { ctr: 7.4, convRate: 3.1, qualityScore: 7 },
      tag: null,
    },
    {
      id: 'v4', score: 71, strength: 'Good',
      h1: 'Experian Credit Check — Free & Fast',
      h2: 'See Your Score in Under 60 Seconds',
      h3: 'No Impact on Your Credit File',
      d1: 'Run a free credit check with Experian. See your score, understand your file and get expert tips.',
      d2: 'Millions of UK consumers rely on Experian. Get your free score and personalised improvement plan.',
      cta: 'Check Score Now',
      charH: [30, 34, 30], charD: [86, 89],
      prediction: { ctr: 6.8, convRate: 2.8, qualityScore: 7 },
      tag: null,
    },
  ],
  credit_expert: [
    {
      id: 'v1', score: 88, strength: 'Strong',
      h1: 'CreditExpert — Full Credit Monitoring',
      h2: '30-Day Free Trial. Cancel Anytime.',
      h3: 'Fraud Alerts & Score Tracking',
      d1: 'Get unlimited access to your Experian credit report. Real-time alerts if anything changes. 30 days free.',
      d2: 'Monitor your credit 24/7 with CreditExpert. Set up fraud alerts and track score changes instantly.',
      cta: 'Start Free Trial',
      charH: [37, 34, 31], charD: [91, 88],
      prediction: { ctr: 8.2, convRate: 3.6, qualityScore: 8 },
      tag: 'Top Performer',
    },
  ],
  identity_protection: [
    {
      id: 'v1', score: 84, strength: 'Strong',
      h1: 'Identity Protection — Experian',
      h2: 'Dark Web Monitoring Included',
      h3: 'Alerts Before Fraud Happens',
      d1: 'Experian IdentityWorks scans the dark web for your data. Get instant alerts if your details are exposed.',
      d2: 'Protect yourself from identity theft. Experian monitors billions of records to keep your identity safe.',
      cta: 'Protect My Identity',
      charH: [34, 30, 26], charD: [87, 90],
      prediction: { ctr: 7.6, convRate: 3.2, qualityScore: 8 },
      tag: null,
    },
  ],
};

const FORM_DEFAULTS = {
  product: 'free_credit_score',
  audience: 'mass_market',
  tone: 'trustworthy',
  usp: 'Free, no card required',
  kw: 'free credit score',
  device: 'all',
};

const PRODUCT_OPTIONS = [
  { value: 'free_credit_score', label: 'Free Credit Score' },
  { value: 'credit_expert', label: 'CreditExpert Subscription' },
  { value: 'identity_protection', label: 'Identity Protection' },
];

const QS_COLOR = (n) => n >= 8 ? 'text-green-600 bg-green-50' : n >= 6 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';

export default function GoogleCopyCreator() {
  const [form, setForm] = useState(FORM_DEFAULTS);
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);
  const [copied, setCopied] = useState(null);

  const handleGenerate = () => {
    setLoading(true);
    setGenerated(null);
    setTimeout(() => {
      setGenerated(VARIATION_TEMPLATES[form.product] || VARIATION_TEMPLATES.free_credit_score);
      setLoading(false);
    }, 1200);
  };

  const handleSave = (v) => {
    setSaved(prev => prev.includes(v.id) ? prev : [...prev, v.id]);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExport = () => {
    if (!generated) return;
    const rows = ['Variation,H1,H2,H3,D1,D2,CTA,CTR Pred,CVR Pred,QS Pred'];
    generated.forEach(v => rows.push(`${v.id},"${v.h1}","${v.h2}","${v.h3}","${v.d1}","${v.d2}","${v.cta}",${v.prediction.ctr}%,${v.prediction.convRate}%,${v.prediction.qualityScore}`));
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'experian-ad-copy.csv'; a.click();
  };

  const charCount = (s) => s ? s.length : 0;
  const charClass = (s, max) => {
    const n = charCount(s);
    return n > max ? 'text-red-600' : n > max * 0.85 ? 'text-amber-600' : 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Google Ad Copy Creator</h2>
          <p className="text-xs text-gray-400 mt-0.5">Experian · Generate, preview and export RSA variations</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <Sparkles size={10} /> AI-Assisted
          </span>
          {generated && (
            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download size={12} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Generator form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Copy Brief" sub="Configure your brief and TAU generates RSA-ready variations with predicted performance scores" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product / Service</label>
            <select
              value={form.product}
              onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRODUCT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Target Audience</label>
            <select
              value={form.audience}
              onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mass_market">Mass Market — All Adults</option>
              <option value="young_adults">Young Adults 18–34</option>
              <option value="homebuyers">First-Time Homebuyers</option>
              <option value="business_owners">SME Business Owners</option>
              <option value="credit_concerned">Credit-Concerned Consumers</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tone of Voice</label>
            <select
              value={form.tone}
              onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="trustworthy">Trustworthy & Authoritative</option>
              <option value="empowering">Empowering & Positive</option>
              <option value="urgent">Urgent & Action-Driven</option>
              <option value="educational">Educational & Helpful</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Primary USP / Offer</label>
            <input
              type="text"
              value={form.usp}
              onChange={e => setForm(f => ({ ...f, usp: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Free, no card required"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Primary Keyword</label>
            <input
              type="text"
              value={form.kw}
              onChange={e => setForm(f => ({ ...f, kw: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. free credit score"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Device Target</label>
            <select
              value={form.device}
              onChange={e => setForm(f => ({ ...f, device: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Devices</option>
              <option value="mobile">Mobile Only</option>
              <option value="desktop">Desktop Only</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loading ? 'Generating…' : 'Generate Variations'}
          </button>
          {generated && (
            <button
              onClick={() => setGenerated(null)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center gap-3">
          <RefreshCw size={28} className="text-blue-500 animate-spin" />
          <p className="text-sm text-gray-500">Generating copy variations and predicting performance…</p>
        </div>
      )}

      {/* Results */}
      {generated && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">{generated.length} variations generated</h3>
            {saved.length > 0 && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle size={12} /> {saved.length} saved
              </span>
            )}
          </div>

          <div className="space-y-4">
            {generated.map((v, idx) => (
              <div key={v.id} className={`bg-white border rounded-xl p-6 transition-all ${saved.includes(v.id) ? 'border-green-300 ring-1 ring-green-100' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">VARIATION {idx + 1}</span>
                    {v.tag && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{v.tag}</span>
                    )}
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${v.score >= 85 ? 'bg-green-100 text-green-700' : v.score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                      Score: {v.score}/100
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {saved.includes(v.id) ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle size={12} /> Saved
                      </span>
                    ) : (
                      <button onClick={() => handleSave(v)} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                        <Save size={11} /> Save
                      </button>
                    )}
                  </div>
                </div>

                {/* Ad preview */}
                <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="text-xs text-green-700 font-medium mb-1 flex items-center gap-1">
                    <span className="px-1 border border-green-700 rounded text-xs">Ad</span>
                    experian.com/credit-score
                  </div>
                  <div className="text-base font-medium text-blue-700 hover:underline cursor-pointer leading-tight">
                    {v.h1} | {v.h2} | {v.h3}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 leading-relaxed">{v.d1}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{v.d2}</div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Headline 1', val: v.h1, max: 30 },
                    { label: 'Headline 2', val: v.h2, max: 30 },
                    { label: 'Headline 3', val: v.h3, max: 30 },
                  ].map((f, i) => (
                    <div key={i} className="relative">
                      <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                      <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white">
                        <span className="text-sm text-gray-800 flex-1">{f.val}</span>
                        <span className={`text-xs ml-1 ${charClass(f.val, f.max)}`}>{charCount(f.val)}/{f.max}</span>
                        <button onClick={() => handleCopy(f.val, f.label + i)} className="text-gray-400 hover:text-blue-600">
                          {copied === f.label + i ? <CheckCircle size={13} className="text-green-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {[
                    { label: 'Description 1', val: v.d1, max: 90 },
                    { label: 'Description 2', val: v.d2, max: 90 },
                  ].map((f, i) => (
                    <div key={i} className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                      <div className="flex items-start gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white">
                        <span className="text-sm text-gray-800 flex-1 leading-relaxed">{f.val}</span>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`text-xs ${charClass(f.val, f.max)}`}>{charCount(f.val)}/{f.max}</span>
                          <button onClick={() => handleCopy(f.val, 'd' + i)} className="text-gray-400 hover:text-blue-600">
                            {copied === 'd' + i ? <CheckCircle size={13} className="text-green-500" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Performance predictions */}
                <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-6">
                  <span className="text-xs text-blue-600 font-semibold flex items-center gap-1"><Zap size={11} /> Predicted Performance</span>
                  <span className="text-xs text-blue-700">CTR: <strong>{v.prediction.ctr}%</strong></span>
                  <span className="text-xs text-blue-700">Conv Rate: <strong>{v.prediction.convRate}%</strong></span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${QS_COLOR(v.prediction.qualityScore)}`}>QS: {v.prediction.qualityScore}/10</span>
                </div>
              </div>
            ))}
          </div>

          {/* Guidance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AlertCard severity="info" title="RSA best practice" text="Upload at least 8–10 headlines and 4 descriptions. Google tests combinations automatically. Aim for Quality Score ≥8 before scaling spend." />
            <AlertCard severity="success" title="Next step" text="Save your preferred variations and upload via Google Ads Editor. Import the CSV export directly into the ad copy fields." />
          </div>
        </>
      )}

      {/* Empty state */}
      {!generated && !loading && (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center gap-3 text-center">
          <Sparkles size={32} className="text-blue-300" />
          <p className="text-sm font-medium text-gray-600">Configure your brief above and click Generate Variations</p>
          <p className="text-xs text-gray-400 max-w-sm">TAU will produce RSA-ready headlines and descriptions with character counts, ad previews and predicted CTR, conversion rate and Quality Score.</p>
        </div>
      )}
    </div>
  );
}
