import { CheckCircle, AlertTriangle, Globe } from 'lucide-react';
import AlertCard from '../shared/AlertCard';
import IncrementalityExperiments from '../shared/IncrementalityExperiments';
import SectionHeader from '../shared/SectionHeader';
import { ATTRIBUTION_SETTINGS, INCREMENTALITY_EXPERIMENTS } from '../../data/auditData';

export default function SocialAttribution() {
  return (
    <div className="space-y-6">
      <IncrementalityExperiments
        title="Incrementality & Experiment Placeholders"
        sub="Meta incrementality should follow exposed-vs-control reporting, not platform ROAS alone. Placeholder wiring is in place until Experiments API access is available."
        experiments={[INCREMENTALITY_EXPERIMENTS.meta]}
        warning="Prospecting and retargeting can both look efficient while still over-claiming conversions. Treat post-view and platform lift as directional until matched against holdouts or CRM outcomes."
        recommendation="Use the same reporting logic as TAU geo tests: define the counterfactual first, separate exposed from control, then report lift, confidence, and iROAS as distinct fields when the API lands."
      />

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Attribution Model Audit" sub="TAU: standardise all ad sets to 7-day click, 1-day view. Multiple settings detected." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {ATTRIBUTION_SETTINGS.map(a => (
              <div key={a.setting} className={`flex items-center justify-between p-3 rounded-lg ${a.ok ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}>
                <div className="flex items-center gap-2">
                  {a.ok ? <CheckCircle size={16} className="text-green-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                  <span className="text-sm font-medium text-gray-700">{a.setting}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{a.count} ad sets</span>
                  <div className="text-xs text-gray-500">{a.status}</div>
                </div>
              </div>
            ))}
          </div>
          <AlertCard severity="warning" title="Geographic Leakage Detected" text="Impressions served outside UK in Brazil, Germany, Spain, Dubai, France + 20 other countries. Estimated waste: £46K-£69K/year. Tighten geographic targeting to UK only." icon={Globe} />
        </div>
      </div>
    </div>
  );
}
