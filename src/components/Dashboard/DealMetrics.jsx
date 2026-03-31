import { AlertTriangle, Info } from 'lucide-react';
import { fmt } from '../../services/dataLoader';

function MetricCard({ label, value, sub, children }) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{label}</div>
      <div className="mt-2 text-2xl font-bold text-emerald-950">{value}</div>
      {sub ? <div className="mt-1 text-xs text-emerald-700">{sub}</div> : null}
      {children}
    </div>
  );
}

export default function DealMetrics({ crmData, avgOrderValue, onAvgOrderValueChange }) {
  if (!crmData?.totals) return null;

  const { totals, monthly, note } = crmData;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Deal Metrics</h3>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
              CRM Verified | {totals.label}
            </span>
            <div className="group relative">
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700"
                aria-label={note}
                title="CRM data reliable for Feb 2026 only. Jan/Mar shown for context but may be incomplete."
              >
                <Info size={14} />
              </button>
              <div className="pointer-events-none absolute left-0 top-8 z-10 hidden w-72 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg group-hover:block">
                CRM data reliable for Feb 2026 only. Jan/Mar shown for context but may be incomplete.
              </div>
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-500">Feb 2026 only. Revenue is estimated from the configurable average order value assumption.</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {monthly.map((month) => (
            <div
              key={month.month}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                month.reliable
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              {month.reliable ? <Info size={12} /> : <AlertTriangle size={12} />}
              <span className="font-semibold">{month.label}</span>
              <span>{fmt.numberFull(month.deals)} deals</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Funded Deals" value={fmt.numberFull(totals.deals)} sub="Paid out deals from CRM" />
        <MetricCard label="Deal Rate (CRM)" value={fmt.pctCompact(totals.dealRate)} sub={`${fmt.numberFull(totals.deals)} / ${fmt.numberFull(totals.applications)} CRM applications`} />
        <MetricCard label="Cost per Deal" value={fmt.currencyFull(totals.costPerDeal)} sub={`${fmt.currencyFull(totals.spend)} estimated Feb spend / ${fmt.numberFull(totals.deals)} deals`} />
        <MetricCard label="Revenue (est.)" value={fmt.currencyFull(totals.revenue)} sub={`${fmt.numberFull(totals.deals)} x ${fmt.currencyFull(avgOrderValue)}`} />
        <MetricCard label="Deal ROI" value={fmt.roas(totals.dealRoi)} sub={`${fmt.currencyFull(totals.revenue)} / ${fmt.currencyFull(totals.spend)}`} />
        <MetricCard label="Avg Order Value" value={fmt.currencyFull(avgOrderValue)}>
          <div className="mt-3 flex items-center rounded-lg border border-emerald-200 bg-white px-3 py-2">
            <span className="mr-2 text-sm font-medium text-emerald-800">£</span>
            <input
              type="number"
              min="0"
              step="100"
              value={avgOrderValue}
              onChange={(event) => onAvgOrderValueChange(Number(event.target.value || 0))}
              className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none"
            />
          </div>
          <div className="mt-2 text-xs text-emerald-700">Configurable assumption — no deal value in CRM</div>
        </MetricCard>
      </div>
    </div>
  );
}
