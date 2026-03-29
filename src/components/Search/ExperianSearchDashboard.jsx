import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, Cell, ZAxis, Legend
} from 'recharts';
import KPICard from '../shared/KPICard';
import AlertCard from '../shared/AlertCard';
import SectionHeader from '../shared/SectionHeader';
import { TrendingUp, Search, DollarSign, Target, AlertTriangle } from 'lucide-react';

// ── Experian Search data ─────────────────────────────────────────────────────

const CAMPAIGNS = [
  { name: 'Brand — Experian Core', tier: 'Brand', match: 'Exact/Phrase', spend: 12340, clicks: 48900, impressions: 312000, conversions: 1892, ctr: 15.7, cpc: 0.25, cpa: 6.52, roas: 18.4, qscore: 9.2, status: 'Active' },
  { name: 'Brand — CreditExpert', tier: 'Brand', match: 'Broad Mod', spend: 6890, clicks: 22400, impressions: 198000, conversions: 810, ctr: 11.3, cpc: 0.31, cpa: 8.51, roas: 15.6, qscore: 8.8, status: 'Active' },
  { name: 'Free Credit Score — Exact', tier: 'High Commercial', match: 'Exact', spend: 28400, clicks: 38100, impressions: 442000, conversions: 1204, ctr: 8.6, cpc: 0.75, cpa: 23.59, roas: 6.2, qscore: 8.1, status: 'Active' },
  { name: 'Credit Report — Exact', tier: 'High Commercial', match: 'Exact', spend: 19800, clicks: 26700, impressions: 318000, conversions: 788, ctr: 8.4, cpc: 0.74, cpa: 25.13, roas: 5.8, qscore: 7.9, status: 'Active' },
  { name: 'Improve Credit Score — Phrase', tier: 'Consideration', match: 'Phrase', spend: 16200, clicks: 18900, impressions: 510000, conversions: 412, ctr: 3.7, cpc: 0.86, cpa: 39.32, roas: 3.4, qscore: 7.2, status: 'Active' },
  { name: 'Check Credit Score — Broad', tier: 'Consideration', match: 'Broad', spend: 11800, clicks: 15300, impressions: 620000, conversions: 289, ctr: 2.5, cpc: 0.77, cpa: 40.83, roas: 3.1, qscore: 6.8, status: 'Active' },
  { name: 'Competitor — Equifax', tier: 'Competitor', match: 'Exact', spend: 8900, clicks: 9200, impressions: 89000, conversions: 198, ctr: 10.3, cpc: 0.97, cpa: 44.95, roas: 2.9, qscore: 6.1, status: 'Active' },
  { name: 'Competitor — ClearScore', tier: 'Competitor', match: 'Exact', spend: 7200, clicks: 7100, impressions: 72000, conversions: 144, ctr: 9.9, cpc: 1.01, cpa: 50.00, roas: 2.6, qscore: 5.8, status: 'Active' },
  { name: 'Loan Eligibility Checker — Generic', tier: 'Generic', match: 'Phrase', spend: 9400, clicks: 10200, impressions: 388000, conversions: 167, ctr: 2.6, cpc: 0.92, cpa: 56.29, roas: 2.1, qscore: 6.4, status: 'Active' },
  { name: 'PMAX — Credit Products', tier: 'PMAX', match: 'Auto', spend: 22100, clicks: 31400, impressions: 580000, conversions: 712, ctr: 5.4, cpc: 0.70, cpa: 31.04, roas: 4.8, qscore: null, status: 'Active' },
];

const ROAS_BY_TIER = [
  { tier: 'Brand', roas: 17.0, spend: 19230, cpa: 7.12 },
  { tier: 'High Commercial', roas: 6.0, spend: 48200, cpa: 24.36 },
  { tier: 'Consideration', roas: 3.2, spend: 28000, cpa: 40.08 },
  { tier: 'PMAX', roas: 4.8, spend: 22100, cpa: 31.04 },
  { tier: 'Competitor', roas: 2.7, spend: 16100, cpa: 47.47 },
  { tier: 'Generic', roas: 2.1, spend: 9400, cpa: 56.29 },
];

const KEYWORD_PERFORMANCE = [
  { keyword: 'experian free credit score', impressions: 128400, clicks: 18200, ctr: 14.2, cpc: 0.22, conversions: 724, cpa: 5.53, roas: 22.1, intent: 'Brand' },
  { keyword: 'free credit score check', impressions: 89300, clicks: 9100, ctr: 10.2, cpc: 0.68, conversions: 312, cpa: 19.87, roas: 7.3, intent: 'High Commercial' },
  { keyword: 'check my credit score free', impressions: 67800, clicks: 7200, ctr: 10.6, cpc: 0.71, conversions: 248, cpa: 20.59, roas: 6.9, intent: 'High Commercial' },
  { keyword: 'credit report uk', impressions: 54200, clicks: 5400, ctr: 10.0, cpc: 0.78, conversions: 178, cpa: 23.65, roas: 5.8, intent: 'High Commercial' },
  { keyword: 'how to improve credit score', impressions: 124000, clicks: 4800, ctr: 3.9, cpc: 0.88, conversions: 118, cpa: 35.76, roas: 3.9, intent: 'Consideration' },
  { keyword: 'equifax free credit check', impressions: 34100, clicks: 3800, ctr: 11.1, cpc: 0.94, conversions: 89, cpa: 40.18, roas: 3.4, intent: 'Competitor' },
  { keyword: 'credit score checker', impressions: 98400, clicks: 3900, ctr: 4.0, cpc: 0.81, conversions: 72, cpa: 43.92, roas: 3.1, intent: 'Consideration' },
  { keyword: 'personal loan eligibility', impressions: 76200, clicks: 2100, ctr: 2.8, cpc: 0.98, conversions: 34, cpa: 60.59, roas: 2.2, intent: 'Generic' },
];

const WEEKLY_TREND = [
  { week: 'Jan W1', clicks: 28400, roas: 5.2, cpa: 32.4 },
  { week: 'Jan W2', clicks: 31200, roas: 5.8, cpa: 30.1 },
  { week: 'Jan W3', clicks: 29800, roas: 5.6, cpa: 31.4 },
  { week: 'Jan W4', clicks: 33100, roas: 6.1, cpa: 28.9 },
  { week: 'Feb W1', clicks: 35600, roas: 6.4, cpa: 27.5 },
  { week: 'Feb W2', clicks: 34100, roas: 6.2, cpa: 28.2 },
  { week: 'Feb W3', clicks: 37800, roas: 6.8, cpa: 25.9 },
  { week: 'Feb W4', clicks: 39200, roas: 7.1, cpa: 24.4 },
  { week: 'Mar W1', clicks: 41100, roas: 7.3, cpa: 23.8 },
];

const TIER_COLORS = {
  Brand: '#3B82F6',
  'High Commercial': '#10B981',
  Consideration: '#8B5CF6',
  PMAX: '#F59E0B',
  Competitor: '#EF4444',
  Generic: '#6B7280',
};

const fmt = {
  num: (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toString(),
  pct: (n) => n.toFixed(1) + '%',
  gbp: (n) => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  cpc: (n) => '£' + n.toFixed(2),
  cpa: (n) => '£' + n.toFixed(2),
  roas: (n) => n.toFixed(1) + 'x',
};

export default function ExperianSearchDashboard() {
  const [sortKey, setSortKey] = useState('spend');
  const [sortDir, setSortDir] = useState('desc');
  const [kwSort, setKwSort] = useState('conversions');
  const [kwDir, setKwDir] = useState('desc');

  const totals = useMemo(() => {
    const t = CAMPAIGNS.reduce((a, c) => ({
      spend: a.spend + c.spend, clicks: a.clicks + c.clicks,
      impressions: a.impressions + c.impressions, conversions: a.conversions + c.conversions,
    }), { spend: 0, clicks: 0, impressions: 0, conversions: 0 });
    return { ...t, ctr: (t.clicks / t.impressions * 100), cpc: t.spend / t.clicks, cpa: t.spend / t.conversions };
  }, []);

  const sortedCampaigns = useMemo(() =>
    [...CAMPAIGNS].sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]),
  [sortKey, sortDir]);

  const sortedKeywords = useMemo(() =>
    [...KEYWORD_PERFORMANCE].sort((a, b) => kwDir === 'desc' ? b[kwSort] - a[kwSort] : a[kwSort] - b[kwSort]),
  [kwSort, kwDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleKwSort = (key) => {
    if (kwSort === key) setKwDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setKwSort(key); setKwDir('desc'); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Search Performance</h2>
          <p className="text-xs text-gray-400 mt-0.5">Experian · Jan 1 – Mar 14, 2026 · Google Ads</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <Search size={10} /> Google Search
          </span>
          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Live</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="Total Spend" value={fmt.gbp(totals.spend)} sub="10 campaigns" trend="up" trendValue="+11%" sparklineTrend="up" color="blue" />
        <KPICard label="Total Clicks" value={fmt.num(totals.clicks)} sub={fmt.pct(totals.ctr) + ' CTR'} trend="up" trendValue="+14%" sparklineTrend="up" color="green" />
        <KPICard label="Conversions" value={fmt.num(totals.conversions)} sub="sign-ups & leads" trend="up" trendValue="+22%" sparklineTrend="up" color="purple" />
        <KPICard label="Blended CPA" value={fmt.cpa(totals.cpa)} sub="target: £28" trend="down" trendValue="-8%" sparklineTrend="down" color="orange" />
        <KPICard label="Avg ROAS" value="5.8x" sub="blended" trend="up" trendValue="+0.6x" sparklineTrend="up" color="green" />
      </div>

      {/* ROAS by Tier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <SectionHeader title="ROAS by Keyword Tier" sub="Return on ad spend segmented by search intent classification" />
          <ResponsiveContainer debounce={1} width="100%" height={220} className="mt-4">
            <BarChart data={ROAS_BY_TIER} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={v => v + 'x'} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis type="category" dataKey="tier" tick={{ fontSize: 11, fill: '#6B7280' }} width={110} />
              <Tooltip formatter={(v, n) => [n === 'roas' ? v + 'x' : '£' + v.toFixed(0), n === 'roas' ? 'ROAS' : 'Spend']} />
              <Bar dataKey="roas" radius={[0, 4, 4, 0]}>
                {ROAS_BY_TIER.map((r, i) => <Cell key={i} fill={TIER_COLORS[r.tier]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <SectionHeader title="ROAS & CPA Trend" sub="Weekly blended ROAS improving as bid strategy matures" />
          <ResponsiveContainer debounce={1} width="100%" height={220} className="mt-4">
            <LineChart data={WEEKLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#6B7280' }} />
              <YAxis yAxisId="left" tickFormatter={v => v + 'x'} tick={{ fontSize: 11, fill: '#6B7280' }} domain={[4, 8]} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={v => '£' + v} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="roas" stroke="#10B981" strokeWidth={2} dot={false} name="ROAS" />
              <Line yAxisId="right" type="monotone" dataKey="cpa" stroke="#EF4444" strokeWidth={2} dot={false} name="CPA £" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tier budget allocation */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Spend by Tier" sub="Budget allocation across intent tiers — brand spend highly efficient, under-represented vs generic" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          {ROAS_BY_TIER.map(t => (
            <div key={t.tier} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: TIER_COLORS[t.tier] }} />
              <div className="text-xs text-gray-500 font-medium mb-1">{t.tier}</div>
              <div className="text-base font-bold text-gray-900">{fmt.gbp(t.spend)}</div>
              <div className="text-xs text-gray-400 mt-0.5">{fmt.roas(t.roas)} ROAS</div>
              <div className="text-xs text-gray-400">{fmt.cpa(t.cpa)} CPA</div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Top Keywords by Performance" sub="Showing 8 of 1,247 active keywords — sorted by conversion volume" />
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {[
                  ['keyword', 'Keyword', true],
                  ['intent', 'Intent', true],
                  ['impressions', 'Impr.', false],
                  ['clicks', 'Clicks', false],
                  ['ctr', 'CTR', false],
                  ['cpc', 'CPC', false],
                  ['conversions', 'Conv.', false],
                  ['cpa', 'CPA', false],
                  ['roas', 'ROAS', false],
                ].map(([key, label, left]) => (
                  <th
                    key={key}
                    className={`py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 ${left ? 'text-left' : 'text-right'}`}
                    onClick={() => handleKwSort(key)}
                  >
                    {label}{kwSort === key ? (kwDir === 'desc' ? ' ↓' : ' ↑') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedKeywords.map(kw => (
                <tr key={kw.keyword} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono text-xs text-gray-800">{kw.keyword}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: TIER_COLORS[kw.intent] }}>
                      {kw.intent}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-600">{fmt.num(kw.impressions)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-600">{fmt.num(kw.clicks)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-600">{fmt.pct(kw.ctr)}</td>
                  <td className="py-2.5 px-3 text-right text-gray-600">{fmt.cpc(kw.cpc)}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{kw.conversions}</td>
                  <td className={`py-2.5 px-3 text-right font-medium ${kw.cpa < 25 ? 'text-green-600' : kw.cpa < 40 ? 'text-amber-600' : 'text-red-500'}`}>{fmt.cpa(kw.cpa)}</td>
                  <td className={`py-2.5 px-3 text-right font-medium ${kw.roas > 6 ? 'text-green-600' : kw.roas > 3.5 ? 'text-blue-600' : 'text-gray-500'}`}>{fmt.roas(kw.roas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Campaign Overview" sub="All active search campaigns — click column headers to sort" />
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {[['name','Campaign',true],['tier','Tier',true],['spend','Spend',false],['clicks','Clicks',false],['ctr','CTR',false],['cpc','CPC',false],['conversions','Conv.',false],['cpa','CPA',false],['roas','ROAS',false]].map(([key, label, left]) => (
                  <th key={key} className={`py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 ${left ? 'text-left' : 'text-right'}`} onClick={() => handleSort(key)}>
                    {label}{sortKey === key ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedCampaigns.map(c => (
                <tr key={c.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-900 max-w-[200px] truncate">{c.name}</td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: TIER_COLORS[c.tier] }}>{c.tier}</span>
                  </td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.gbp(c.spend)}</td>
                  <td className="py-2 px-3 text-right text-gray-600">{fmt.num(c.clicks)}</td>
                  <td className="py-2 px-3 text-right text-gray-600">{fmt.pct(c.ctr)}</td>
                  <td className="py-2 px-3 text-right text-gray-600">{fmt.cpc(c.cpc)}</td>
                  <td className="py-2 px-3 text-right font-semibold text-gray-900">{fmt.num(c.conversions)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${c.cpa < 20 ? 'text-green-600' : c.cpa < 35 ? 'text-amber-600' : 'text-red-500'}`}>{fmt.cpa(c.cpa)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${c.roas > 6 ? 'text-green-600' : c.roas > 3.5 ? 'text-blue-600' : 'text-gray-500'}`}>{fmt.roas(c.roas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertCard severity="success" title="Brand CPA at £7.12 — excellent" text="Brand keyword investment is highly efficient. Consider increasing brand budget by 20% to capture additional share-of-voice." />
        <AlertCard severity="warning" title="Competitor keywords above target CPA" text="Equifax and ClearScore terms running at £45–50 CPA vs £28 target. Review bid strategy and landing page relevance." />
        <AlertCard severity="info" title="PMAX cannibalising brand" text="Performance Max campaign shows overlap with brand terms. Exclude brand keywords from PMAX asset groups to preserve attribution." />
      </div>
    </div>
  );
}
