import { useMemo, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePerformanceData, computeMetrics, fmt } from '../../services/dataLoader';
import { computeDealMetrics, FUNNEL_ASSUMPTIONS } from '../../data/funnelAssumptions';
import { AlertTriangle, Phone, DollarSign, Info } from 'lucide-react';
import KPICard from '../shared/KPICard';
import AlertCard from '../shared/AlertCard';
import SectionHeader from '../shared/SectionHeader';
import FunnelVisualization from '../shared/FunnelVisualization';
import { cpaCellClass } from '../shared/HeatmapCell';
import { ScatterTooltip } from '../shared/CustomTooltip';
import { BUDGET_LIMITED_CAMPAIGNS } from '../../data/auditData';
import SearchIntentAnalysis, { INTENT_COLORS } from './SearchIntentAnalysis';
import SearchConversionHealth from './SearchConversionHealth';
import SearchCampaignTable from './SearchCampaignTable';

// Intent classification based on campaign naming
function classifyIntent(campaign) {
  const c = campaign.toLowerCase();
  if (c.includes('brand') || c.includes('carfinance247') || c.includes('car_finance_247')) return 'Brand';
  if (c.includes('competitor') || c.includes('comp_')) return 'Competitor';
  if (c.includes('performance_max') || c.includes('pmax')) return 'PMAX';
  if (c.includes('demand_gen')) return 'Demand Gen';
  if (c.includes('exact')) return 'High Commercial';
  if (c.includes('phrase') || c.includes('broad')) return 'Consideration';
  return 'Generic';
}

export default function SearchDashboard() {
  const { searchData, loading, error } = usePerformanceData();
  const [sortKey, setSortKey] = useState('cost');
  const [sortDir, setSortDir] = useState('desc');

  const metrics = useMemo(() => computeMetrics(searchData), [searchData]);

  const campaigns = useMemo(() => {
    const groups = {};
    for (const r of searchData) {
      const key = r.campaign;
      if (!groups[key]) groups[key] = { campaign: key, campaign_type: r.campaign_type, status: r.status, intent: classifyIntent(key), cost: 0, orders: 0, impressions: 0, clicks: 0, revenue: 0 };
      groups[key].cost += r.cost_gbp;
      groups[key].orders += r.orders;
      groups[key].impressions += r.impressions;
      groups[key].clicks += r.clicks;
      groups[key].revenue += Number(r.revenue_gbp || 0);
    }
    return Object.values(groups)
      .map(c => {
        const cpa = c.orders > 0 ? c.cost / c.orders : 0;
        const deal = computeDealMetrics(c.cost, c.orders, c.revenue || 0);
        return { ...c, cpa, ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0, ...deal };
      })
      .sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
  }, [searchData, sortKey, sortDir]);

  const brandCampaigns = useMemo(() => campaigns.filter(c => c.intent === 'Brand'), [campaigns]);
  const genericCampaigns = useMemo(() => campaigns.filter(c => c.intent !== 'Brand'), [campaigns]);
  const aggregate = (list) => {
    const t = list.reduce((a, c) => ({ cost: a.cost + c.cost, orders: a.orders + c.orders, clicks: a.clicks + c.clicks, impressions: a.impressions + c.impressions }), { cost: 0, orders: 0, clicks: 0, impressions: 0 });
    return { ...t, cpa: t.orders > 0 ? t.cost / t.orders : 0 };
  };
  const brandMetrics = useMemo(() => aggregate(brandCampaigns), [brandCampaigns]);
  const genericMetrics = useMemo(() => aggregate(genericCampaigns), [genericCampaigns]);

  const intentTiers = useMemo(() => {
    const groups = {};
    for (const c of campaigns) {
      if (!groups[c.intent]) groups[c.intent] = { intent: c.intent, cost: 0, orders: 0, impressions: 0, clicks: 0, count: 0 };
      groups[c.intent].cost += c.cost;
      groups[c.intent].orders += c.orders;
      groups[c.intent].impressions += c.impressions;
      groups[c.intent].clicks += c.clicks;
      groups[c.intent].count++;
    }
    return Object.values(groups).map(g => ({ ...g, cpa: g.orders > 0 ? g.cost / g.orders : 0 })).sort((a, b) => b.cost - a.cost);
  }, [campaigns]);

  const typeSummary = useMemo(() => {
    const groups = {};
    for (const r of searchData) {
      const t = r.campaign_type || 'Other';
      if (!groups[t]) groups[t] = { type: t, cost: 0, orders: 0, clicks: 0, impressions: 0 };
      groups[t].cost += r.cost_gbp;
      groups[t].orders += r.orders;
      groups[t].clicks += r.clicks;
      groups[t].impressions += r.impressions;
    }
    return Object.values(groups).map(g => ({ ...g, cpa: g.orders > 0 ? g.cost / g.orders : 0 })).sort((a, b) => b.cost - a.cost);
  }, [searchData]);

  const scatterData = useMemo(() =>
    campaigns.filter(c => c.orders > 0 && c.cost > 100).map(c => ({
      name: c.campaign, x: c.orders, y: c.cpa, z: c.cost, intent: c.intent,
    })),
  [campaigns]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading search data...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  const funnelStages = [
    { label: 'Impressions', value: fmt.number(metrics.impressions), connected: true },
    { label: 'Clicks', value: fmt.number(metrics.clicks), cost: fmt.cpa(metrics.cost / metrics.clicks), connected: true },
    { label: 'Applications', value: fmt.number(metrics.orders), cost: fmt.cpa(metrics.cpa), connected: true, note: 'Platform-reported' },
    { label: 'Approved', value: `~${fmt.number(metrics.approvedEst)}`, cost: metrics.approvedEst > 0 ? fmt.cpa(metrics.cost / metrics.approvedEst) : '—', connected: false, note: `Est. ${FUNNEL_ASSUMPTIONS.approvalRate * 100}% rate` },
    { label: 'Funded Deals', value: `~${fmt.number(metrics.fundedEst)}`, cost: fmt.cpa(metrics.costPerDeal), connected: false, note: `Est. ${FUNNEL_ASSUMPTIONS.fundingRate * 100}% rate` },
    { label: 'Revenue', value: metrics.hasActualRevenue ? fmt.currency(metrics.actualRevenue) : `~${fmt.currency(metrics.revenueEst)}`, connected: false, note: metrics.hasActualRevenue ? 'Actual' : 'Modeled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Search Performance</h2>
        <span className="text-xs text-gray-400">Google Ads &middot; Jan 1 – Mar 6, 2026 &middot; {searchData.length} rows</span>
      </div>

      {/* KPI Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard label="Spend" value={fmt.currency(metrics.cost)} sub={`${typeSummary.length} campaign types`} trend="up" trendValue="+12%" sparklineTrend="up" color="blue" />
        <KPICard label="Applications" value={fmt.number(metrics.orders)} sub="Platform-reported" trend="up" trendValue="+15%" sparklineTrend="up" color="green" />
        <KPICard label="CPA" value={fmt.cpa(metrics.cpa)} trend="down" trendValue="-3%" sparklineTrend="down" color="orange" />
        <KPICard label="Cost per Deal" value={fmt.cpa(metrics.costPerDeal)} sub={metrics.hasActualRevenue ? 'Actual' : 'Modeled'} sparklineTrend="down" color="red" />
        <KPICard label="Est. Funded Deals" value={fmt.number(metrics.fundedEst)} sub={`${FUNNEL_ASSUMPTIONS.approvalRate * 100}% approval × ${FUNNEL_ASSUMPTIONS.fundingRate * 100}% funding`} sparklineTrend="up" color="purple" />
        <KPICard label="ROI" value={fmt.roi(metrics.roi)} sub={metrics.hasActualRevenue ? `ROAS ${fmt.roas(metrics.roas)}` : 'Modeled'} trend={metrics.roi > 0 ? 'up' : 'down'} trendValue={metrics.hasActualRevenue ? 'Actual revenue' : 'Est. revenue'} sparklineTrend={metrics.roi > 0 ? 'up' : 'down'} color={metrics.roi > 0 ? 'green' : 'red'} />
      </div>

      <SearchIntentAnalysis brandMetrics={brandMetrics} genericMetrics={genericMetrics} brandCount={brandCampaigns.length} genericCount={genericCampaigns.length} intentTiers={intentTiers} />

      {/* Campaign Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {typeSummary.map(t => (
          <div key={t.type} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold text-gray-700">{t.type}</div>
            <div className="text-lg font-bold text-gray-900 mt-1">{fmt.currency(t.cost)}</div>
            <div className="text-xs text-gray-500">{fmt.number(t.orders)} apps &middot; {t.cpa > 0 ? fmt.cpa(t.cpa) + ' CPA' : 'N/A'}</div>
          </div>
        ))}
      </div>

      <SearchConversionHealth />

      {/* Budget Constraint Opportunities */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Budget Constraint Opportunities" sub="Campaigns where budget limits are suppressing volume at efficient CPAs." />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Daily Budget</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period Spend</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applications</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPA</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recommendation</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET_LIMITED_CAMPAIGNS.map(b => (
                <tr key={b.campaign} className="border-b border-gray-100 hover:bg-gray-50 border-l-4 border-l-amber-400">
                  <td className="py-2 px-3 font-medium text-gray-900 max-w-[200px] truncate">{b.campaign}</td>
                  <td className="py-2 px-3 text-right text-gray-700">£{b.budget.toLocaleString()}/day</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.currency(b.spend)}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(b.orders)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${cpaCellClass(b.cpa)}`}>{fmt.cpa(b.cpa)}</td>
                  <td className="py-2 px-3 text-xs text-gray-600 max-w-[200px]">{b.recommendation}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${b.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{b.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CPA vs Volume Scatter */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="CPA vs Volume by Campaign" sub="Bubble size = spend. Bottom-right quadrant = efficient scale. Top-left = expensive low volume." />
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" dataKey="x" name="Applications" tickFormatter={v => fmt.number(v)} label={{ value: 'Applications', position: 'bottom', offset: 0, style: { fontSize: 11, fill: '#6B7280' } }} tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis type="number" dataKey="y" name="CPA" tickFormatter={v => `£${v.toFixed(0)}`} label={{ value: 'CPA (£)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6B7280' } }} tick={{ fontSize: 11, fill: '#6B7280' }} />
            <ZAxis type="number" dataKey="z" range={[40, 400]} name="Spend" />
            <Tooltip content={<ScatterTooltip />} />
            <Scatter data={scatterData} fill="#3B82F6">
              {scatterData.map((entry, i) => <Cell key={i} fill={INTENT_COLORS[entry.intent] || '#3B82F6'} fillOpacity={0.75} />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {Object.entries(INTENT_COLORS).map(([intent, color]) => (
            <span key={intent} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {intent}
            </span>
          ))}
        </div>
      </div>

      {/* Full Funnel */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Full Funnel — Offline Outcomes" sub="True ROI is cost per funded deal, not cost per application. CRM data required for downstream stages." />
        <FunnelVisualization stages={funnelStages} accentColor="blue" />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <AlertCard severity="warning" title="Next step" text="Import 247CF CRM deal data (approved applications, funded deals, loan values) and map to Google Click IDs (GCLID) for offline conversion import." icon={DollarSign} />
          <AlertCard severity="warning" title="Phone attribution" text="Material portion of funded deals likely originate from phone calls assisted by search. Connect call tracking (CallRail etc.) to source attribution." icon={Phone} />
        </div>
        <div className="mt-3 flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg text-xs text-gray-500">
          <Info size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <span>Downstream estimates use modeled assumptions: {FUNNEL_ASSUMPTIONS.labels.approvalRate}, {FUNNEL_ASSUMPTIONS.labels.fundingRate}, {FUNNEL_ASSUMPTIONS.labels.avgDealValue}. Connect CRM data for actuals.</span>
        </div>
      </div>

      <SearchCampaignTable campaigns={campaigns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
    </div>
  );
}
