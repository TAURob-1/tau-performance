import { FlaskConical, Info, ShieldAlert } from 'lucide-react';
import AlertCard from './AlertCard';
import SectionHeader from './SectionHeader';

const STATUS_STYLES = {
  placeholder: 'bg-amber-100 text-amber-700',
  connected: 'bg-green-100 text-green-700',
};

function ExperimentCard({ experiment }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide font-medium text-gray-400">{experiment.platform}</div>
          <div className="text-sm font-semibold text-gray-800 mt-1">{experiment.source}</div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[experiment.status] || STATUS_STYLES.placeholder}`}>
          {experiment.statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
        {[
          { label: 'Methodology', value: experiment.methodology },
          { label: 'Counterfactual', value: experiment.counterfactual },
          { label: 'Placeholder readout', value: experiment.placeholder, valueClass: 'font-mono text-xs md:text-sm' },
          { label: 'API state', value: experiment.apiState },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-gray-400">{item.label}</div>
            <div className={`text-sm text-gray-800 mt-1 ${item.valueClass || ''}`}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-xs text-blue-800">
        <Info size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
        <span>{experiment.note}</span>
      </div>
    </div>
  );
}

export default function IncrementalityExperiments({ title, sub, experiments, recommendation, warning }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <SectionHeader title={title} sub={sub} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {experiments.map((experiment) => (
          <ExperimentCard key={experiment.platform} experiment={experiment} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
        <AlertCard
          severity="warning"
          title="Incrementality First"
          text={warning}
          icon={ShieldAlert}
        />
        <AlertCard
          severity="info"
          title="TAU Reporting Pattern"
          text={recommendation}
          icon={FlaskConical}
        />
      </div>
    </div>
  );
}
