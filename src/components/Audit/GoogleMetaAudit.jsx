/**
 * GoogleMetaAudit.jsx
 * Audit page for Google Ads & Meta performance — 247 CarFinance
 *
 * Currently uses live data via usePerformanceData() hook.
 * Prototype audit findings are hardcoded below; replace with API calls
 * to a TAU Signal audit endpoint when available.
 *
 * Future API integration points are marked: // [API: ...]
 */

import { useMemo, useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { usePerformanceData, fmt } from '../../services/dataLoader';
import KPICard from '../shared/KPICard';
import AlertCard from '../shared/AlertCard';
import GradeBadge from '../shared/GradeBadge';
import StatusDot from '../shared/StatusDot';
import SectionHeader from '../shared/SectionHeader';
import {
  Search, Share2, CheckSquare, AlertTriangle, TrendingUp,
  Target, Users, BarChart2, Eye, MousePointer, Zap, Shield,
} from 'lucide-react';

// ─── Hardcoded audit findings (replace with API calls) ─────────────────────
// [API: GET /api/audit/247cf/google]
const GOOGLE_AUDIT = {
  overallGrade: 'B+',
  score: 78,
  radarScores: [
    { dimension: 'Campaign Structure', score: 82 },
    { dimension: 'Keyword Quality', score: 71 },
    { dimension: 'Ad Copy', score: 75 },
    { dimension: 'Budget Efficiency', score: 68 },
    { dimension: 'Conversion Tracking', score: 90 },
    { dimension: 'Audience Targeting', score: 80 },
  ],
  checks: [
    { id: 'conv-tracking', label: 'Conversion tracking active', status: 'green', detail: 'Application submit + phone calls tracked' },
    { id: 'brand-protection', label: 'Brand campaign live', status: 'green', detail: 'Brand terms defended at low CPA' },
    { id: 'budget-cap', label: '3 campaigns budget-limited', status: 'amber', detail: 'UK_MSS, BC_Broad and PMAX hitting daily caps — missing volume' },
    { id: 'quality-score', label: 'Quality Score visibility', status: 'amber', detail: 'Several campaigns missing QS data — review ad extensions' },
    { id: 'broad-match', label: 'Broad match spend efficiency', status: 'red', detail: 'Broad campaigns driving 38% of clicks but <10% of conversions' },
    { id: 'pmax', label: 'PMAX transparency', status: 'amber', detail: 'Performance Max consuming 22% of budget with limited reporting insight' },
    { id: 'negative-kw', label: 'Negative keyword hygiene', status: 'amber', detail: 'Last negative keyword audit >60 days ago — recommend review' },
    { id: 'ad-extensions', label: 'Ad extensions completeness', status: 'green', detail: 'Sitelinks, callouts and call extensions all active' },
    { id: 'landing-pages', label: 'Landing page relevance', status: 'green', detail: 'LP4 variant outperforming LP3 — good creative testing' },
    { id: 'geo-targeting', label: 'UK geo targeting', status: 'green', detail: 'Correctly scoped to UK; no wasted international spend' },
  ],
  insights: [
    { severity: 'critical', title: 'Broad match efficiency gap', text: 'Broad/phrase campaigns consuming 38% of Google budget but generating <10% of applications. Recommend tightening match types or adding search term exclusions urgently.' },
    { severity: 'warning', title: 'Budget caps suppressing volume', text: '3 high-performing campaigns are hitting daily budget caps. Reallocating £500/day from underperforming display campaigns could unlock additional application volume.' },
    { severity: 'warning', title: 'PMAX accountability', text: 'Performance Max campaigns have limited search term reporting. Recommend adding brand exclusions and setting asset group targets to improve signal quality.' },
    { severity: 'info', title: 'Strong brand defense', text: 'Brand campaigns are performing efficiently. Competitors bidding on "247 car finance" terms — maintain budget to protect brand SERP.' },
  ],
  campaignTypes: [
    { type: 'Search (Brand)', spend: 18420, orders: 412, status: 'green' },
    { type: 'Search (Generic)', spend: 34180, orders: 287, status: 'amber' },
    { type: 'Performance Max', spend: 22600, orders: 198, status: 'amber' },
    { type: 'Display', spend: 8900, orders: 31, status: 'red' },
    { type: 'Demand Gen', spend: 5200, orders: 44, status: 'amber' },
  ],
};

// [API: GET /api/audit/247cf/meta]
const META_AUDIT = {
  overallGrade: 'A-',
  score: 87,
  radarScores: [
    { dimension: 'Creative Diversity', score: 91 },
    { dimension: 'Audience Strategy', score: 85 },
    { dimension: 'CPA Efficiency', score: 83 },
    { dimension: 'Placement Mix', score: 72 },
    { dimension: 'Attribution Setup', score: 88 },
    { dimension: 'Funnel Coverage', score: 89 },
  ],
  checks: [
    { id: 'pixel', label: 'Meta Pixel firing correctly', status: 'green', detail: 'submit_application_website event tracking active across all campaigns' },
    { id: 'cbo', label: 'Campaign Budget Optimisation active', status: 'green', detail: 'Advantage+ budget allocation running on scaling adsets' },
    { id: 'creative-refresh', label: 'Creative refresh cadence', status: 'green', detail: '7+ active ad variants per adset — good creative testing hygiene' },
    { id: 'frequency', label: 'Ad frequency under control', status: 'amber', detail: 'Car Creative campaign at 3.65 frequency — approaching fatigue territory (>4)' },
    { id: 'audience-network', label: 'Audience Network efficiency', status: 'red', detail: 'Audience Network placements showing £62 CPA vs platform average of £15 — recommend exclusion' },
    { id: 'retargeting', label: 'Retargeting funnel active', status: 'green', detail: 'BOF retargeting campaigns running — lower funnel coverage confirmed' },
    { id: 'advantage-plus', label: 'Advantage+ Shopping use', status: 'amber', detail: 'Not currently leveraging Advantage+ Shopping — test recommended for Q2' },
    { id: 'lookalike', label: 'Lookalike audiences seeded', status: 'green', detail: 'LAL built from application submitters — good quality seed audience' },
    { id: 'attribution', label: '7-day click attribution', status: 'green', detail: '7-day click / 1-day view attribution active — aligned with FCA journey complexity' },
    { id: 'age-gender', label: 'Demographic targeting', status: 'amber', detail: '18-24 age bracket underperforming — CPA 43% higher than 25-34 bracket' },
  ],
  insights: [
    { severity: 'critical', title: 'Audience Network wasting budget', text: 'Audience Network placements (especially in-app) generating £62 CPA vs platform average of £14.50. Recommend immediate exclusion to redirect spend to Facebook/Instagram feeds.' },
    { severity: 'warning', title: 'Creative frequency risk on Car Creative', text: 'Main scaling adset approaching frequency fatigue (3.65). Plan creative refresh for April to maintain CTR and avoid CPM inflation.' },
    { severity: 'warning', title: '18-24 age segment inefficiency', text: '18-24 cohort spending 21% of budget but generating proportionally fewer applications. Consider excluding or reducing bids — or testing different messaging angles.' },
    { severity: 'info', title: 'Strong Bad Credit creative performance', text: 'Bad Credit interest-targeted campaigns delivering consistent £14.50 CPA. Van-specific creative also performing above benchmark. Scale opportunity confirmed.' },
  ],
  adsetBreakdown: [
    { name: 'Car / Bad Credit / Advantage+', spend: 26924, results: 1860, cpa: 14.48, status: 'green' },
    { name: 'Van / Bad Credit / Broad', spend: 33005, results: 1789, cpa: 18.45, status: 'green' },
    { name: 'Van / Generic / Broad', spend: 10407, results: 551, cpa: 18.89, status: 'amber' },
    { name: 'Car / Retargeting', spend: 4800, results: 180, cpa: 26.67, status: 'amber' },
    { name: 'Dynamic Ads / Car', spend: 2100, results: 54, cpa: 38.89, status: 'red' },
  ],
  placementBreakdown: [
    { name: 'Facebook Feed', spend: 41200, cpa: 13.2, pct: 42 },
    { name: 'Instagram Feed', spend: 28400, cpa: 15.8, pct: 29 },
    { name: 'Facebook Stories', spend: 12300, cpa: 18.4, pct: 13 },
    { name: 'Instagram Reels', spend: 9800, cpa: 21.1, pct: 10 },
    { name: 'Audience Network', spend: 4800, cpa: 62.4, pct: 5 },
    { name: 'Messenger', spend: 980, cpa: 44.2, pct: 1 },
  ],
};

// ─── Colour palette ─────────────────────────────────────────────────────────
const PLATFORM_COLORS = {
  google: '#4285F4',
  meta: '#1877F2',
};
const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

// ─── Sub-components ──────────────────────────────────────────────────────────

function AuditScoreRing({ score, grade, platform }) {
  const color = platform === 'google' ? PLATFORM_COLORS.google : PLATFORM_COLORS.meta;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={100} height={100}>
        <circle cx={50} cy={50} r={40} fill="none" stroke="#E5E7EB" strokeWidth={8} />
        <circle
          cx={50} cy={50} r={40} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x={50} y={46} textAnchor="middle" className="fill-gray-900" fontSize={18} fontWeight={700}>{score}</text>
        <text x={50} y={61} textAnchor="middle" className="fill-gray-400" fontSize={10}>/100</text>
      </svg>
      <div className="mt-1">
        <GradeBadge grade={grade} />
      </div>
    </div>
  );
}

function CheckList({ checks }) {
  return (
    <div className="space-y-2">
      {checks.map((c) => (
        <div key={c.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <StatusDot status={c.status} size="md" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-800">{c.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuditRadar({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#6B7280' }} />
        <Radar dataKey="score" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function PlacementTable({ data }) {
  const maxCpa = Math.max(...data.map(p => p.cpa));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Placement</th>
            <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Spend</th>
            <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Share</th>
            <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">CPA</th>
            <th className="py-2 px-3 text-xs text-gray-500 font-medium">Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => {
            const efficiency = 1 - (p.cpa / maxCpa);
            const barColor = efficiency > 0.7 ? '#10B981' : efficiency > 0.4 ? '#F59E0B' : '#EF4444';
            return (
              <tr key={p.name} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-800 font-medium">{p.name}</td>
                <td className="py-2 px-3 text-right text-gray-600">{fmt.currency(p.spend)}</td>
                <td className="py-2 px-3 text-right text-gray-600">{p.pct}%</td>
                <td className={`py-2 px-3 text-right font-mono font-medium ${p.cpa > 30 ? 'text-red-600' : p.cpa > 20 ? 'text-amber-600' : 'text-green-600'}`}>
                  {fmt.currency(p.cpa)}
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${efficiency * 100}%`, backgroundColor: barColor }} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AdsetTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Adset</th>
            <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Spend</th>
            <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Results</th>
            <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">CPA</th>
            <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">Health</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr key={a.name} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-3 text-gray-800 text-xs max-w-xs truncate font-medium">{a.name}</td>
              <td className="py-2 px-3 text-right text-gray-600">{fmt.currency(a.spend)}</td>
              <td className="py-2 px-3 text-right text-gray-600">{a.results.toLocaleString()}</td>
              <td className={`py-2 px-3 text-right font-mono font-medium ${a.cpa > 25 ? 'text-red-600' : a.cpa > 18 ? 'text-amber-600' : 'text-green-600'}`}>
                £{a.cpa.toFixed(2)}
              </td>
              <td className="py-2 px-3 text-center">
                <StatusDot status={a.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function GoogleMetaAudit() {
  const { searchData, metaAdsets, metaAds, loading, error } = usePerformanceData();
  const [activeTab, setActiveTab] = useState('google');

  // Live metrics from real data  
  const googleLive = useMemo(() => {
    const active = searchData.filter(r => r.status === 'Enabled' && r.cost_gbp > 0);
    const totals = active.reduce((a, r) => ({
      cost: a.cost + r.cost_gbp,
      orders: a.orders + r.orders,
      clicks: a.clicks + r.clicks,
      impressions: a.impressions + r.impressions,
    }), { cost: 0, orders: 0, clicks: 0, impressions: 0 });
    return {
      ...totals,
      cpa: totals.orders > 0 ? totals.cost / totals.orders : 0,
      ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      activeCampaigns: [...new Set(active.map(r => r.campaign))].length,
    };
  }, [searchData]);

  const metaLive = useMemo(() => {
    const totals = metaAdsets.reduce((a, r) => ({
      spend: a.spend + (r.spend || 0),
      results: a.results + (r.results || 0),
      impressions: a.impressions + (r.impressions || 0),
    }), { spend: 0, results: 0, impressions: 0 });
    return {
      ...totals,
      cpa: totals.results > 0 ? totals.spend / totals.results : 0,
      activeAdsets: metaAdsets.filter(a => a.delivery === 'active').length,
      activeAds: metaAds.filter(a => a.delivery === 'active').length,
    };
  }, [metaAdsets, metaAds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading audit data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <AlertCard severity="critical" title="Data load error" text={error} />;
  }

  const audit = activeTab === 'google' ? GOOGLE_AUDIT : META_AUDIT;
  const liveColor = activeTab === 'google' ? PLATFORM_COLORS.google : PLATFORM_COLORS.meta;

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Performance Audit</h2>
          <p className="text-sm text-gray-500 mt-0.5">Google Ads & Meta — 247 CarFinance · Jan–Mar 2026</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertTriangle size={13} className="text-amber-500" />
          <span>Prototype audit — findings are based on data analysis. Future releases will auto-generate via TAU Signal API.</span>
        </div>
      </div>

      {/* Platform tab switcher */}
      <div className="flex gap-2">
        {[
          { key: 'google', icon: Search, label: 'Google Ads' },
          { key: 'meta', icon: Share2, label: 'Meta Ads' },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? 'text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={activeTab === key ? { backgroundColor: PLATFORM_COLORS[key] } : {}}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* KPI strip — live data */}
      {activeTab === 'google' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Active Campaigns" value={googleLive.activeCampaigns} color="blue" sparklineTrend="up" />
          <KPICard label="Total Spend" value={fmt.currency(googleLive.cost)} color="purple" sparklineTrend="up" />
          <KPICard label="Applications" value={googleLive.orders.toLocaleString()} color="green" sparklineTrend="up" />
          <KPICard label="Avg CPA" value={googleLive.cpa > 0 ? fmt.cpa(googleLive.cpa) : '—'} color={googleLive.cpa > 25 ? 'red' : 'green'} sparklineTrend="down" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Active Adsets" value={metaLive.activeAdsets} color="blue" sparklineTrend="up" />
          <KPICard label="Total Spend" value={fmt.currency(metaLive.spend)} color="purple" sparklineTrend="up" />
          <KPICard label="Applications" value={metaLive.results.toLocaleString()} color="green" sparklineTrend="up" />
          <KPICard label="Avg CPA" value={metaLive.cpa > 0 ? `£${metaLive.cpa.toFixed(2)}` : '—'} color={metaLive.cpa > 20 ? 'orange' : 'green'} sparklineTrend="down" />
        </div>
      )}

      {/* Audit score + radar + checks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Score card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Audit Score</div>
          <AuditScoreRing score={audit.score} grade={audit.overallGrade} platform={activeTab} />
          <div className="mt-4 text-xs text-gray-400 leading-relaxed">
            Based on {audit.checks.length} health checks across structure, spend efficiency, tracking and creative quality.
          </div>
          <div className="mt-3 flex gap-3 text-xs">
            <span className="flex items-center gap-1"><StatusDot status="green" />{audit.checks.filter(c => c.status === 'green').length} passing</span>
            <span className="flex items-center gap-1"><StatusDot status="amber" />{audit.checks.filter(c => c.status === 'amber').length} warnings</span>
            <span className="flex items-center gap-1"><StatusDot status="red" />{audit.checks.filter(c => c.status === 'red').length} critical</span>
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionHeader title="Performance Dimensions" sub="Scored 0–100 across 6 audit dimensions" />
          <AuditRadar data={audit.radarScores} color={liveColor} />
        </div>

        {/* Health checks */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionHeader title="Health Checks" sub={`${audit.checks.length} checks across key audit areas`} />
          <CheckList checks={audit.checks} />
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionHeader title="Audit Insights" sub="Key findings and recommended actions" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {audit.insights.map((insight, i) => (
            <AlertCard key={i} severity={insight.severity} title={insight.title} text={insight.text} />
          ))}
        </div>
      </div>

      {/* Platform-specific deep-dive */}
      {activeTab === 'google' ? (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionHeader title="Campaign Type Breakdown" sub="Spend and conversion performance by campaign type" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Type</th>
                  <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Spend</th>
                  <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">Applications</th>
                  <th className="text-right py-2 px-3 text-xs text-gray-500 font-medium">CPA</th>
                  <th className="text-center py-2 px-3 text-xs text-gray-500 font-medium">Status</th>
                  <th className="py-2 px-3 text-xs text-gray-500 font-medium">Spend share</th>
                </tr>
              </thead>
              <tbody>
                {GOOGLE_AUDIT.campaignTypes.map((ct) => {
                  const totalSpend = GOOGLE_AUDIT.campaignTypes.reduce((a, c) => a + c.spend, 0);
                  const cpa = ct.orders > 0 ? ct.spend / ct.orders : ct.spend / (ct.orders || 1);
                  const realCpa = ct.orders > 0 ? ct.spend / ct.orders : null;
                  const pct = Math.round((ct.spend / totalSpend) * 100);
                  return (
                    <tr key={ct.type} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-800 font-medium">{ct.type}</td>
                      <td className="py-2 px-3 text-right text-gray-600">{fmt.currency(ct.spend)}</td>
                      <td className="py-2 px-3 text-right text-gray-600">{ct.orders}</td>
                      <td className={`py-2 px-3 text-right font-mono font-medium ${ct.orders === 0 ? 'text-gray-400' : ct.spend / ct.orders > 150 ? 'text-red-600' : 'text-green-600'}`}>
                        {ct.orders > 0 ? fmt.currency(ct.spend / ct.orders) : '—'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <StatusDot status={ct.status} />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <SectionHeader title="Adset Performance" sub="Results and CPA by adset — Jan to Mar 2026" />
            <AdsetTable data={META_AUDIT.adsetBreakdown} />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <SectionHeader title="Placement Efficiency" sub="CPA by Meta placement — identify waste" />
            <PlacementTable data={META_AUDIT.placementBreakdown} />
          </div>
        </div>
      )}

      {/* Recommendations summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap size={18} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-blue-900 text-sm mb-2">
              Top {activeTab === 'google' ? 'Google' : 'Meta'} Actions This Week
            </div>
            <div className="space-y-1.5">
              {activeTab === 'google' ? (
                <>
                  <div className="text-sm text-blue-800">1. <strong>Pause or restructure broad match campaigns</strong> — reallocate £10K+/month to exact/phrase match</div>
                  <div className="text-sm text-blue-800">2. <strong>Lift daily budget caps</strong> on UK_MSS and BC_Broad by £500/day each</div>
                  <div className="text-sm text-blue-800">3. <strong>Audit PMAX asset groups</strong> — add brand exclusion lists to prevent cannibalisation</div>
                  <div className="text-sm text-blue-800">4. <strong>Run negative keyword audit</strong> — pull search terms report and add 50+ negatives</div>
                </>
              ) : (
                <>
                  <div className="text-sm text-blue-800">1. <strong>Exclude Audience Network</strong> immediately — saving ~£4.8K/month at £62 CPA</div>
                  <div className="text-sm text-blue-800">2. <strong>Prepare creative refresh</strong> for Car Creative adset — frequency at 3.65, refresh before 4.0</div>
                  <div className="text-sm text-blue-800">3. <strong>Exclude 18-24 age bracket</strong> or reduce bids by 30% — CPA 43% above average</div>
                  <div className="text-sm text-blue-800">4. <strong>Test Advantage+ Shopping</strong> campaigns in Q2 with application as conversion goal</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
