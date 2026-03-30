import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FlaskConical, MapPin, TrendingUp, AlertTriangle, CheckCircle, Clock, Target, BarChart3, Info, Beaker } from 'lucide-react';
import { fmt } from '../../services/dataLoader';
import KPICard from '../shared/KPICard';
import AlertCard from '../shared/AlertCard';
import SectionHeader from '../shared/SectionHeader';
import CustomTooltip from '../shared/CustomTooltip';
import StatusDot from '../shared/StatusDot';
import { GEO_TEST_CONFIG, UK_REGIONS, EXPECTED_DELIVERY, INDUSTRY_BENCHMARKS, STATISTICAL_CONFIDENCE, POWER_ANALYSIS } from '../../data/geoTestData';

const STATUS_BADGE = {
  proposed: { label: 'Proposed', bg: 'bg-amber-100 text-amber-700', icon: Clock },
  running: { label: 'Running', bg: 'bg-blue-100 text-blue-700', icon: FlaskConical },
  complete: { label: 'Complete', bg: 'bg-green-100 text-green-700', icon: CheckCircle },
};

const DeliveryTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-100">
      <p className="text-xs font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-gray-600">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium">{(p.value / 1000).toFixed(0)}K impressions</span>
        </p>
      ))}
    </div>
  );
};

export default function GeoIncrementalityDashboard() {
  const config = GEO_TEST_CONFIG;
  const status = STATUS_BADGE[config.status];
  const StatusIcon = status.icon;

  const exposedRegions = UK_REGIONS.filter(r => r.group === 'exposed');
  const holdoutRegions = UK_REGIONS.filter(r => r.group === 'holdout');
  const totalExposedApps = exposedRegions.reduce((s, r) => s + r.applications, 0);
  const totalHoldoutApps = holdoutRegions.reduce((s, r) => s + r.applications, 0);
  const totalExposedSpend = exposedRegions.reduce((s, r) => s + r.spend, 0);

  // Delivery chart data
  const deliveryChartData = EXPECTED_DELIVERY.labels.map((label, i) => ({
    period: label,
    exposed: EXPECTED_DELIVERY.exposed[i],
    holdout: EXPECTED_DELIVERY.holdout[i],
  }));

  // Region chart data for bar chart
  const regionChartData = UK_REGIONS.map(r => ({
    name: r.region,
    applications: r.applications,
    fill: r.group === 'exposed' ? '#3B82F6' : '#9CA3AF',
  }));

  const { exposedGroup, holdoutGroup, testResult } = STATISTICAL_CONFIDENCE;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Geo Incrementality Testing</h2>
          <p className="text-xs text-gray-400 mt-0.5">PMAX incrementality measurement — geographic holdout design</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg}`}>
            <StatusIcon size={14} />
            {status.label}
          </span>
        </div>
      </div>

      {/* Test Status Banner */}
      <div className={`rounded-xl p-4 border flex items-start gap-3 ${
        config.status === 'complete' ? 'bg-green-50 border-green-200' :
        config.status === 'running' ? 'bg-blue-50 border-blue-200' :
        'bg-amber-50 border-amber-200'
      }`}>
        <Beaker size={20} className={
          config.status === 'complete' ? 'text-green-500' :
          config.status === 'running' ? 'text-blue-500' :
          'text-amber-500'
        } />
        <div className="flex-1">
          <div className={`text-sm font-semibold ${
            config.status === 'complete' ? 'text-green-800' :
            config.status === 'running' ? 'text-blue-800' :
            'text-amber-800'
          }`}>
            {config.status === 'proposed' ? 'Test Proposed — Awaiting Approval' :
             config.status === 'running' ? 'Test In Progress' :
             'Test Complete — Results Available'}
          </div>
          <p className="text-xs text-gray-600 mt-1">{config.objective}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>Campaign: <strong>{config.campaign}</strong></span>
            <span>Period: <strong>{config.testPeriod.start} to {config.testPeriod.end}</strong></span>
            <span>Duration: <strong>{config.testPeriod.weeks} weeks</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="PMAX Spend" value={fmt.currency(totalExposedSpend)} sub={`£${config.budget.daily.toLocaleString()}/day`} color="blue" />
        <KPICard label="Exposed Regions" value={exposedRegions.length} sub={`~${fmt.number(totalExposedApps)} baseline apps`} color="green" />
        <KPICard label="Holdout Regions" value={holdoutRegions.length} sub={`~${fmt.number(totalHoldoutApps)} baseline apps`} color="purple" />
        <KPICard label="Measured Lift" value={config.status === 'complete' ? '+16.2%' : 'TBD'} sub={config.status === 'complete' ? '95% confidence' : 'Awaiting test'} color={config.status === 'complete' ? 'green' : 'orange'} />
        <KPICard label="Est. iROAS" value={config.status === 'complete' ? '£2.94' : 'TBD'} sub={config.status === 'complete' ? 'Incremental' : 'Awaiting test'} color={config.status === 'complete' ? 'green' : 'orange'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Region Map + Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Geographic Test Design */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <SectionHeader title="Geographic Test Design" sub="UK regions split into exposed (PMAX active) and holdout (PMAX paused). ~80/20 traffic split." />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={regionChartData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tickFormatter={v => fmt.number(v)} tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="applications" name="Baseline Apps" radius={[0, 4, 4, 0]}>
                      {regionChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2 justify-center text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Exposed</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> Holdout</span>
                </div>
              </div>
              <div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Region</th>
                      <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Group</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Pop.</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Baseline Apps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UK_REGIONS.map(r => (
                      <tr key={r.region} className={`border-b border-gray-100 ${r.group === 'holdout' ? 'bg-gray-50' : ''}`}>
                        <td className="py-1.5 px-2 font-medium text-gray-900">
                          <MapPin size={12} className={`inline mr-1 ${r.group === 'exposed' ? 'text-blue-500' : 'text-gray-400'}`} />
                          {r.region}
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${r.group === 'exposed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {r.group}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-right text-gray-600">{r.population}</td>
                        <td className="py-1.5 px-2 text-right text-gray-700">{fmt.number(r.applications)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Expected Delivery Performance */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="Expected Delivery Performance" sub="Projected impression delivery across exposed vs holdout regions over 4-week test period." />
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-blue-500" /> Exposed</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-gray-400 opacity-60" /> Holdout</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={deliveryChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="exposedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="holdoutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#e5e7eb" tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#e5e7eb" tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<DeliveryTooltip />} />
                <Area type="monotone" dataKey="exposed" stroke="#3b82f6" strokeWidth={2.5} fill="url(#exposedGrad)" name="Exposed Regions" dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="holdout" stroke="#9ca3af" strokeWidth={2} strokeDasharray="6 3" fill="url(#holdoutGrad)" name="Holdout Regions" dot={false} activeDot={{ r: 5, fill: '#9ca3af', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Why This Test */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <SectionHeader title="Why This Test?" />
            <div className="space-y-3">
              <AlertCard severity="critical" title="PMAX Incrementality Unknown" text="£248K spent on PMAX with £20.06 CPA — but without a holdout test, we can't separate truly incremental applications from cannibalised brand traffic." />
              <AlertCard severity="warning" title="Brand Cannibalisation Risk" text="No brand negatives confirmed on PMAX. Asset groups may be bidding on '247 CarFinance' branded queries that would convert organically." />
              <AlertCard severity="info" title="TAU Recommendation" text="Launch 4-week geographic holdout test covering 15-20% of traffic. Pause PMAX in holdout regions, measure application delta." />
            </div>
          </div>

          {/* Power Analysis */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <SectionHeader title="Power Analysis" sub="Pre-test statistical requirements" />
            <div className="space-y-3">
              {[
                { label: 'Baseline conversion rate', value: `${(POWER_ANALYSIS.baselineConversionRate * 100).toFixed(1)}%` },
                { label: 'Min. detectable effect', value: `${(POWER_ANALYSIS.minimumDetectableEffect * 100).toFixed(0)}% relative lift` },
                { label: 'Required sample', value: POWER_ANALYSIS.requiredSampleSize },
                { label: 'Test duration', value: POWER_ANALYSIS.testDuration },
                { label: 'Confidence level', value: POWER_ANALYSIS.confidenceLevel },
                { label: 'Statistical power', value: POWER_ANALYSIS.statisticalPower },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
              <Info size={13} className="flex-shrink-0 mt-0.5" />
              <span>{POWER_ANALYSIS.note}</span>
            </div>
          </div>

          {/* Statistical Confidence (placeholder until test runs) */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <SectionHeader title="Statistical Confidence" />
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Exposed Group <span className="text-gray-400">(n={exposedGroup.n} regions)</span></span>
                  <span className="font-semibold text-gray-400">{exposedGroup.lift}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${exposedGroup.confidence}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Holdout Group <span className="text-gray-400">(n={holdoutGroup.n} regions)</span></span>
                  <span className="font-semibold text-gray-500">{holdoutGroup.lift}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-gray-300 h-2.5 rounded-full" style={{ width: '48%' }} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{holdoutGroup.note}</div>
              </div>
              <div className={`rounded-lg p-4 mt-2 ${testResult.significant ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className={`text-sm font-semibold ${testResult.significant ? 'text-emerald-800' : 'text-gray-500'}`}>
                  {testResult.status}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div><div className="text-[10px] text-gray-500 uppercase tracking-wider">p-value</div><div className="text-sm font-semibold text-gray-900">{testResult.pValue}</div></div>
                  <div><div className="text-[10px] text-gray-500 uppercase tracking-wider">Power</div><div className="text-sm font-semibold text-gray-900">{testResult.power}</div></div>
                  <div><div className="text-[10px] text-gray-500 uppercase tracking-wider">Effect</div><div className="text-sm font-semibold text-gray-900">{testResult.effectSize}</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Benchmarks */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Industry Incrementality Benchmarks" sub="Reference results from similar UK financial services geo holdout tests." />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Advertiser</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Channel</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Measured Lift</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">iROAS</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Design</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Key Learning</th>
              </tr>
            </thead>
            <tbody>
              {INDUSTRY_BENCHMARKS.map((b, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-900">{b.advertiser}</td>
                  <td className="py-2 px-3 text-gray-600">{b.channel}</td>
                  <td className="py-2 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">{b.lift}</span>
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-gray-700">{b.iROAS}</td>
                  <td className="py-2 px-3 text-xs text-gray-600">{b.testType}</td>
                  <td className="py-2 px-3 text-xs text-gray-500 max-w-[250px]">{b.learning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Methodology */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Test Methodology" sub="Step-by-step process for running the geo incrementality test." />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: 'Pre-Test', desc: 'Establish baseline application rates across all UK regions for 2 weeks. Confirm holdout/exposed split achieves balance.', status: 'complete', icon: BarChart3 },
            { step: 2, title: 'Launch', desc: 'Pause PMAX in holdout regions (Scotland, North East, Wales). Maintain all other campaigns unchanged.', status: 'pending', icon: Target },
            { step: 3, title: 'Measure', desc: 'Run for 4 weeks minimum. Monitor application rates daily. Alert if holdout conversion rate drops >30%.', status: 'pending', icon: TrendingUp },
            { step: 4, title: 'Analyse', desc: 'Compare application rates between exposed and holdout. Calculate incremental lift, iROAS, and true cost per funded deal.', status: 'pending', icon: FlaskConical },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.step} className={`p-4 rounded-lg border ${s.status === 'complete' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.status === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{s.step}</span>
                  <Icon size={16} className={s.status === 'complete' ? 'text-green-600' : 'text-gray-400'} />
                  <span className="text-sm font-semibold text-gray-700">{s.title}</span>
                </div>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-400">
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span>Test design based on TAU performance machine recommendations. Baseline application data is illustrative — actual baseline will be established during pre-test period. Industry benchmarks are anonymised reference data.</span>
      </div>
    </div>
  );
}
