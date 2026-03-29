import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fmt } from '../../services/dataLoader';
import SectionHeader from '../shared/SectionHeader';
import CustomTooltip from '../shared/CustomTooltip';
import { cpaCellClass } from '../shared/HeatmapCell';

const INTENT_COLORS = { 'Brand': '#10B981', 'High Commercial': '#3B82F6', 'Consideration': '#8B5CF6', 'PMAX': '#F59E0B', 'Demand Gen': '#06B6D4', 'Competitor': '#EF4444', 'Generic': '#6B7280' };

export { INTENT_COLORS };

export default function SearchIntentAnalysis({ brandMetrics, genericMetrics, brandCount, genericCount, intentTiers }) {
  return (
    <>
      {/* Brand vs Generic Split */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Brand vs Generic Split" sub="TAU: never combine brand + generic metrics. Brand captures existing demand; generic creates it." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="text-xs text-green-600 uppercase font-medium mb-2">Brand Campaigns</div>
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-lg font-bold text-green-700">{fmt.currency(brandMetrics.cost)}</div><div className="text-xs text-gray-500">Spend</div></div>
              <div><div className="text-lg font-bold text-green-700">{fmt.number(brandMetrics.orders)}</div><div className="text-xs text-gray-500">Applications</div></div>
              <div><div className="text-lg font-bold text-green-700">{brandMetrics.cpa > 0 ? fmt.cpa(brandMetrics.cpa) : 'N/A'}</div><div className="text-xs text-gray-500">CPA</div></div>
              <div><div className="text-lg font-bold text-green-700">{brandCount}</div><div className="text-xs text-gray-500">Campaigns</div></div>
            </div>
            <div className="text-xs text-green-600 mt-2">Question: Are brand conversions incremental or cannibalised from organic?</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-xs text-blue-600 uppercase font-medium mb-2">Generic + PMAX + Demand Gen</div>
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-lg font-bold text-blue-700">{fmt.currency(genericMetrics.cost)}</div><div className="text-xs text-gray-500">Spend</div></div>
              <div><div className="text-lg font-bold text-blue-700">{fmt.number(genericMetrics.orders)}</div><div className="text-xs text-gray-500">Applications</div></div>
              <div><div className="text-lg font-bold text-blue-700">{genericMetrics.cpa > 0 ? fmt.cpa(genericMetrics.cpa) : 'N/A'}</div><div className="text-xs text-gray-500">CPA</div></div>
              <div><div className="text-lg font-bold text-blue-700">{genericCount}</div><div className="text-xs text-gray-500">Campaigns</div></div>
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={[
                { name: 'Brand', spend: brandMetrics.cost, orders: brandMetrics.orders },
                { name: 'Generic', spend: genericMetrics.cost, orders: genericMetrics.orders },
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

      {/* Intent Segmentation */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Search Architecture — Intent Segmentation" sub="Campaigns classified by intent tier. Budget allocation should mirror intent value." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={intentTiers} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={v => fmt.currency(v)} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis type="category" dataKey="intent" width={110} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" name="Spend" radius={[0, 4, 4, 0]}>
                {intentTiers.map((entry, i) => <Cell key={i} fill={INTENT_COLORS[entry.intent] || '#6B7280'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intent Tier</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaigns</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Apps</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPA</th>
                </tr>
              </thead>
              <tbody>
                {intentTiers.map(t => (
                  <tr key={t.intent} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: INTENT_COLORS[t.intent] }} />
                      <span className="font-medium text-gray-900">{t.intent}</span>
                    </td>
                    <td className="py-2 px-3 text-right text-gray-600">{t.count}</td>
                    <td className="py-2 px-3 text-right text-gray-700">{fmt.currency(t.cost)}</td>
                    <td className="py-2 px-3 text-right text-gray-700">{fmt.number(t.orders)}</td>
                    <td className={`py-2 px-3 text-right font-medium ${cpaCellClass(t.cpa)}`}>{t.cpa > 0 ? fmt.cpa(t.cpa) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
