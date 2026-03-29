import { AlertTriangle, AlertCircle, XCircle, Phone, Globe, Shield, Target, Zap } from 'lucide-react';
import { fmt } from '../../services/dataLoader';
import AlertCard from '../shared/AlertCard';
import StatusDot from '../shared/StatusDot';
import SectionHeader from '../shared/SectionHeader';
import { CONVERSION_ACTIONS, PMAX_DIAGNOSTICS } from '../../data/auditData';

const PMAX_ICONS = { 'Brand negatives applied': Shield, 'Asset groups by intent': Target, 'Incrementality test': Zap, 'Financial services verification': AlertCircle, 'URL exclusions': Globe };

export default function SearchConversionHealth() {
  return (
    <>
      {/* Conversion Tracking Integrity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Conversion Tracking Integrity" sub="27 conversion actions configured. Only 'Application' shows meaningful volume. Dual SA360 + MID tracking creates noise." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <AlertCard severity="critical" title="27 Conversion Actions" text="14 active, only 1 meaningful ('Application'). Remaining 26 dilute signal. Recommend: set Application as sole primary, pause test floodlights." icon={AlertCircle} />
          <AlertCard severity="warning" title="Dual Tracking Active" text="SA360 + MID both reporting conversions. Creates double-counting risk. Consolidate to single conversion source." icon={AlertTriangle} />
          <AlertCard severity="info" title="Phone Calls Untracked" text="'Clicks to call' events exist but no call tracking integration. Material portion of funded deals likely via phone — invisible to platform." icon={Phone} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Events/Period</th>
                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Signal</th>
                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {CONVERSION_ACTIONS.map(a => {
                const rowBg = a.signal === 'NOISE' ? 'bg-red-50' : a.signal === 'LOW' ? 'bg-amber-50' : '';
                return (
                  <tr key={a.name} className={`border-b border-gray-100 ${rowBg}`}>
                    <td className="py-1.5 px-2 font-medium text-gray-900">{a.name}</td>
                    <td className="py-1.5 px-2 text-gray-600">{a.type}</td>
                    <td className="py-1.5 px-2"><StatusDot status={a.status === 'active' ? 'green' : 'red'} /></td>
                    <td className="py-1.5 px-2 text-right text-gray-700">{a.events}</td>
                    <td className="py-1.5 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        a.signal === 'HIGH' ? 'bg-green-100 text-green-700' :
                        a.signal === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                        a.signal === 'LOW' ? 'bg-gray-100 text-gray-500' :
                        'bg-red-100 text-red-700'
                      }`}>{a.signal}</span>
                    </td>
                    <td className="py-1.5 px-2 text-gray-500">{a.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PMAX Diagnostics */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Performance Max Diagnostics" sub="£433K spend with no incrementality evidence. All asset groups policy-restricted." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-xl font-bold text-gray-900">{fmt.currency(247955)}</div><div className="text-xs text-gray-500">PMAX Spend</div></div>
              <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-xl font-bold text-gray-900">{fmt.number(12359)}</div><div className="text-xs text-gray-500">Applications</div></div>
              <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-xl font-bold text-gray-900">{fmt.cpa(20.06)}</div><div className="text-xs text-gray-500">CPA</div></div>
            </div>
            <div className="space-y-2">
              {PMAX_DIAGNOSTICS.map(d => {
                const Icon = PMAX_ICONS[d.label] || AlertCircle;
                return (
                  <div key={d.label} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <StatusDot status={d.status} />
                    <Icon size={14} className="text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-700">{d.label}</span>
                      <span className="text-xs text-gray-400 ml-2">{d.note}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            <AlertCard severity="warning" title="Incrementality Unknown" text="PMAX CPA (£20.06) looks strong but without a geo holdout test, we don't know what's incremental vs cannibalised from brand/exact. TAU recommendation: launch 4-week geographic holdout test covering 15-20% of traffic." icon={AlertTriangle} />
            <AlertCard severity="critical" title="Policy Restrictions" text="All PMAX asset groups limited by Google negative financial status policy. Financial services verification not completed. This caps delivery and increases CPMs." icon={XCircle} />
          </div>
        </div>
      </div>
    </>
  );
}
