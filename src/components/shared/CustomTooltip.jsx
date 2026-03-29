import { fmt } from '../../services/dataLoader';

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-100">
      {label && <p className="text-xs font-medium text-gray-700 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-gray-600">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium">{typeof p.value === 'number' && p.value > 100 ? fmt.currency(p.value) : typeof p.value === 'number' ? fmt.number(p.value) : p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function ScatterTooltip({ active, payload, fields }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-100 max-w-[250px]">
      <p className="text-xs font-medium text-gray-900 mb-1 truncate">{d.name}</p>
      {(fields || [
        { key: 'x', label: 'X', format: fmt.number },
        { key: 'y', label: 'Y', format: fmt.cpa },
        { key: 'z', label: 'Z', format: fmt.currency },
      ]).map(f => (
        <p key={f.key} className="text-xs text-gray-600">
          {f.label}: <span className="font-medium">{f.format(d[f.key])}</span>
        </p>
      ))}
      {d.intent && <p className="text-xs text-gray-400 mt-0.5">{d.intent}</p>}
    </div>
  );
}
