import { Copy, XCircle, AlertCircle } from 'lucide-react';
import AlertCard from '../shared/AlertCard';
import StatusDot from '../shared/StatusDot';
import SectionHeader from '../shared/SectionHeader';
import { CAPI_EVENTS } from '../../data/auditData';

export default function SocialConversionHealth() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <SectionHeader title="CAPI Event Health & Tracking Integrity" sub="Conversions API is table stakes (TAU). Target 6.0+ Event Match Quality. Fix deduplication urgently." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <AlertCard severity="critical" title="50%+ Duplicate Data" text="Over 50% duplicate email and phone numbers in Conversions API. Inflating reported conversions. Fix event_id deduplication." icon={Copy} />
        <AlertCard severity="critical" title="Domain Not Verified" text="No domain verified in Meta Business Manager. Cannot configure Aggregated Event Measurement. Limits iOS 14+ attribution." icon={XCircle} />
        <AlertCard severity="critical" title="Car Campaigns — Zero Conversions" text="Car campaigns (£284K spend) showing zero conversions at campaign level. CAPI tracking broken for car vertical specifically." icon={AlertCircle} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
              <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Integration</th>
              <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">EMQ Score</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Events</th>
              <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duplicates</th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody>
            {CAPI_EVENTS.map(e => {
              const rowBg = e.status === 'green' ? 'bg-green-50' : e.status === 'amber' ? 'bg-amber-50' : 'bg-red-50';
              return (
                <tr key={e.event} className={`border-b border-gray-100 ${rowBg}`}>
                  <td className="py-1.5 px-2 font-medium text-gray-900">{e.event}</td>
                  <td className="py-1.5 px-2 text-center"><StatusDot status={e.status} /></td>
                  <td className="py-1.5 px-2 text-gray-600">{e.integration}</td>
                  <td className="py-1.5 px-2 text-center">
                    {e.emq !== '—' ? (
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${parseFloat(e.emq) >= 7 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{e.emq}</span>
                    ) : '—'}
                  </td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{e.events}</td>
                  <td className="py-1.5 px-2 text-center">
                    {e.duplicates !== '—' ? <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium">{e.duplicates}</span> : '—'}
                  </td>
                  <td className="py-1.5 px-2 text-gray-500">{e.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
