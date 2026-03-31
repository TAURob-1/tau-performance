import { useMemo, useState } from 'react';
import { BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';

const MODEL_OPTIONS = [
  {
    key: 'last-click',
    title: 'Last Click',
    description: 'Assigns full credit to the final clicked channel before application.',
    status: 'Current',
    statusTone: 'bg-blue-100 text-blue-700',
    enabled: true,
  },
  {
    key: 'data-driven',
    title: 'Data-Driven',
    description: 'Uses conversion-path weighting to estimate incremental channel contribution.',
    status: 'Recommended',
    statusTone: 'bg-emerald-100 text-emerald-700',
    beta: true,
    enabled: true,
  },
  {
    key: 'linear',
    title: 'Linear',
    description: 'Splits credit evenly across touchpoints in the customer journey.',
    status: 'Coming Soon',
    statusTone: 'bg-gray-100 text-gray-500',
    enabled: false,
  },
];

const LOOKBACK_WINDOWS = ['7 days', '14 days', '30 days', '90 days'];
const VIEW_THROUGH_WINDOWS = ['None', '1 day', '7 days'];
const ATTRIBUTION_SHARE = [
  { channel: 'Google Ads', share: 68, fill: '#2563EB' },
  { channel: 'Meta', share: 32, fill: '#9CA3AF' },
];

function AttributionTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-100">
      <p className="text-xs font-medium text-gray-700 mb-1">{label}</p>
      <p className="text-xs text-gray-600">
        Attribution Share: <span className="font-medium">{payload[0].value}%</span>
      </p>
    </div>
  );
}

function ControlGroup({ title, options, value, onChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <SectionHeader title={title} sub="Placeholder controls for attribution modelling inputs." />
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AttributionDashboard() {
  const [selectedModel, setSelectedModel] = useState('last-click');
  const [lookbackWindow, setLookbackWindow] = useState('30 days');
  const [viewThroughWindow, setViewThroughWindow] = useState('1 day');

  const selectedModelMeta = useMemo(
    () => MODEL_OPTIONS.find((model) => model.key === selectedModel) || MODEL_OPTIONS[0],
    [selectedModel]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Multi-Touch Attribution</h2>
        <p className="text-xs text-gray-400 mt-0.5">Configure attribution model parameters to understand true channel contribution</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Attribution Model" sub="Select the reporting model used to apportion channel credit across the funnel." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {MODEL_OPTIONS.map((model) => {
            const isSelected = model.key === selectedModel;
            const disabled = !model.enabled;
            return (
              <button
                key={model.key}
                type="button"
                onClick={() => !disabled && setSelectedModel(model.key)}
                disabled={disabled}
                className={`text-left rounded-xl border p-4 transition-all ${
                  disabled
                    ? 'bg-gray-50 border-gray-200 opacity-75 cursor-not-allowed'
                    : isSelected
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">{model.title}</h3>
                      {model.beta && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">
                          Beta
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{model.description}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${model.statusTone}`}>
                    {model.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  {disabled ? (
                    <>
                      <Clock3 size={14} className="text-gray-400" />
                      <span className="text-gray-500">Not selectable yet</span>
                    </>
                  ) : isSelected ? (
                    <>
                      <CheckCircle2 size={14} className="text-blue-600" />
                      <span className="text-blue-700 font-medium">Selected model</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-white" />
                      <span className="text-gray-500">Available to configure</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ControlGroup
          title="Lookback Window"
          options={LOOKBACK_WINDOWS}
          value={lookbackWindow}
          onChange={setLookbackWindow}
        />
        <ControlGroup
          title="View-Through Window"
          options={VIEW_THROUGH_WINDOWS}
          value={viewThroughWindow}
          onChange={setViewThroughWindow}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader
          title="Placeholder Attribution Split"
          sub={`Illustrative channel share under ${selectedModelMeta.title}. Current placeholder is locked to Last Click dummy data until live integrations are connected.`}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] gap-6 items-start">
          <div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ATTRIBUTION_SHARE} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#6B7280' }} stroke="#E5E7EB" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `${value}%`} tick={{ fontSize: 11, fill: '#6B7280' }} stroke="#E5E7EB" tickLine={false} axisLine={false} />
                <Tooltip content={<AttributionTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }} />
                <Bar dataKey="share" radius={[6, 6, 0, 0]} maxBarSize={96}>
                  {ATTRIBUTION_SHARE.map((entry) => (
                    <Cell key={entry.channel} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {ATTRIBUTION_SHARE.map((entry) => (
              <div key={entry.channel} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{entry.channel}</span>
                  <span className="text-lg font-semibold text-gray-900">{entry.share}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${entry.share}%`, backgroundColor: entry.fill }} />
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                Data-driven attribution requires minimum 300 conversions/month. Connect Google Ads API and Meta Conversion API to enable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
