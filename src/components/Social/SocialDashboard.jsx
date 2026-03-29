import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePerformanceData, computeMetrics, fmt } from '../../services/dataLoader';
import { AlertTriangle } from 'lucide-react';
import KPICard from '../shared/KPICard';
import AlertCard from '../shared/AlertCard';
import SectionHeader from '../shared/SectionHeader';
import FunnelVisualization from '../shared/FunnelVisualization';
import CustomTooltip from '../shared/CustomTooltip';
import { cpaCellClass } from '../shared/HeatmapCell';
import SocialConversionHealth from './SocialConversionHealth';
import SocialCreativeAnalysis from './SocialCreativeAnalysis';
import SocialMessaging from './SocialMessaging';
import SocialDemographics from './SocialDemographics';
import SocialAttribution from './SocialAttribution';

export default function SocialDashboard() {
  const { socialData, metaAdsets, metaAds, metaAge, metaGender, metaPlacement, searchData, loading, error } = usePerformanceData();
  const [adsetSort, setAdsetSort] = useState('spend');

  const metrics = useMemo(() => computeMetrics(socialData), [socialData]);
  const searchMetrics = useMemo(() => computeMetrics(searchData), [searchData]);

  // Reach/frequency from adsets
  const metaTotals = useMemo(() => {
    const totalReach = metaAdsets.reduce((s, r) => s + r.reach, 0);
    const totalFreq = metaAdsets.length > 0 ? metaAdsets.reduce((s, r) => s + r.frequency * r.spend, 0) / Math.max(1, metaAdsets.reduce((s, r) => s + r.spend, 0)) : 0;
    return { reach: totalReach, frequency: totalFreq };
  }, [metaAdsets]);

  // Prospecting vs Retargeting split
  const { prospecting, retargeting } = useMemo(() => {
    const prosp = { cost: 0, orders: 0, impressions: 0, clicks: 0 };
    const retarg = { cost: 0, orders: 0, impressions: 0, clicks: 0 };
    for (const r of socialData) {
      const c = r.campaign.toLowerCase();
      const target = (c.includes('retarget') || c.includes('bof') || c.includes('remarketing') || c.includes('dpa')) ? retarg : prosp;
      target.cost += r.cost_gbp;
      target.orders += r.orders;
      target.impressions += r.impressions;
      target.clicks += r.clicks;
    }
    return {
      prospecting: { ...prosp, cpa: prosp.orders > 0 ? prosp.cost / prosp.orders : 0 },
      retargeting: { ...retarg, cpa: retarg.orders > 0 ? retarg.cost / retarg.orders : 0 },
    };
  }, [socialData]);

  // Creative format performance
  const formatPerf = useMemo(() => {
    const formats = {};
    for (const r of metaPlacement) {
      let format = 'Other';
      const p = (r.placement || '').toLowerCase();
      if (p.includes('feed') && !p.includes('video')) format = 'Feed';
      else if (p.includes('reel')) format = 'Reels';
      else if (p.includes('stories') || p.includes('story')) format = 'Stories';
      else if (p.includes('marketplace')) format = 'Marketplace';
      else if (p.includes('video')) format = 'Video';
      else if (p.includes('native') || p.includes('interstitial') || r.platform === 'Audience Network') format = 'Audience Network';
      else if (p.includes('search') || p.includes('explore')) format = 'Explore/Search';
      if (!formats[format]) formats[format] = { format, spend: 0, results: 0, impressions: 0 };
      formats[format].spend += r.spend;
      formats[format].results += r.results;
      formats[format].impressions += r.impressions;
    }
    return Object.values(formats)
      .map(f => ({ ...f, cpa: f.results > 0 ? f.spend / f.results : 0, cpm: f.impressions > 0 ? (f.spend / f.impressions) * 1000 : 0, pct: metrics.cost > 0 ? (f.spend / metrics.cost) * 100 : 0 }))
      .sort((a, b) => b.spend - a.spend);
  }, [metaPlacement, metrics]);

  // Creative fatigue / concentration
  const creativeConcentration = useMemo(() => {
    const sorted = [...metaAds].filter(a => a.spend > 0).sort((a, b) => b.spend - a.spend);
    const totalAdSpend = sorted.reduce((s, a) => s + a.spend, 0);
    return sorted.slice(0, 8).map(a => ({
      name: a.name.length > 60 ? a.name.substring(0, 60) + '...' : a.name,
      fullName: a.name,
      spend: a.spend,
      results: a.results,
      cpa: a.cpa,
      pct: totalAdSpend > 0 ? (a.spend / totalAdSpend) * 100 : 0,
      frequency: a.frequency,
      quality: a.quality_ranking,
    }));
  }, [metaAds]);

  // Age breakdown
  const ageData = useMemo(() => {
    const groups = {};
    for (const r of metaAge) {
      if (!groups[r.age]) groups[r.age] = { age: r.age, results: 0, spend: 0 };
      groups[r.age].results += r.results;
      groups[r.age].spend += r.spend;
    }
    return Object.values(groups).map(g => ({ ...g, cpa: g.results > 0 ? g.spend / g.results : 0 }));
  }, [metaAge]);

  // Gender breakdown
  const genderData = useMemo(() => {
    const groups = {};
    for (const r of metaGender) {
      const g = r.gender?.toLowerCase() || 'unknown';
      if (!groups[g]) groups[g] = { gender: g, results: 0, spend: 0 };
      groups[g].results += r.results;
      groups[g].spend += r.spend;
    }
    return Object.values(groups).map(g => ({ ...g, cpa: g.results > 0 ? g.spend / g.results : 0 }));
  }, [metaGender]);

  // Placement breakdown
  const placementData = useMemo(() => {
    const groups = {};
    for (const r of metaPlacement) {
      const key = `${r.platform} — ${r.placement}`;
      if (!groups[key]) groups[key] = { placement: key, platform: r.platform, results: 0, spend: 0, impressions: 0 };
      groups[key].results += r.results;
      groups[key].spend += r.spend;
      groups[key].impressions += r.impressions;
    }
    return Object.values(groups)
      .map(g => ({ ...g, cpa: g.results > 0 ? g.spend / g.results : 0 }))
      .filter(g => g.spend > 0)
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 12);
  }, [metaPlacement]);

  // Top ad sets
  const topAdsets = useMemo(() =>
    [...metaAdsets].filter(a => a.spend > 0).sort((a, b) => b[adsetSort] - a[adsetSort]).slice(0, 20),
  [metaAdsets, adsetSort]);

  if (loading) return <div className="text-center py-12 text-gray-400">Loading social data...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  // Funnel stages
  const funnelStages = [
    { label: 'Impressions', value: fmt.number(metrics.impressions), connected: true },
    { label: 'Clicks', value: fmt.number(metrics.clicks), connected: true },
    { label: 'Applications', value: fmt.number(metrics.orders), connected: true, note: 'Platform (tracking issues)' },
    { label: 'Approved', value: '—', connected: false, note: 'CRM required' },
    { label: 'Funded Deals', value: '—', connected: false, note: 'CRM required' },
    { label: 'Revenue', value: '—', connected: false, note: 'CRM required' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Social Performance</h2>
        <span className="text-xs text-gray-400">Meta Ads &middot; Jan 1 – Mar 6, 2026 &middot; {socialData.length} rows</span>
      </div>

      {/* KPI Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="Spend" value={fmt.currency(metrics.cost)} trend="up" trendValue="+18%" sparklineTrend="up" color="purple" />
        <KPICard label="Impressions" value={fmt.number(metrics.impressions)} trend="up" trendValue="+22%" sparklineTrend="up" color="blue" />
        <KPICard label="Reach" value={fmt.number(metaTotals.reach)} sub={`Avg freq: ${metaTotals.frequency.toFixed(1)}`} sparklineTrend="up" color="green" />
        <KPICard label="Applications" value={fmt.number(metrics.orders)} sub="Platform-reported" trend="up" trendValue="+10%" sparklineTrend="up" color="orange" />
        <KPICard label="CPA" value={fmt.cpa(metrics.cpa)} trend="down" trendValue="-5%" sparklineTrend="down" color="red" />
      </div>

      {/* Prospecting vs Retargeting */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Prospecting vs Retargeting Split" sub="TAU: always separate prospecting and retargeting reporting. Retargeting efficiency ≠ strategic effectiveness." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-xs text-blue-600 uppercase font-medium mb-2">Prospecting (TOF)</div>
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-lg font-bold text-blue-700">{fmt.currency(prospecting.cost)}</div><div className="text-xs text-gray-500">Spend</div></div>
              <div><div className="text-lg font-bold text-blue-700">{fmt.number(prospecting.orders)}</div><div className="text-xs text-gray-500">Applications</div></div>
              <div><div className="text-lg font-bold text-blue-700">{prospecting.cpa > 0 ? fmt.cpa(prospecting.cpa) : 'N/A'}</div><div className="text-xs text-gray-500">CPA</div></div>
              <div><div className="text-lg font-bold text-blue-700">{fmt.number(prospecting.impressions)}</div><div className="text-xs text-gray-500">Impressions</div></div>
            </div>
            <div className="text-xs text-blue-600 mt-2">New audience acquisition — creates demand</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-xs text-purple-600 uppercase font-medium mb-2">Retargeting (BOF)</div>
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-lg font-bold text-purple-700">{fmt.currency(retargeting.cost)}</div><div className="text-xs text-gray-500">Spend</div></div>
              <div><div className="text-lg font-bold text-purple-700">{fmt.number(retargeting.orders)}</div><div className="text-xs text-gray-500">Applications</div></div>
              <div><div className="text-lg font-bold text-purple-700">{retargeting.cpa > 0 ? fmt.cpa(retargeting.cpa) : 'N/A'}</div><div className="text-xs text-gray-500">CPA</div></div>
              <div><div className="text-lg font-bold text-purple-700">{fmt.number(retargeting.impressions)}</div><div className="text-xs text-gray-500">Impressions</div></div>
            </div>
            <div className="text-xs text-purple-600 mt-2">Existing audience — captures demand</div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={[
                { name: 'Prospecting', spend: prospecting.cost, orders: prospecting.orders },
                { name: 'Retargeting', spend: retargeting.cost, orders: retargeting.orders },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tickFormatter={v => fmt.currency(v)} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="spend" fill="#3B82F6" name="Spend" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <SocialConversionHealth />
      <SocialCreativeAnalysis formatPerf={formatPerf} creativeConcentration={creativeConcentration} />

      {/* Full Funnel / Offline Outcomes */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Full Funnel — Offline Outcomes" sub="27K+ applications in 65 days despite broken tracking. True ROAS depends on approval rates and loan values." />
        <FunnelVisualization stages={funnelStages} accentColor="purple" />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs font-semibold text-blue-700 mb-1">Cross-Channel Comparison (when CRM connected)</div>
            <table className="w-full text-xs">
              <thead><tr className="border-b"><th className="text-left py-1">Metric</th><th className="text-right py-1">Google</th><th className="text-right py-1">Meta</th></tr></thead>
              <tbody>
                <tr><td className="py-1">CPA (platform)</td><td className="py-1 text-right">{fmt.cpa(searchMetrics.cpa)}</td><td className="py-1 text-right">{fmt.cpa(metrics.cpa)}</td></tr>
                <tr><td className="py-1">Approval rate</td><td className="py-1 text-right text-gray-300">TBD</td><td className="py-1 text-right text-gray-300">TBD</td></tr>
                <tr><td className="py-1">Cost per funded</td><td className="py-1 text-right text-gray-300">TBD</td><td className="py-1 text-right text-gray-300">TBD</td></tr>
              </tbody>
            </table>
          </div>
          <AlertCard severity="warning" title="Key question" text="Is Meta traffic lower quality than Google? Platform CPAs suggest Meta is cheaper, but if approval rates are lower, true cost per funded deal may be similar. CRM data required to answer." icon={AlertTriangle} />
        </div>
      </div>

      <SocialDemographics ageData={ageData} genderData={genderData} placementData={placementData} />
      <SocialMessaging />
      <SocialAttribution />

      {/* Ad Set Performance */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title={`Top Ad Sets (${metaAdsets.filter(a => a.spend > 0).length} with spend)`} />
          <select value={adsetSort} onChange={e => setAdsetSort(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white hover:border-gray-300 transition-colors">
            <option value="spend">By Spend</option>
            <option value="results">By Results</option>
            <option value="cpa">By CPA</option>
          </select>
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0">
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Ad Set</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Results</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">CPA</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Spend</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Reach</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Freq.</th>
              </tr>
            </thead>
            <tbody>
              {topAdsets.map((a, i) => (
                <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 ${a.frequency > 5 ? 'border-l-4 border-l-amber-400' : ''}`}>
                  <td className="py-2 px-3 text-gray-900 max-w-[250px] truncate" title={a.name}>{a.name}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(a.results)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${cpaCellClass(a.cpa)}`}>{a.cpa > 0 ? fmt.cpa(a.cpa) : '—'}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.currency(a.spend)}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(a.reach)}</td>
                  <td className={`py-2 px-3 text-right ${a.frequency > 5 ? 'text-amber-600 font-medium' : 'text-gray-700'}`}>{a.frequency.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
