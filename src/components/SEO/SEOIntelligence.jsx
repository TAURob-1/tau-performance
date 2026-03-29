/**
 * SEOIntelligence.jsx
 * SEO Intelligence page for 247 CarFinance — powered by TAU Signal v2 SEO data
 *
 * Purpose: Position TAU Signal SEO as the superior intelligence investment
 * over third-party tools like AdThens. Demonstrate deep competitor SEO analysis,
 * keyword opportunity mapping, and content gap identification.
 *
 * Data currently uses hardcoded Signal v2-structured mock data.
 * Future integration: replace SIGNAL_SEO_DATA with live calls to:
 *   [API: GET /api/signal/seo/247cf]
 *   [API: GET /api/signal/seo/competitors]
 *   [API: GET /api/signal/keywords/gaps]
 */

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, CartesianGrid, Legend,
  ScatterChart, Scatter, ZAxis,
} from 'recharts';
import KPICard from '../shared/KPICard';
import AlertCard from '../shared/AlertCard';
import GradeBadge from '../shared/GradeBadge';
import StatusDot from '../shared/StatusDot';
import SectionHeader from '../shared/SectionHeader';
import {
  Search, TrendingUp, TrendingDown, Target, Globe, Zap,
  BarChart2, AlertTriangle, CheckCircle, ArrowUpRight, Star,
  ExternalLink, Layers, Award,
} from 'lucide-react';

// ─── Signal v2 SEO mock data ──────────────────────────────────────────────
// Structure mirrors TAU Signal v2 SEO scan output
// [API: GET /api/signal/seo/247cf/overview]
const SIGNAL_SEO_OVERVIEW = {
  domain: '247carfinance.co.uk',
  scanDate: '2026-03-28',
  domainAuthority: 58,
  organicTraffic: 142000,
  organicKeywords: 4820,
  rankingPages: 312,
  backlinks: 18400,
  referringDomains: 1240,
  topKeywordRank: 1,
  avgPosition: 14.2,
  ctr: 4.8,
  estimatedMonthlyTrafficValue: 218000,
  yoyGrowth: 12.4,
  technicalScore: 84,
  contentScore: 71,
  linkScore: 79,
  overallSeoGrade: 'B+',
};

// [API: GET /api/signal/seo/competitors]
const COMPETITOR_SEO = [
  {
    name: '247 CarFinance',
    domain: '247carfinance.co.uk',
    da: 58,
    traffic: 142000,
    keywords: 4820,
    backlinks: 18400,
    topKeywords: ['car finance', '247 car finance', 'bad credit car finance', 'van finance', 'car loans'],
    rankPos1to3: 28,
    rankPos4to10: 94,
    rankPos11to30: 210,
    contentPages: 312,
    isSelf: true,
  },
  {
    name: 'Zuto',
    domain: 'zuto.com',
    da: 62,
    traffic: 168000,
    keywords: 6200,
    backlinks: 24100,
    topKeywords: ['car finance', 'best car finance', 'car finance calculator', 'car finance deals'],
    rankPos1to3: 41,
    rankPos4to10: 128,
    rankPos11to30: 280,
    contentPages: 445,
    isSelf: false,
  },
  {
    name: 'Oodle Car Finance',
    domain: 'oodlecarfinance.com',
    da: 55,
    traffic: 89000,
    keywords: 3100,
    backlinks: 12800,
    topKeywords: ['near prime car finance', 'car finance near me', 'second chance car finance'],
    rankPos1to3: 18,
    rankPos4to10: 67,
    rankPos11to30: 148,
    contentPages: 198,
    isSelf: false,
  },
  {
    name: 'CarFinance247',
    domain: 'carfinance247.co.uk',
    da: 61,
    traffic: 155000,
    keywords: 5400,
    backlinks: 21000,
    topKeywords: ['car finance 247', 'used car finance', 'car finance bad credit'],
    rankPos1to3: 35,
    rankPos4to10: 112,
    rankPos11to30: 240,
    contentPages: 380,
    isSelf: false,
  },
  {
    name: 'Moneybarn',
    domain: 'moneybarn.com',
    da: 53,
    traffic: 72000,
    keywords: 2800,
    backlinks: 9600,
    topKeywords: ['subprime car finance', 'bad credit car loan'],
    rankPos1to3: 14,
    rankPos4to10: 55,
    rankPos11to30: 130,
    contentPages: 156,
    isSelf: false,
  },
];

// [API: GET /api/signal/keywords/247cf/top]
const TOP_KEYWORDS = [
  { keyword: '247 car finance', position: 1, volume: 14800, difficulty: 45, intent: 'Brand', trend: 'stable', opportunity: 'low', cpc: 1.20 },
  { keyword: 'car finance bad credit', position: 3, volume: 9900, difficulty: 72, intent: 'Commercial', trend: 'up', opportunity: 'medium', cpc: 4.80 },
  { keyword: 'car finance calculator', position: 8, volume: 22100, difficulty: 68, intent: 'Informational', trend: 'up', opportunity: 'high', cpc: 2.10 },
  { keyword: 'bad credit car finance', position: 4, volume: 8100, difficulty: 75, intent: 'Commercial', trend: 'up', opportunity: 'medium', cpc: 5.40 },
  { keyword: 'van finance bad credit', position: 2, volume: 2900, difficulty: 51, intent: 'Commercial', trend: 'up', opportunity: 'low', cpc: 3.90 },
  { keyword: 'car loans for bad credit', position: 12, volume: 5400, difficulty: 70, intent: 'Commercial', trend: 'stable', opportunity: 'high', cpc: 4.20 },
  { keyword: 'best car finance uk', position: 15, volume: 18100, difficulty: 79, intent: 'Commercial', trend: 'up', opportunity: 'high', cpc: 3.60 },
  { keyword: 'car finance no credit check', position: 6, volume: 3600, difficulty: 55, intent: 'Commercial', trend: 'down', opportunity: 'medium', cpc: 5.80 },
  { keyword: 'used car finance deals', position: 22, volume: 12100, difficulty: 65, intent: 'Commercial', trend: 'up', opportunity: 'high', cpc: 2.80 },
  { keyword: 'car finance checker', position: 18, volume: 6600, difficulty: 58, intent: 'Informational', trend: 'up', opportunity: 'high', cpc: 1.90 },
];

// [API: GET /api/signal/keywords/gaps]
const KEYWORD_GAPS = [
  { keyword: 'car finance comparison uk', volume: 8100, difficulty: 61, competitorRanking: 'Zuto #2', ourRanking: 'Not ranking', opportunity: 'critical', estimatedTraffic: 1200 },
  { keyword: 'how to get car finance with bad credit', volume: 6600, difficulty: 42, competitorRanking: 'Zuto #1', ourRanking: 'Position 31', opportunity: 'critical', estimatedTraffic: 980 },
  { keyword: 'car finance instant decision', volume: 5400, difficulty: 55, competitorRanking: 'CarFinance247 #3', ourRanking: 'Not ranking', opportunity: 'high', estimatedTraffic: 720 },
  { keyword: 'car finance eligibility checker', volume: 4400, difficulty: 48, competitorRanking: 'Zuto #2', ourRanking: 'Position 28', opportunity: 'high', estimatedTraffic: 610 },
  { keyword: 'best apr car finance uk 2026', volume: 3600, difficulty: 38, competitorRanking: 'None in top 5', ourRanking: 'Not ranking', opportunity: 'high', estimatedTraffic: 540 },
  { keyword: 'van finance comparison', volume: 2900, difficulty: 44, competitorRanking: 'Oodle #4', ourRanking: 'Position 18', opportunity: 'medium', estimatedTraffic: 320 },
  { keyword: 'car finance for self employed', volume: 2400, difficulty: 40, competitorRanking: 'None ranking', ourRanking: 'Not ranking', opportunity: 'medium', estimatedTraffic: 280 },
  { keyword: 'second hand car finance calculator', volume: 5900, difficulty: 52, competitorRanking: 'CarFinance247 #5', ourRanking: 'Position 24', opportunity: 'high', estimatedTraffic: 760 },
];

// [API: GET /api/signal/seo/technical]
const TECHNICAL_ISSUES = [
  { category: 'Core Web Vitals', status: 'amber', issue: 'LCP 3.1s on mobile (target: <2.5s)', impact: 'high', effort: 'medium' },
  { category: 'Indexation', status: 'green', issue: '312 of 318 pages indexed correctly', impact: 'low', effort: 'low' },
  { category: 'Structured Data', status: 'amber', issue: 'FAQ schema missing on 14 key calculator pages', impact: 'high', effort: 'low' },
  { category: 'Internal Links', status: 'green', issue: 'Good internal linking — average 8 links per key page', impact: 'low', effort: 'low' },
  { category: 'Canonical Tags', status: 'green', issue: 'Canonicals correctly implemented site-wide', impact: 'low', effort: 'low' },
  { category: 'Page Speed', status: 'red', issue: 'Mobile PageSpeed 52/100 — JavaScript blocking render', impact: 'critical', effort: 'high' },
  { category: 'HTTPS/Security', status: 'green', issue: 'SSL valid, HSTS configured, no mixed content', impact: 'low', effort: 'low' },
  { category: 'XML Sitemap', status: 'green', issue: 'Sitemap submitted and valid, 312 URLs', impact: 'low', effort: 'low' },
  { category: 'Duplicate Content', status: 'amber', issue: '6 near-duplicate location pages detected', impact: 'medium', effort: 'medium' },
  { category: 'Schema Markup', status: 'amber', issue: 'Review schema present but not on all lender comparison pages', impact: 'medium', effort: 'low' },
];

// [API: GET /api/signal/seo/content-gaps]
const CONTENT_OPPORTUNITIES = [
  { title: 'Bad Credit Car Finance Guide 2026', type: 'Hub page', volume: 18400, priority: 'critical', reason: 'Zuto dominates this — their guide drives 12K monthly visits' },
  { title: 'Car Finance Calculator with Bad Credit', type: 'Tool + content', volume: 14200, priority: 'critical', reason: '247CF has a calculator but no landing page SEO optimised for bad credit variant' },
  { title: 'Van Finance for Bad Credit UK', type: 'Category page', volume: 4800, priority: 'high', reason: 'Strong van creative performance in paid — missing organic counterpart' },
  { title: 'Car Finance Comparison: 247CF vs Zuto vs Oodle', type: 'Comparison page', volume: 6600, priority: 'high', reason: 'Users search comparison terms — capture with honest comparison content' },
  { title: 'Car Finance Eligibility: Soft Search Guide', type: 'Informational', volume: 3900, priority: 'high', reason: 'Low difficulty keyword with no clear winner — first mover advantage available' },
  { title: '247 CarFinance Reviews 2026', type: 'Review/social proof', volume: 5200, priority: 'medium', reason: 'Trust signals needed — Trustpilot 4.9 not leveraged in SEO content' },
];

const TAU_SIGNAL_PITCH = {
  headline: 'Why TAU Signal SEO beats AdThens for 247CF',
  points: [
    {
      icon: Target,
      title: 'Competitor intelligence at depth',
      text: 'Signal continuously monitors all key competitors (Zuto, Oodle, CarFinance247, Moneybarn) — tracking keyword movements, content launches, and link acquisition in real time.',
      adthens: 'AdThens: Generic rank tracking with no automotive/finance specialist lens',
    },
    {
      icon: Zap,
      title: 'Action-ready gap analysis',
      text: 'Signal identifies not just gaps but which gaps are winnable — cross-referenced against domain authority, content volume and commercial intent.',
      adthens: 'AdThens: Keyword gap reports without prioritisation for your specific competitive set',
    },
    {
      icon: Layers,
      title: 'Integrated with paid media',
      text: 'Signal connects SEO data with your Meta and Google performance — identifying where organic can replace or amplify paid at lower CAC.',
      adthens: 'AdThens: Siloed SEO tool with no paid media integration or unified view',
    },
    {
      icon: Award,
      title: 'FCA-aware content strategy',
      text: 'TAU Signal understands UK financial regulation — flagging when competitor content may breach FCA guidance and identifying compliant content opportunities.',
      adthens: 'AdThens: No regulatory awareness — generic tool not built for financial services',
    },
  ],
};

// ─── Colour helpers ───────────────────────────────────────────────────────
const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const OPPORTUNITY_COLORS = { critical: 'red', high: 'orange', medium: 'amber' };
const OPPORTUNITY_LABEL = { critical: 'Critical', high: 'High', medium: 'Medium' };

function OpportunityBadge({ level }) {
  const colors = {
    critical: 'bg-red-100 text-red-700 border border-red-200',
    high: 'bg-orange-100 text-orange-700 border border-orange-200',
    medium: 'bg-amber-100 text-amber-700 border border-amber-200',
    low: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[level] || colors.low}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

function IntentBadge({ intent }) {
  const colors = {
    Brand: 'bg-blue-100 text-blue-700',
    Commercial: 'bg-green-100 text-green-700',
    Informational: 'bg-purple-100 text-purple-700',
    Navigational: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[intent] || 'bg-gray-100 text-gray-600'}`}>
      {intent}
    </span>
  );
}

function PositionIndicator({ position }) {
  const isRanking = typeof position === 'number';
  const color = !isRanking ? 'text-gray-400' : position <= 3 ? 'text-green-600' : position <= 10 ? 'text-blue-600' : position <= 20 ? 'text-amber-600' : 'text-red-500';
  const bg = !isRanking ? 'bg-gray-100' : position <= 3 ? 'bg-green-100' : position <= 10 ? 'bg-blue-100' : position <= 20 ? 'bg-amber-100' : 'bg-red-100';
  return (
    <span className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold ${bg} ${color}`}>
      {isRanking ? `#${position}` : '—'}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────
export default function SEOIntelligence() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { key: 'overview', label: 'Overview' },
    { key: 'competitors', label: 'Competitive Intel' },
    { key: 'keywords', label: 'Keyword Ranking' },
    { key: 'gaps', label: 'Gap Analysis' },
    { key: 'technical', label: 'Technical Audit' },
    { key: 'signal', label: 'TAU Signal SEO' },
  ];

  const competitorChartData = COMPETITOR_SEO.map(c => ({
    name: c.name.replace(' Car Finance', '').replace(' CarFinance', ''),
    traffic: Math.round(c.traffic / 1000),
    keywords: Math.round(c.keywords / 100),
    da: c.da,
    fill: c.isSelf ? '#3B82F6' : '#94A3B8',
  }));

  const rankDistChart = COMPETITOR_SEO.map(c => ({
    name: c.name.replace(' Car Finance', '').replace(' CarFinance', ''),
    'Top 3': c.rankPos1to3,
    'Pos 4-10': c.rankPos4to10,
    'Pos 11-30': c.rankPos11to30,
  }));

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Search size={16} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">SEO Intelligence</h2>
          </div>
          <p className="text-sm text-gray-500">247carfinance.co.uk · Signal v2 SEO Scan · March 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Signal v2 · Last scan 28 Mar 2026</span>
          </div>
          <div className="text-xs bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-blue-700 flex items-center gap-1">
            <Layers size={12} />
            <span>Powered by TAU Signal</span>
          </div>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeSection === s.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              label="Organic Traffic/mo"
              value="142K"
              sub="247carfinance.co.uk"
              trend="up"
              trendValue="+12.4% YoY"
              color="green"
              sparklineTrend="up"
            />
            <KPICard
              label="Ranking Keywords"
              value="4,820"
              sub="across all positions"
              trend="up"
              trendValue="+340 keywords"
              color="blue"
              sparklineTrend="up"
            />
            <KPICard
              label="Traffic Value/mo"
              value="£218K"
              sub="vs £334K paid spend"
              trend="up"
              trendValue="35% YoY growth"
              color="purple"
              sparklineTrend="up"
            />
            <KPICard
              label="Domain Authority"
              value="58 / 100"
              sub="vs Zuto 62"
              trend="up"
              trendValue="+3 this quarter"
              color="orange"
              sparklineTrend="up"
            />
          </div>

          {/* Score overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Technical SEO', score: 84, grade: 'B+', color: '#3B82F6', desc: 'Core Web Vitals and mobile speed need work' },
              { label: 'Content Quality', score: 71, grade: 'C+', color: '#F59E0B', desc: 'Gap vs competitors on informational content depth' },
              { label: 'Link Profile', score: 79, grade: 'B', color: '#10B981', desc: 'Good backlink base — 1,240 referring domains' },
            ].map(({ label, score, grade, color, desc }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                  <GradeBadge grade={grade} />
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl font-bold text-gray-900">{score}</span>
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
                  </div>
                </div>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          {/* Top alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AlertCard severity="critical" title="Content gap costing ~£18K/month in paid"
              text="247CF ranks outside top 30 for 'bad credit car finance guide' — Zuto captures 12K monthly organic visits from this term alone, reducing their paid CPA significantly." />
            <AlertCard severity="warning" title="Mobile PageSpeed 52/100 — damaging rankings"
              text="Google prioritises mobile performance. Improving PageSpeed score from 52 to 80+ could improve rankings on 40+ competitive keywords." />
            <AlertCard severity="info" title="Van finance SEO opportunity"
              text="Strong van finance paid performance is not supported by organic content. Building 5 van finance SEO pages could generate 2K+ monthly organic applications." />
            <AlertCard severity="success" title="Brand terms fully owned"
              text="247 CarFinance brand terms dominate position 1 across all brand variants. Excellent brand protection — maintain with ongoing content freshness." />
          </div>
        </div>
      )}

      {/* ── COMPETITIVE INTEL ── */}
      {activeSection === 'competitors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <SectionHeader title="Organic Traffic Comparison" sub="Estimated monthly organic sessions (thousands)" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={competitorChartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="K" />
                  <Tooltip formatter={(v) => [`${v}K visits`, 'Traffic']} />
                  <Bar dataKey="traffic" radius={[4, 4, 0, 0]}>
                    {competitorChartData.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <SectionHeader title="Ranking Distribution" sub="Keywords by position bracket across competitors" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={rankDistChart} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Top 3" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Pos 4-10" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="Pos 11-30" stackId="a" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competitor table */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <SectionHeader title="Competitor SEO Scorecard" sub="Key SEO metrics across the UK car finance market" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Competitor</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">DA</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Traffic/mo</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Keywords</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Backlinks</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Top 3 Rankings</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Top Keywords</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITOR_SEO.map((c) => (
                    <tr key={c.name} className={`border-b border-gray-100 hover:bg-gray-50 ${c.isSelf ? 'bg-blue-50' : ''}`}>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          {c.isSelf && <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">YOU</span>}
                          <div>
                            <div className="font-semibold text-gray-800 text-xs">{c.name}</div>
                            <div className="text-gray-400 text-[10px]">{c.domain}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`font-bold text-sm ${c.da >= 60 ? 'text-green-600' : c.da >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{c.da}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-700 font-medium">{(c.traffic / 1000).toFixed(0)}K</td>
                      <td className="py-2.5 px-3 text-right text-gray-600">{c.keywords.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-gray-600">{(c.backlinks / 1000).toFixed(1)}K</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">{c.rankPos1to3}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {c.topKeywords.slice(0, 2).map(kw => (
                            <span key={kw} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{kw}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── KEYWORD RANKING ── */}
      {activeSection === 'keywords' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <SectionHeader title="Top Keyword Rankings" sub="Current position, search volume, difficulty and opportunity score" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Keyword</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">Position</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Volume/mo</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Difficulty</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">CPC</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">Intent</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">Trend</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">Opportunity</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_KEYWORDS.map((kw) => (
                    <tr key={kw.keyword} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-gray-800 font-medium text-xs">{kw.keyword}</td>
                      <td className="py-2.5 px-3 text-center">
                        <PositionIndicator position={kw.position} />
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-600 font-mono text-xs">{kw.volume.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full">
                            <div className="h-1.5 rounded-full" style={{
                              width: `${kw.difficulty}%`,
                              backgroundColor: kw.difficulty > 70 ? '#EF4444' : kw.difficulty > 50 ? '#F59E0B' : '#10B981'
                            }} />
                          </div>
                          <span className="text-xs text-gray-500">{kw.difficulty}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-600 font-mono text-xs">£{kw.cpc.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-center"><IntentBadge intent={kw.intent} /></td>
                      <td className="py-2.5 px-3 text-center">
                        {kw.trend === 'up' ? <TrendingUp size={14} className="text-green-500 mx-auto" /> :
                          kw.trend === 'down' ? <TrendingDown size={14} className="text-red-500 mx-auto" /> :
                          <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center"><OpportunityBadge level={kw.opportunity} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick wins chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <SectionHeader title="High-Volume Keywords: Ranking vs Difficulty" sub="Size = monthly search volume. Target upper-left quadrant: high volume, lower difficulty, weaker position" />
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <div className="text-center">
                <BarChart2 size={24} className="mx-auto mb-2 opacity-40" />
                <div>Scatter plot: Position vs Difficulty (volume-weighted)</div>
                <div className="text-xs mt-1">Signals: car finance calculator (#8), best car finance uk (#15) are key targets</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GAP ANALYSIS ── */}
      {activeSection === 'gaps' && (
        <div className="space-y-6">
          <AlertCard severity="critical"
            title="8 high-value keyword gaps identified"
            text="Competitors are capturing an estimated 5,400+ monthly visits from keywords where 247CF has no or weak ranking. Combined monthly traffic value: ~£28,000." />

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <SectionHeader title="Keyword Gap Analysis" sub="Keywords where competitors rank but 247CF doesn't — ordered by opportunity" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Keyword</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Volume/mo</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">Difficulty</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Best Competitor</th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Our Position</th>
                    <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Est. Traffic Gain</th>
                    <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {KEYWORD_GAPS.map((gap) => (
                    <tr key={gap.keyword} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-gray-800 font-medium text-xs">{gap.keyword}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs text-gray-600">{gap.volume.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-xs font-medium ${gap.difficulty > 55 ? 'text-amber-600' : 'text-green-600'}`}>{gap.difficulty}</span>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-gray-600">{gap.competitorRanking}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-xs font-medium ${gap.ourRanking === 'Not ranking' ? 'text-red-500' : 'text-amber-600'}`}>
                          {gap.ourRanking}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-xs font-semibold text-green-700">+{gap.estimatedTraffic.toLocaleString()}/mo</span>
                      </td>
                      <td className="py-2.5 px-3 text-center"><OpportunityBadge level={gap.opportunity} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content opportunities */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <SectionHeader title="Content Opportunities" sub="Priority content to create or enhance — mapped to gap keywords" />
            <div className="space-y-3">
              {CONTENT_OPPORTUNITIES.map((opp, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-800">{opp.title}</span>
                      <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-500">{opp.type}</span>
                    </div>
                    <div className="text-xs text-gray-500">{opp.reason}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs font-semibold text-gray-700">{opp.volume.toLocaleString()}/mo</div>
                    <div className="text-[10px] text-gray-400">search vol</div>
                  </div>
                  <OpportunityBadge level={opp.priority} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TECHNICAL AUDIT ── */}
      {activeSection === 'technical' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard label="Technical Score" value="84/100" color="blue" sparklineTrend="up" sub="Grade B+" />
            <KPICard label="Indexed Pages" value="312" color="green" sparklineTrend="stable" sub="of 318 total" />
            <KPICard label="Mobile PageSpeed" value="52/100" color="red" sparklineTrend="down" sub="🔴 Critical" />
            <KPICard label="Core Web Vitals" value="LCP 3.1s" color="orange" sparklineTrend="down" sub="Target: <2.5s" />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <SectionHeader title="Technical SEO Health Checks" sub="10 checks across Core Web Vitals, indexation, structured data and site health" />
            <div className="space-y-2">
              {TECHNICAL_ISSUES.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <StatusDot status={issue.status} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-gray-700">{issue.category}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        issue.impact === 'critical' ? 'bg-red-100 text-red-600' :
                        issue.impact === 'high' ? 'bg-orange-100 text-orange-600' :
                        issue.impact === 'medium' ? 'bg-amber-100 text-amber-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>{issue.impact} impact</span>
                    </div>
                    <div className="text-xs text-gray-500">{issue.issue}</div>
                  </div>
                  <div className={`text-[10px] px-2 py-0.5 rounded flex-shrink-0 ${
                    issue.effort === 'low' ? 'bg-green-100 text-green-600' :
                    issue.effort === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {issue.effort} effort
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick wins */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Zap size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-900 text-sm mb-2">Quick Technical Wins (Low effort / High impact)</div>
                <div className="space-y-1.5">
                  <div className="text-sm text-amber-800">1. <strong>Add FAQ schema</strong> to 14 calculator pages — low effort, could win featured snippets for 6+ keywords</div>
                  <div className="text-sm text-amber-800">2. <strong>Add Review schema</strong> to lender comparison pages — leverage Trustpilot 4.9 in SERPs</div>
                  <div className="text-sm text-amber-800">3. <strong>Merge duplicate location pages</strong> — consolidate link equity from 6 near-duplicate pages</div>
                  <div className="text-sm text-amber-800">4. <strong>Mobile PageSpeed sprint</strong> — defer non-critical JavaScript to improve from 52 to 75+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAU SIGNAL SEO PITCH ── */}
      {activeSection === 'signal' && (
        <div className="space-y-6">

          {/* Hero */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Layers size={24} className="text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-200 mb-1">TAU Signal v2</div>
                <h3 className="text-xl font-bold mb-2">{TAU_SIGNAL_PITCH.headline}</h3>
                <p className="text-sm text-blue-100 max-w-2xl">
                  Before committing budget to AdThens or similar generic SEO tools, see what TAU Signal delivers specifically for the UK car finance market — with competitive intelligence built for your segment, not the generic web.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TAU_SIGNAL_PITCH.points.map(({ icon: Icon, title, text, adthens }, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Icon size={16} className="text-blue-600" />
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{title}</div>
                </div>
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <CheckCircle size={10} /> TAU Signal
                  </div>
                  <p className="text-xs text-green-800">{text}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <AlertTriangle size={10} /> vs AdThens
                  </div>
                  <p className="text-xs text-gray-500">{adthens}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ROI estimate */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <SectionHeader title="SEO Investment ROI Estimate" sub="Based on current gap analysis and typical SEO timelines for the car finance sector" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-700 mb-1">5,410</div>
                <div className="text-xs text-green-600 font-semibold">Est. new monthly visits</div>
                <div className="text-xs text-gray-500 mt-1">If top 8 gaps closed within 90 days</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-700 mb-1">£28K</div>
                <div className="text-xs text-blue-600 font-semibold">Monthly traffic value</div>
                <div className="text-xs text-gray-500 mt-1">Equivalent paid media cost at current CPC</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-2xl font-bold text-purple-700 mb-1">6–9mo</div>
                <div className="text-xs text-purple-600 font-semibold">Estimated payback</div>
                <div className="text-xs text-gray-500 mt-1">Based on content production + SEO effort investment</div>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <ArrowUpRight size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-indigo-900 text-sm mb-2">Recommended Next Steps — SEO with TAU Signal</div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold text-xs flex-shrink-0">1.</span>
                    <span className="text-sm text-indigo-800"><strong>Run a full TAU Signal SEO scan</strong> on 247carfinance.co.uk and top 5 competitors — generates live gap data replacing this prototype view</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold text-xs flex-shrink-0">2.</span>
                    <span className="text-sm text-indigo-800"><strong>Prioritise mobile PageSpeed sprint</strong> — quick technical fix with broad ranking improvement potential</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold text-xs flex-shrink-0">3.</span>
                    <span className="text-sm text-indigo-800"><strong>Commission 'Bad Credit Car Finance Guide 2026'</strong> — highest volume gap, Zuto is beatable with better content and stronger E-E-A-T signals</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold text-xs flex-shrink-0">4.</span>
                    <span className="text-sm text-indigo-800"><strong>Add FAQ + Review schema</strong> to calculator and comparison pages — quick structural win</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold text-xs flex-shrink-0">5.</span>
                    <span className="text-sm text-indigo-800"><strong>Integrate TAU Signal into monthly reporting</strong> — track SEO progress alongside Meta and Google paid in one dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
