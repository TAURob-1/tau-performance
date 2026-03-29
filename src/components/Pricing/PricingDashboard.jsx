import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, ReferenceLine, LineChart, Line } from 'recharts';
import { usePerformanceData, fmt } from '../../services/dataLoader';

const COMPETITORS = [
  { name: '247 CarFinance', type: 'Broker', segment: 'Full spectrum', rep: 19.8, min: 8.9, max: 49.9, tp: 4.9, reviews: '39.5K', status: 'Active', owner: 'Private (Rix brothers)', intel: 'UK\'s largest online broker by traffic. 275+ products. Highest Trustpilot in market.', color: '#10B981' },
  { name: 'Zuto', type: 'Broker', segment: 'Full spectrum', rep: 18.8, min: 7.9, max: 19.0, tp: 4.8, reviews: '36K', status: 'Active — PE growth', owner: 'Bridgepoint (Nov 2025)', intel: 'Exclusive AutoTrader + ClearScore deals. B Corp. 35% YoY revenue growth (£75M FY25).', color: '#3B82F6' },
  { name: 'Oodle', type: 'Direct lender', segment: 'Near-prime', rep: 12.1, min: 12.0, max: 29.9, tp: 4.8, reviews: '18K', status: 'Active', owner: 'KKR / Citi', intel: 'Direct lender, underwrites own risk. £393M ABS securitisation. £12.8M FCA redress provision.', color: '#8B5CF6' },
  { name: 'Startline', type: 'Direct lender', segment: 'Near-prime', rep: 14.9, min: 10.0, max: 29.9, tp: 4.7, reviews: '12K', status: 'Active — growth', owner: 'Private (JP Morgan)', intel: 'Pioneered near-prime category. £625M AUM. £475M JP Morgan facility (Jan 2025).', color: '#06B6D4' },
  { name: 'Evolution Funding', type: 'Broker/platform', segment: 'Full spectrum', rep: 10.9, min: 9.9, max: null, tp: 4.7, reviews: 'N/A', status: 'Active', owner: 'Private', intel: 'UK\'s largest used auto broker. 4,500+ dealers. 30+ lenders. Best Broker 10 years running.', color: '#14B8A6' },
  { name: 'First Response', type: 'Direct lender', segment: 'Subprime', rep: 29.9, min: 20.9, max: 29.9, tp: 4.0, reviews: '1.2K', status: 'Active — stable', owner: 'ITOCHU (Japan)', intel: 'Most stable subprime lender. No FCA actions. Max £15K — smaller ticket.', color: '#F97316' },
  { name: 'Moneybarn', type: 'Direct lender', segment: 'Deep subprime', rep: 30.7, min: 18.5, max: 47.5, tp: 4.4, reviews: '16K', status: 'Deprioritised', owner: 'Vanquis (LSE: VANQ)', intel: 'Being wound down by parent. £71M goodwill write-off. Contracts down 24%. FCA fined £2.77M.', color: '#EF4444' },
  { name: 'Close Brothers MF', type: 'Dealer lender', segment: 'Near-prime/sub', rep: 21.9, min: 9.9, max: 60.0, tp: 3.7, reviews: 'N/A', status: 'UK lending PAUSED', owner: 'Close Brothers (FTSE 250)', intel: '£1.9bn book. £300M DCA provision (Viceroy: up to £1.23B). 600 job cuts. Paused motor lending.', color: '#DC2626' },
  { name: 'Advantage Finance', type: 'Direct lender', segment: 'Near-prime/sub', rep: 33.87, min: 9.9, max: 39.9, tp: 4.9, reviews: '5.4K', status: 'CEASED LENDING', owner: 'LCM Partners (Brookfield)', intel: 'No longer lending. STB exited Jul 2025, sold to LCM for £459M Dec 2025. Run-off only.', color: '#6B7280' },
  { name: 'Lookers', type: 'Dealer group', segment: 'Prime/near-prime', rep: 11.9, min: 0.0, max: 15.0, tp: 4.0, reviews: '20.3K', status: 'Active', owner: 'Alpha Auto (Toronto, £504M)', intel: '~135 dealerships, £4.29bn revenue. 50.6% used finance penetration. Captive + panel model.', color: '#64748B' },
];

// Modelled acceptance curve from academic research
const ELASTICITY_CURVE = [
  { apr: 6, acceptance: 95 },
  { apr: 9, acceptance: 92 },
  { apr: 12, acceptance: 88 },
  { apr: 15, acceptance: 83 },
  { apr: 18, acceptance: 76 },
  { apr: 20, acceptance: 70 },
  { apr: 22, acceptance: 64 },
  { apr: 25, acceptance: 55 },
  { apr: 28, acceptance: 50 },
  { apr: 30, acceptance: 47 },
  { apr: 33, acceptance: 44 },
  { apr: 35, acceptance: 42 },
  { apr: 38, acceptance: 41 },
  { apr: 40, acceptance: 40 },
  { apr: 43, acceptance: 40 },
  { apr: 46, acceptance: 39 },
  { apr: 49.9, acceptance: 38 },
];

// Revenue vs default — inverted-U curve (Einav, Jenkins & Levin 2012)
const REVENUE_DEFAULT_CURVE = [
  { apr: 6, revenue: 25, defaultRate: 3 },
  { apr: 9, revenue: 38, defaultRate: 4 },
  { apr: 12, revenue: 52, defaultRate: 5 },
  { apr: 15, revenue: 65, defaultRate: 7 },
  { apr: 18, revenue: 75, defaultRate: 9 },
  { apr: 20, revenue: 82, defaultRate: 11 },
  { apr: 22, revenue: 87, defaultRate: 14 },
  { apr: 25, revenue: 92, defaultRate: 18 },
  { apr: 28, revenue: 96, defaultRate: 22 },
  { apr: 30, revenue: 97, defaultRate: 26 },
  { apr: 32, revenue: 95, defaultRate: 30 },
  { apr: 35, revenue: 88, defaultRate: 35 },
  { apr: 38, revenue: 78, defaultRate: 39 },
  { apr: 40, revenue: 70, defaultRate: 42 },
  { apr: 43, revenue: 58, defaultRate: 44 },
  { apr: 46, revenue: 45, defaultRate: 46 },
  { apr: 49.9, revenue: 32, defaultRate: 48 },
];

function StatusBadge({ status }) {
  let cls = 'bg-green-100 text-green-700';
  if (status.includes('CEASED') || status.includes('PAUSED')) cls = 'bg-red-100 text-red-700';
  else if (status.includes('Deprioritised')) cls = 'bg-amber-100 text-amber-700';
  else if (status.includes('PE') || status.includes('growth')) cls = 'bg-blue-100 text-blue-700';
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
}

export default function PricingDashboard() {
  const { searchMetrics, socialMetrics, loading } = usePerformanceData();
  const [showDetail, setShowDetail] = useState(null);

  const chartData = useMemo(() =>
    COMPETITORS
      .filter(c => c.max)
      .map(c => ({ name: c.name, min: c.min, spread: c.max - c.min, rep: c.rep, color: c.color }))
      .sort((a, b) => a.min - b.min),
  []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Pricing & Competitive Intelligence</h2>
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">247CF Only</span>
      </div>

      {/* FCA Redress Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-red-500 text-lg">!</span>
          <div>
            <div className="text-sm font-semibold text-red-800">FCA Motor Finance DCA Redress Scheme (CP25/27)</div>
            <div className="text-xs text-red-700 mt-1">Up to 14M consumers affected, estimated £8.2B total compensation. Final rules due March 2026. Complaint handling paused until 31 May 2026. Advantage Finance exited market. Close Brothers paused UK lending. Moneybarn being wound down.</div>
          </div>
        </div>
      </div>

      {/* APR Range Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">APR Range Positioning (Verified March 2026)</h3>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 65]} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, name) => [name === 'rep' ? `${v}% representative` : `${v}%`, name === 'rep' ? 'Rep. APR' : name === 'min' ? '' : 'Range']} />
            <Bar dataKey="min" stackId="a" fill="transparent" />
            <Bar dataKey="spread" stackId="a" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.6} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-gray-400">Source: Company websites, FCA register, comparison sites. Research date: March 2026.</div>
      </div>

      {/* Full Competitor Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Competitor Intelligence ({COMPETITORS.length} players)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-500">Company</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Segment</th>
                <th className="text-right py-2 px-3 font-medium text-gray-500">Rep. APR</th>
                <th className="text-right py-2 px-3 font-medium text-gray-500">Range</th>
                <th className="text-center py-2 px-3 font-medium text-gray-500">Trustpilot</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Owner</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map(c => (
                <tr
                  key={c.name}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${showDetail === c.name ? 'bg-blue-50' : ''}`}
                  onClick={() => setShowDetail(showDetail === c.name ? null : c.name)}
                >
                  <td className="py-2 px-3">
                    <span className="font-medium text-gray-900">{c.name}</span>
                  </td>
                  <td className="py-2 px-3 text-gray-600 text-xs">{c.type}</td>
                  <td className="py-2 px-3 text-gray-600 text-xs">{c.segment}</td>
                  <td className="py-2 px-3 text-right font-mono text-gray-900">{c.rep}%</td>
                  <td className="py-2 px-3 text-right font-mono text-gray-600 text-xs">{c.min}% – {c.max ? `${c.max}%` : '?'}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="text-xs">{c.tp}/5</span>
                    <span className="text-xs text-gray-400 ml-1">({c.reviews})</span>
                  </td>
                  <td className="py-2 px-3"><StatusBadge status={c.status} /></td>
                  <td className="py-2 px-3 text-xs text-gray-500 max-w-[150px] truncate" title={c.owner}>{c.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showDetail && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-semibold text-blue-800">{showDetail}</div>
            <div className="text-xs text-blue-700 mt-1">{COMPETITORS.find(c => c.name === showDetail)?.intel}</div>
          </div>
        )}
      </div>

      {/* CAC-to-Pricing Bridge */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Cost per Application — CAC to Pricing Bridge</h3>
        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 uppercase font-medium">Google Ads CPA</div>
              <div className="text-2xl font-bold text-blue-700 mt-1">{searchMetrics ? fmt.cpa(searchMetrics.cpa) : '—'}</div>
              <div className="text-xs text-gray-500 mt-1">Search + PMAX + Demand Gen</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-xs text-purple-600 uppercase font-medium">Meta Ads CPA</div>
              <div className="text-2xl font-bold text-purple-700 mt-1">{socialMetrics ? fmt.cpa(socialMetrics.cpa) : '—'}</div>
              <div className="text-xs text-gray-500 mt-1">Paid Social (tracking issues noted)</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="text-xs text-amber-600 uppercase font-medium">Missing: Funded Deal Rate</div>
              <div className="text-2xl font-bold text-amber-700 mt-1">TBD</div>
              <div className="text-xs text-gray-500 mt-1">Need approval rate + LTV from Ross</div>
            </div>
          </div>
        )}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
          True CAC = CPA / Approval Rate. Without funded deal data from 247CF, we can only show cost-per-application, not cost-per-funded-deal.
        </div>
      </div>

      {/* Acceptance vs APR Elasticity Curve */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Acceptance Rate vs APR — Modelled Elasticity Curve</h3>
        <p className="text-xs text-gray-400 mb-4">Based on Adams, Einav & Levin (2009), Einav et al. (2012), CFPB Consumer Credit Panel. Not 247CF internal data.</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={ELASTICITY_CURVE} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="acceptGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="apr" tickFormatter={v => `${v}%`} label={{ value: 'APR', position: 'bottom', offset: 0 }} />
            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} label={{ value: 'Acceptance Rate', angle: -90, position: 'insideLeft', offset: 10 }} />
            <Tooltip formatter={(v) => [`${v}%`, 'Acceptance Rate']} labelFormatter={v => `${v}% APR`} />
            <ReferenceLine x={18} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Near-prime boundary', position: 'top', fill: '#10B981', fontSize: 10 }} />
            <ReferenceLine x={35} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Default inflection', position: 'top', fill: '#EF4444', fontSize: 10 }} />
            <Area type="monotone" dataKey="acceptance" stroke="#3B82F6" fill="url(#acceptGrad)" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-2 bg-green-50 rounded">
            <span className="font-semibold text-green-700">&lt;18% APR:</span>
            <span className="text-gray-600 ml-1">Near-prime. Elastic (~-1.2). Oodle (12.1%), Startline (14.9%), Lookers (11.9%) compete here.</span>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <span className="font-semibold text-blue-700">18-35% APR:</span>
            <span className="text-gray-600 ml-1">Core subprime. 247CF (19.8%), Zuto (18.8%), Close Bros (21.9%) cluster here. Revenue peaks ~28-32%.</span>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <span className="font-semibold text-red-700">&gt;35% APR:</span>
            <span className="text-gray-600 ml-1">Deep subprime. Moneybarn (30.7%), Advantage (33.9% — now ceased). Desperation demand.</span>
          </div>
        </div>
      </div>

      {/* Revenue vs Default Dual Axis */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Revenue vs Default Risk — The Pricing Sweet Spot</h3>
        <p className="text-xs text-gray-400 mb-4">Revenue peaks ~28-32% APR before defaults erode net yield. Einav, Jenkins & Levin (2012).</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={REVENUE_DEFAULT_CURVE} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="apr" tickFormatter={v => `${v}%`} label={{ value: 'APR', position: 'bottom', offset: 0 }} />
            <YAxis yAxisId="left" domain={[0, 100]} tickFormatter={v => `${v}`} label={{ value: 'Net Revenue Index', angle: -90, position: 'insideLeft', offset: 10 }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 50]} tickFormatter={v => `${v}%`} label={{ value: 'Default Rate', angle: 90, position: 'insideRight', offset: 10 }} />
            <Tooltip formatter={(v, name) => [name === 'Default Rate' ? `${v}%` : v, name]} labelFormatter={v => `${v}% APR`} />
            <ReferenceLine x={30} stroke="#F59E0B" strokeDasharray="5 5" label={{ value: 'Peak yield zone', position: 'top', fill: '#F59E0B', fontSize: 10 }} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Net Revenue Index" dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="defaultRate" stroke="#EF4444" strokeWidth={2} name="Default Rate" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Research Findings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Research Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">-0.5 to -1.5</div>
            <div className="text-xs text-blue-600 mt-1">Subprime demand elasticity</div>
            <div className="text-xs text-gray-500 mt-1">Adams, Einav & Levin (2009)</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">~35%</div>
            <div className="text-xs text-purple-600 mt-1">Default risk inflection point</div>
            <div className="text-xs text-gray-500 mt-1">Einav, Jenkins & Levin (2012)</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">£8.2B</div>
            <div className="text-xs text-green-600 mt-1">Estimated FCA DCA redress total</div>
            <div className="text-xs text-gray-500 mt-1">FCA CP25/27 (Oct 2025)</div>
          </div>
        </div>
      </div>

      {/* Market Landscape Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Market Landscape — Key Shifts (March 2026)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="font-semibold text-red-700">Exits & Retreats</div>
            <ul className="mt-1 text-gray-600 space-y-1">
              <li><strong>Advantage Finance</strong> — ceased lending Jul 2025, sold to LCM for £459M</li>
              <li><strong>Close Brothers</strong> — paused UK motor lending, £300M+ provisions, 600 job cuts</li>
              <li><strong>Moneybarn</strong> — deprioritised by Vanquis, £71M goodwill write-off, volumes -24%</li>
            </ul>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="font-semibold text-green-700">Growth & Investment</div>
            <ul className="mt-1 text-gray-600 space-y-1">
              <li><strong>Zuto</strong> — Bridgepoint PE acquisition, 35% revenue growth, AutoTrader exclusive</li>
              <li><strong>Startline</strong> — £475M JP Morgan facility, £747M securitised, targeting 3% share</li>
              <li><strong>Oodle</strong> — £393M ABS deal, direct lender model avoiding DCA exposure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
