import { useState, useMemo } from 'react';
import {
  ComposedChart, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import KPICard from '../shared/KPICard';
import AlertCard from '../shared/AlertCard';
import SectionHeader from '../shared/SectionHeader';
import { TrendingUp, Eye, ThumbsUp, Play, Users, Clock, Target, Zap } from 'lucide-react';

// ── Realistic Experian YouTube data ─────────────────────────────────────────

const WEEKLY_TREND = [
  { week: 'Jan W1', views: 312400, vtr: 42.1, cpv: 0.031, conversions: 188 },
  { week: 'Jan W2', views: 298700, vtr: 43.4, cpv: 0.029, conversions: 201 },
  { week: 'Jan W3', views: 341200, vtr: 44.8, cpv: 0.027, conversions: 224 },
  { week: 'Jan W4', views: 389500, vtr: 46.2, cpv: 0.026, conversions: 267 },
  { week: 'Feb W1', views: 412300, vtr: 47.1, cpv: 0.025, conversions: 298 },
  { week: 'Feb W2', views: 438900, vtr: 48.3, cpv: 0.024, conversions: 334 },
  { week: 'Feb W3', views: 401100, vtr: 46.9, cpv: 0.025, conversions: 311 },
  { week: 'Feb W4', views: 467800, vtr: 49.6, cpv: 0.023, conversions: 378 },
  { week: 'Mar W1', views: 502400, vtr: 50.8, cpv: 0.022, conversions: 412 },
];

const CAMPAIGNS = [
  { name: 'Credit Score Awareness — TrueView', type: 'TrueView In-Stream', budget: 18000, spend: 16840, views: 681200, vtr: 51.2, cpv: 0.025, conversions: 489, cpl: 34.44, status: 'Active' },
  { name: 'Identity Protection — Bumper 6s', type: 'Bumper', budget: 8000, spend: 7920, views: 1240000, vtr: null, cpv: 0.006, conversions: 312, cpl: 25.38, status: 'Active' },
  { name: 'Business Credit — Non-Skip 15s', type: 'Non-Skippable', budget: 12000, spend: 11450, views: 489300, vtr: null, cpv: 0.023, conversions: 267, cpl: 42.88, status: 'Active' },
  { name: 'Free Credit Check — Discovery', type: 'Video Discovery', budget: 9500, spend: 9120, views: 302800, vtr: 38.4, cpv: 0.030, conversions: 198, cpl: 46.06, status: 'Active' },
  { name: 'Boost Score Tips — TrueView Retarget', type: 'TrueView In-Stream', budget: 5000, spend: 4780, views: 189400, vtr: 58.9, cpv: 0.025, conversions: 156, cpl: 30.64, status: 'Active' },
  { name: 'Credit Expert Plan — YouTube Shorts', type: 'Shorts Ad', budget: 4500, spend: 3910, views: 628000, vtr: null, cpv: 0.006, conversions: 89, cpl: 43.93, status: 'Paused' },
];

const AUDIENCE_AGE = [
  { group: '18–24', pct: 14, cvr: 1.8 },
  { group: '25–34', pct: 28, cvr: 3.2 },
  { group: '35–44', pct: 31, cvr: 4.1 },
  { group: '45–54', pct: 18, cvr: 3.7 },
  { group: '55–64', pct: 7, cvr: 2.4 },
  { group: '65+',   pct: 2, cvr: 1.2 },
];

const DEVICE_SPLIT = [
  { name: 'Mobile', value: 58, color: '#3B82F6' },
  { name: 'Desktop', value: 28, color: '#8B5CF6' },
  { name: 'TV Screen', value: 11, color: '#10B981' },
  { name: 'Tablet', value: 3, color: '#F59E0B' },
];

const TOP_CREATIVES = [
  { id: 'EXP-YT-001', title: '"Check Your Score in 60s" — 30s', views: 421300, vtr: 54.1, cvr: 3.8, trend: 'up', badge: 'Top Performer' },
  { id: 'EXP-YT-002', title: '"Identity Theft Costs £1,200/yr" — 15s NS', views: 312100, vtr: null, cvr: 2.9, trend: 'up', badge: 'Efficient CPL' },
  { id: 'EXP-YT-003', title: '"Your Credit Score Explained" — 45s', views: 198400, vtr: 48.3, cvr: 2.4, trend: 'flat', badge: null },
  { id: 'EXP-YT-004', title: '"Boost in 30 Days" — Retargeting 20s', views: 134700, vtr: 61.2, cvr: 5.1, trend: 'up', badge: 'High VTR' },
  { id: 'EXP-YT-005', title: '"Free Trial — CreditExpert" — Bumper 6s', views: 892000, vtr: null, cvr: 1.6, trend: 'down', badge: null },
];

const fmt = {
  num: (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toString(),
  pct: (n) => n != null ? n.toFixed(1) + '%' : '—',
  gbp: (n) => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 0 }),
  cpv: (n) => '£' + n.toFixed(3),
};

export default function YouTubeDashboard() {
  const [sortKey, setSortKey] = useState('spend');
  const [sortDir, setSortDir] = useState('desc');

  const totals = useMemo(() => ({
    spend: CAMPAIGNS.reduce((s, c) => s + c.spend, 0),
    views: CAMPAIGNS.reduce((s, c) => s + c.views, 0),
    conversions: CAMPAIGNS.reduce((s, c) => s + c.conversions, 0),
    avgVtr: 51.2,
    avgCpv: 0.022,
  }), []);

  const sortedCampaigns = useMemo(() =>
    [...CAMPAIGNS].sort((a, b) => {
      const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0;
      return sortDir === 'desc' ? bv - av : av - bv;
    }),
  [sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">YouTube Performance</h2>
          <p className="text-xs text-gray-400 mt-0.5">Experian · Jan 1 – Mar 14, 2026 · All campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <Play size={10} /> YouTube Ads
          </span>
          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Live</span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="Total Spend" value={fmt.gbp(totals.spend)} sub="vs £58,000 budget" trend="up" trendValue="+6.2%" sparklineTrend="up" color="blue" />
        <KPICard label="Total Views" value={fmt.num(totals.views)} sub="across all formats" trend="up" trendValue="+18.4%" sparklineTrend="up" color="purple" />
        <KPICard label="Avg VTR" value={fmt.pct(totals.avgVtr)} sub="skippable formats" trend="up" trendValue="+2.1pp" sparklineTrend="up" color="green" />
        <KPICard label="Avg CPV" value={fmt.cpv(totals.avgCpv)} sub="blended" trend="down" trendValue="-12%" sparklineTrend="down" color="orange" />
        <KPICard label="Conversions" value={fmt.num(totals.conversions)} sub="sign-ups & trials" trend="up" trendValue="+31%" sparklineTrend="up" color="green" />
      </div>

      {/* Weekly trend */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Weekly Performance Trend" sub="Views, View-Through Rate, and Conversions week-on-week" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Views & Conversions</p>
            <ResponsiveContainer debounce={1} width="100%" height={220}>
              <ComposedChart data={WEEKLY_TREND}>
                <defs>
                  <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis yAxisId="left" tickFormatter={v => fmt.num(v)} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip formatter={(v, n) => [n === 'views' ? fmt.num(v) : v, n]} />
                <Area yAxisId="left" type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} fill="url(#gViews)" name="Views" />
                <Bar yAxisId="right" dataKey="conversions" fill="#10B981" opacity={0.7} name="Conversions" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">View-Through Rate & CPV Trend</p>
            <ResponsiveContainer debounce={1} width="100%" height={220}>
              <LineChart data={WEEKLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis yAxisId="left" tickFormatter={v => v + '%'} tick={{ fontSize: 11, fill: '#6B7280' }} domain={[38, 55]} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={v => '£' + v.toFixed(3)} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="vtr" stroke="#8B5CF6" strokeWidth={2} dot={false} name="VTR %" />
                <Line yAxisId="right" type="monotone" dataKey="cpv" stroke="#F59E0B" strokeWidth={2} dot={false} name="CPV £" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audience & Device */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age demographic */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <SectionHeader title="Audience Age Breakdown" sub="View share and conversion rate by age group" />
          <div className="mt-4 space-y-2">
            {AUDIENCE_AGE.map(a => (
              <div key={a.group} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600 w-12">{a.group}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: a.pct + '%' }} />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{a.pct}%</span>
                <span className={`text-xs font-medium w-12 text-right ${a.cvr >= 3.5 ? 'text-green-600' : a.cvr >= 2.5 ? 'text-blue-600' : 'text-gray-400'}`}>{a.cvr}% CVR</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 font-medium">35–44 highest-converting cohort (4.1% CVR) — over-index budget here</p>
          </div>
        </div>

        {/* Device split */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <SectionHeader title="Device Split" sub="View distribution across device types" />
          <div className="flex items-center gap-4 mt-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={DEVICE_SPLIT} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={1}>
                  {DEVICE_SPLIT.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v) => v + '%'} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {DEVICE_SPLIT.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-sm text-gray-700 flex-1">{d.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">TV screen share rising (+3pp MoM) — ensure 16:9 creative is TV-optimised with large text</p>
          </div>
        </div>
      </div>

      {/* Top Creatives */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Top Performing Creatives" sub="Ranked by view volume — sorted by engagement and conversion efficiency" />
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creative</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">VTR</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CVR</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {TOP_CREATIVES.map(c => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Play size={14} className="text-red-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{c.title}</div>
                        <div className="text-xs text-gray-400">{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-gray-700">{fmt.num(c.views)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-600">{fmt.pct(c.vtr)}</td>
                  <td className={`py-2.5 px-3 text-right font-medium ${c.cvr >= 4 ? 'text-green-600' : c.cvr >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>{c.cvr}%</td>
                  <td className="py-2.5 px-3">
                    {c.badge ? (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.badge === 'Top Performer' ? 'bg-green-100 text-green-700' : c.badge === 'High VTR' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {c.badge}
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.trend === 'down' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
                        {c.trend === 'down' ? 'Declining' : 'Stable'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Campaign Performance Table" sub="All YouTube campaigns — sorted by spend" />
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {[
                  ['name', 'Campaign'],
                  ['type', 'Format'],
                  ['spend', 'Spend'],
                  ['views', 'Views'],
                  ['vtr', 'VTR'],
                  ['cpv', 'CPV'],
                  ['conversions', 'Conv.'],
                  ['cpl', 'CPL'],
                ].map(([key, label]) => (
                  <th
                    key={key}
                    className={`py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 ${key === 'name' || key === 'type' ? 'text-left' : 'text-right'}`}
                    onClick={() => handleSort(key)}
                  >
                    {label}{sortKey === key ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
                  </th>
                ))}
                <th className="py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedCampaigns.map(c => (
                <tr key={c.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-medium text-gray-900 max-w-[200px] truncate">{c.name}</td>
                  <td className="py-2.5 px-3 text-gray-500">
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{c.type}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{fmt.gbp(c.spend)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{fmt.num(c.views)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-500">{fmt.pct(c.vtr)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{fmt.cpv(c.cpv)}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-gray-800">{c.conversions}</td>
                  <td className={`py-2.5 px-3 text-right font-medium ${c.cpl < 32 ? 'text-green-600' : c.cpl < 45 ? 'text-amber-600' : 'text-red-500'}`}>{fmt.gbp(c.cpl)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertCard severity="success" title="VTR improving week-on-week" text="Average VTR up from 42.1% to 50.8% since campaign launch. TrueView creative quality is resonating." />
        <AlertCard severity="warning" title="Shorts ad underperforming" text="YouTube Shorts campaign shows CPL of £43.93 — 43% above target. Consider pausing or refreshing creative." />
        <AlertCard severity="info" title="CTV audience growing" text="TV screen impressions up 3pp. Verify brand safety settings and ensure ads render well on large format displays." />
      </div>
    </div>
  );
}
