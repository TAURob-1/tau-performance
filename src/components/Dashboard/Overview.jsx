import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePerformanceData, computeMetrics, fmt } from '../../services/dataLoader';
import { useDashboard } from '../../context/DashboardContext';
import KPICard from '../shared/KPICard';
import SectionHeader from '../shared/SectionHeader';
import { cpaCellClass } from '../shared/HeatmapCell';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-100">
      <p className="text-xs font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-gray-600">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium">{typeof p.value === 'number' && p.value > 100 ? fmt.currency(p.value) : fmt.number(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

export default function Overview() {
  const { dateRange } = useDashboard();
  const { data, loading, error, searchData, socialData, metrics, searchMetrics, socialMetrics } = usePerformanceData();

  const channelBars = useMemo(() => {
    if (!data.length) return [];
    return [
      { name: 'Google Ads', spend: searchMetrics.cost, orders: searchMetrics.orders, cpa: searchMetrics.cpa, impressions: searchMetrics.impressions },
      { name: 'Meta', spend: socialMetrics.cost, orders: socialMetrics.orders, cpa: socialMetrics.cpa, impressions: socialMetrics.impressions },
    ];
  }, [data, searchMetrics, socialMetrics]);

  // Campaign type breakdown
  const campaignTypes = useMemo(() => {
    if (!data.length) return [];
    const groups = {};
    for (const r of data) {
      const t = r.campaign_type || 'Other';
      if (!groups[t]) groups[t] = { type: t, cost: 0, orders: 0, impressions: 0, clicks: 0 };
      groups[t].cost += r.cost_gbp;
      groups[t].orders += r.orders;
      groups[t].impressions += r.impressions;
      groups[t].clicks += r.clicks;
    }
    return Object.values(groups)
      .map(g => ({ ...g, cpa: g.orders > 0 ? g.cost / g.orders : 0 }))
      .sort((a, b) => b.cost - a.cost);
  }, [data]);

  // Top campaigns by spend
  const topCampaigns = useMemo(() => {
    if (!data.length) return [];
    const groups = {};
    for (const r of data) {
      const key = r.campaign;
      if (!groups[key]) groups[key] = { campaign: key, channel: r.channel, status: r.status, campaign_type: r.campaign_type, cost: 0, orders: 0, impressions: 0, clicks: 0 };
      groups[key].cost += r.cost_gbp;
      groups[key].orders += r.orders;
      groups[key].impressions += r.impressions;
      groups[key].clicks += r.clicks;
    }
    return Object.values(groups)
      .filter(c => c.cost > 0)
      .map(c => ({ ...c, cpa: c.orders > 0 ? c.cost / c.orders : 0 }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);
  }, [data]);

  if (loading) return <div className="text-center py-12 text-gray-400">Loading performance data...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
        <span className="text-xs text-gray-500">Jan 1 – Mar 6, 2026 &middot; {data.length.toLocaleString()} rows</span>
      </div>

      {/* KPI Cards with Sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Spend" value={fmt.currency(metrics.cost)} sub={`Google ${fmt.currency(searchMetrics.cost)} / Meta ${fmt.currency(socialMetrics.cost)}`} trend="up" trendValue="+14%" sparklineTrend="up" color="blue" />
        <KPICard label="Applications" value={fmt.number(metrics.orders)} sub={`Google ${fmt.number(searchMetrics.orders)} / Meta ${fmt.number(socialMetrics.orders)}`} trend="up" trendValue="+12%" sparklineTrend="up" color="green" />
        <KPICard label="Blended CPA" value={fmt.cpa(metrics.cpa)} sub={`Google ${fmt.cpa(searchMetrics.cpa)} / Meta ${fmt.cpa(socialMetrics.cpa)}`} trend="down" trendValue="-4%" sparklineTrend="down" color="orange" />
        <KPICard label="Impressions" value={fmt.number(metrics.impressions)} sub="Revenue data not available" trend="up" trendValue="+18%" sparklineTrend="up" color="purple" />
      </div>

      {/* Channel Comparison Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Channel Comparison" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={channelBars} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={v => fmt.currency(v)} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="spend" fill="#3B82F6" name="Spend" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={channelBars} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={v => fmt.number(v)} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#10B981" name="Applications" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campaign Type Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Campaign Type Breakdown" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applications</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPA</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Impressions</th>
              </tr>
            </thead>
            <tbody>
              {campaignTypes.map(t => (
                <tr key={t.type} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-900">{t.type}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.currency(t.cost)}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(t.orders)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${cpaCellClass(t.cpa)}`}>{t.cpa > 0 ? fmt.cpa(t.cpa) : 'N/A'}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(t.impressions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Campaigns */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Top 10 Campaigns by Spend" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Channel</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Apps</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPA</th>
              </tr>
            </thead>
            <tbody>
              {topCampaigns.map(c => (
                <tr key={c.campaign} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-900 max-w-[250px] truncate" title={c.campaign}>{c.campaign}</td>
                  <td className="py-2 px-3 text-gray-600">{c.channel}</td>
                  <td className="py-2 px-3 text-gray-600">{c.campaign_type}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      c.status === 'Enabled' || c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>{c.status}</span>
                  </td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.currency(c.cost)}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(c.orders)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${cpaCellClass(c.cpa)}`}>{c.cpa > 0 ? fmt.cpa(c.cpa) : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
