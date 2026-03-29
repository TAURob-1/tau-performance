import { useState } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Play, Upload, BarChart2, FlaskConical, Eye, ThumbsUp, Star, Plus, ChevronDown, CheckCircle, AlertTriangle } from 'lucide-react';
import AlertCard from '../shared/AlertCard';
import SectionHeader from '../shared/SectionHeader';

// ── Experian YouTube creative asset data ────────────────────────────────────

const CREATIVES = [
  {
    id: 'EXP-YT-001',
    title: 'Check Your Score in 60s',
    duration: '30s',
    format: 'TrueView In-Stream',
    status: 'Live',
    thumbnail: null,
    views: 421300,
    vtr: 54.1,
    cvr: 3.8,
    cpl: 28.90,
    spend: 12180,
    engagementScore: 87,
    tags: ['awareness', 'product-demo', 'q1-2026'],
    variants: 3,
    abTest: true,
    uploadDate: '2026-01-05',
    performance: { hook: 88, message: 84, cta: 91, brand: 79, emotion: 82 },
  },
  {
    id: 'EXP-YT-002',
    title: 'Identity Theft Costs £1,200/yr',
    duration: '15s',
    format: 'Non-Skippable',
    status: 'Live',
    thumbnail: null,
    views: 312100,
    vtr: null,
    cvr: 2.9,
    cpl: 31.20,
    spend: 9050,
    engagementScore: 78,
    tags: ['fear-of-loss', 'identity-protection', 'q1-2026'],
    variants: 2,
    abTest: false,
    uploadDate: '2026-01-12',
    performance: { hook: 92, message: 76, cta: 74, brand: 81, emotion: 89 },
  },
  {
    id: 'EXP-YT-003',
    title: 'Your Credit Score Explained',
    duration: '45s',
    format: 'TrueView In-Stream',
    status: 'Live',
    thumbnail: null,
    views: 198400,
    vtr: 48.3,
    cvr: 2.4,
    cpl: 38.50,
    spend: 7620,
    engagementScore: 64,
    tags: ['educational', 'awareness', 'q1-2026'],
    variants: 1,
    abTest: false,
    uploadDate: '2026-01-19',
    performance: { hook: 61, message: 78, cta: 65, brand: 85, emotion: 58 },
  },
  {
    id: 'EXP-YT-004',
    title: 'Boost Your Score in 30 Days',
    duration: '20s',
    format: 'TrueView Retargeting',
    status: 'Live',
    thumbnail: null,
    views: 134700,
    vtr: 61.2,
    cvr: 5.1,
    cpl: 22.40,
    spend: 6880,
    engagementScore: 93,
    tags: ['retargeting', 'conversion', 'urgency'],
    variants: 4,
    abTest: true,
    uploadDate: '2026-02-01',
    performance: { hook: 90, message: 88, cta: 96, brand: 77, emotion: 86 },
  },
  {
    id: 'EXP-YT-005',
    title: 'Free Trial — CreditExpert',
    duration: '6s',
    format: 'Bumper',
    status: 'Live',
    thumbnail: null,
    views: 892000,
    vtr: null,
    cvr: 1.6,
    cpl: 44.20,
    spend: 5350,
    engagementScore: 51,
    tags: ['brand', 'bumper', 'awareness'],
    variants: 2,
    abTest: false,
    uploadDate: '2026-02-08',
    performance: { hook: 55, message: 61, cta: 48, brand: 90, emotion: 42 },
  },
  {
    id: 'EXP-YT-006',
    title: 'Experian App — Download Now',
    duration: '15s',
    format: 'YouTube Shorts',
    status: 'Paused',
    thumbnail: null,
    views: 628000,
    vtr: null,
    cvr: 1.2,
    cpl: 52.80,
    spend: 3910,
    engagementScore: 44,
    tags: ['app-install', 'shorts', 'q1-2026'],
    variants: 1,
    abTest: false,
    uploadDate: '2026-02-14',
    performance: { hook: 45, message: 52, cta: 58, brand: 62, emotion: 38 },
  },
];

const AB_TESTS = [
  {
    id: 'AB-001',
    name: 'Hook Frame Test — EXP-YT-001',
    status: 'Running',
    started: '2026-02-10',
    variantA: { name: 'Control — question hook', vtr: 52.3, cvr: 3.6, confidence: null },
    variantB: { name: 'Test — statistic hook', vtr: 57.4, cvr: 4.1, confidence: 87 },
    result: 'B leading',
    daysLeft: 4,
  },
  {
    id: 'AB-002',
    name: 'CTA Wording — EXP-YT-004',
    status: 'Running',
    started: '2026-02-18',
    variantA: { name: 'Control — "Check Free"', vtr: 60.1, cvr: 4.9, confidence: null },
    variantB: { name: 'Test — "See My Score"', vtr: 62.8, cvr: 5.4, confidence: 94 },
    result: 'B significant',
    daysLeft: 2,
  },
  {
    id: 'AB-003',
    name: 'Music vs No Music — EXP-YT-002',
    status: 'Completed',
    started: '2026-01-20',
    variantA: { name: 'Control — no music', vtr: null, cvr: 2.7, confidence: null },
    variantB: { name: 'Winner — subtle music', vtr: null, cvr: 3.1, confidence: 96 },
    result: 'B winner',
    daysLeft: 0,
  },
];

const COMPARE_DATA = [
  { metric: 'VTR', 'EXP-YT-001': 54.1, 'EXP-YT-004': 61.2, 'EXP-YT-003': 48.3 },
  { metric: 'CVR', 'EXP-YT-001': 38, 'EXP-YT-004': 51, 'EXP-YT-003': 24 },
  { metric: 'Views K', 'EXP-YT-001': 421, 'EXP-YT-004': 135, 'EXP-YT-003': 198 },
];

const fmt = {
  num: (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : String(n),
  pct: (n) => n != null ? n.toFixed(1) + '%' : '—',
  gbp: (n) => '£' + n.toFixed(2),
};

const SCORE_COLOR = (n) => n >= 80 ? 'bg-green-100 text-green-700' : n >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600';
const FORMAT_COLOR = { 'TrueView In-Stream': 'bg-blue-100 text-blue-700', 'Non-Skippable': 'bg-purple-100 text-purple-700', 'Bumper': 'bg-orange-100 text-orange-700', 'TrueView Retargeting': 'bg-green-100 text-green-700', 'YouTube Shorts': 'bg-pink-100 text-pink-700' };

export default function YouTubeCreativeManager() {
  const [tab, setTab] = useState('library');
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredCreatives = CREATIVES.filter(c => filter === 'all' || c.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">YouTube Creative Manager</h2>
          <p className="text-xs text-gray-400 mt-0.5">Experian · {CREATIVES.length} assets · {CREATIVES.filter(c => c.abTest).length} A/B tests running</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
            <Upload size={12} /> Upload Creative
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'library', label: 'Asset Library', icon: Play },
            { key: 'compare', label: 'Performance Compare', icon: BarChart2 },
            { key: 'abtests', label: 'A/B Tests', icon: FlaskConical },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === key ? 'border-blue-600 text-blue-700 bg-blue-50/40' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* ── Library tab ──────────────────────────────────────────────────── */}
        {tab === 'library' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {['all', 'live', 'paused'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors capitalize ${filter === f ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-400">{filteredCreatives.length} assets</span>
            </div>

            <div className="space-y-3">
              {filteredCreatives.map(c => (
                <div
                  key={c.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm ${selected === c.id ? 'border-blue-300 ring-1 ring-blue-100 bg-blue-50/20' : 'border-gray-200 bg-white'}`}
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail placeholder */}
                    <div className="w-20 h-14 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                      <Play size={18} className="text-white opacity-80" />
                      <span className="absolute bottom-1 right-1 text-white text-xs font-medium bg-black/60 px-1 rounded">{c.duration}</span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{c.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${FORMAT_COLOR[c.format] || 'bg-gray-100 text-gray-500'}`}>{c.format}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${c.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                        {c.abTest && <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">A/B Testing</span>}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{c.id} · Uploaded {c.uploadDate} · {c.variants} variant{c.variants > 1 ? 's' : ''}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-600"><Eye size={11} className="inline mr-0.5" />{fmt.num(c.views)} views</span>
                        <span className="text-xs text-gray-600">VTR: {fmt.pct(c.vtr)}</span>
                        <span className="text-xs text-gray-600">CVR: {fmt.pct(c.cvr)}</span>
                        <span className={`text-xs font-medium ${c.cpl < 32 ? 'text-green-600' : c.cpl < 45 ? 'text-amber-600' : 'text-red-500'}`}>CPL: {fmt.gbp(c.cpl)}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${SCORE_COLOR(c.engagementScore)}`}>Score: {c.engagementScore}</span>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 mt-1 ${selected === c.id ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Expanded detail */}
                  {selected === c.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Radar */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Creative Dimensions</p>
                        <ResponsiveContainer debounce={1} width="100%" height={200}>
                          <RadarChart data={Object.entries(c.performance).map(([k, v]) => ({ subject: k.charAt(0).toUpperCase() + k.slice(1), value: v }))}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7280' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                            <Radar dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Tags & actions */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {c.tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>)}
                        </div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Actions</p>
                        <div className="flex flex-wrap gap-2">
                          <button className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">Duplicate</button>
                          <button className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">Set up A/B Test</button>
                          <button className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100">Add Variant</button>
                          {c.status === 'Live' ? (
                            <button className="px-3 py-1.5 text-xs bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100">Pause</button>
                          ) : (
                            <button className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100">Resume</button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Compare tab ────────────────────────────────────────────────── */}
        {tab === 'compare' && (
          <div className="p-6 space-y-6">
            <SectionHeader title="Creative Performance Comparison" sub="Side-by-side comparison of top 3 creatives by key performance metrics" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CREATIVES.slice(0, 3).map(c => (
                <div key={c.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="w-full h-20 bg-gray-900 rounded-lg flex items-center justify-center mb-3 relative">
                    <Play size={20} className="text-white opacity-80" />
                    <span className="absolute bottom-1 right-2 text-white text-xs bg-black/60 px-1 rounded">{c.duration}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">{c.title}</div>
                  <div className="text-xs text-gray-400 mb-3">{c.format}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Views</span>
                      <span className="font-medium text-gray-800">{fmt.num(c.views)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">VTR</span>
                      <span className="font-medium text-gray-800">{fmt.pct(c.vtr)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">CVR</span>
                      <span className="font-medium text-gray-800">{fmt.pct(c.cvr)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">CPL</span>
                      <span className={`font-semibold ${c.cpl < 32 ? 'text-green-600' : c.cpl < 45 ? 'text-amber-600' : 'text-red-500'}`}>{fmt.gbp(c.cpl)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Engagement Score</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${SCORE_COLOR(c.engagementScore)}`}>{c.engagementScore}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <SectionHeader title="CPL Benchmark" sub="Cost per lead across all active creatives" />
              <ResponsiveContainer debounce={1} width="100%" height={220} className="mt-4">
                <BarChart data={CREATIVES.filter(c => c.status === 'Live')} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tickFormatter={v => '£' + v} tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis type="category" dataKey="title" tick={{ fontSize: 10, fill: '#6B7280' }} width={160} />
                  <Tooltip formatter={(v) => ['£' + v.toFixed(2), 'CPL']} />
                  <Bar dataKey="cpl" radius={[0, 4, 4, 0]}>
                    {CREATIVES.filter(c => c.status === 'Live').map((c, i) => (
                      <Cell key={i} fill={c.cpl < 32 ? '#10B981' : c.cpl < 45 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── A/B Tests tab ──────────────────────────────────────────────── */}
        {tab === 'abtests' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <SectionHeader title="Active & Completed A/B Tests" sub={`${AB_TESTS.filter(t => t.status === 'Running').length} running · ${AB_TESTS.filter(t => t.status === 'Completed').length} completed`} />
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                <Plus size={12} /> New Test
              </button>
            </div>
            {AB_TESTS.map(test => (
              <div key={test.id} className={`border rounded-xl p-5 ${test.status === 'Completed' ? 'border-green-200 bg-green-50/20' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{test.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${test.status === 'Running' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{test.status}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{test.id} · Started {test.started} {test.status === 'Running' && `· ${test.daysLeft} days left`}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${test.result.includes('significant') || test.result.includes('winner') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {test.result.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[test.variantA, test.variantB].map((v, i) => (
                    <div key={i} className={`rounded-lg p-4 border ${i === 1 && test.result.includes('B') ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${i === 0 ? 'bg-gray-200 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>{i === 0 ? 'A — Control' : 'B — Test'}</span>
                        {i === 1 && test.result.includes('B') && <CheckCircle size={14} className="text-green-500" />}
                      </div>
                      <div className="text-xs font-medium text-gray-700 mb-2">{v.name}</div>
                      <div className="flex gap-4">
                        {v.vtr !== null && <div><div className="text-xs text-gray-500">VTR</div><div className="text-sm font-bold text-gray-900">{v.vtr}%</div></div>}
                        <div><div className="text-xs text-gray-500">CVR</div><div className="text-sm font-bold text-gray-900">{v.cvr}%</div></div>
                        {v.confidence && <div><div className="text-xs text-gray-500">Confidence</div><div className={`text-sm font-bold ${v.confidence >= 95 ? 'text-green-600' : v.confidence >= 85 ? 'text-amber-600' : 'text-gray-500'}`}>{v.confidence}%</div></div>}
                      </div>
                    </div>
                  ))}
                </div>
                {test.status === 'Running' && test.variantB.confidence && test.variantB.confidence >= 95 && (
                  <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    <p className="text-xs text-green-700 font-medium">Statistical significance reached (95%+). Consider ending test and applying winning variant.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertCard severity="success" title="EXP-YT-004 highest performer" text="Retargeting creative 'Boost Your Score in 30 Days' achieving 5.1% CVR at £22.40 CPL — well below target. Scale budget 30%." />
        <AlertCard severity="warning" title="YouTube Shorts underperforming" text="EXP-YT-006 paused: CPL £52.80 (target: £35). Refresh creative with native vertical format and direct-to-app messaging." />
        <AlertCard severity="info" title="A/B Test AB-002 ready to call" text="CTA wording test at 94% confidence — 'See My Score' outperforming 'Check Free' by +10% CVR. Apply winner and close test." />
      </div>
    </div>
  );
}
