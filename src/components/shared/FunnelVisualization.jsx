import { ChevronRight } from 'lucide-react';

export default function FunnelVisualization({ stages, accentColor = 'blue' }) {
  const colors = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', connector: 'text-blue-300', arrow: 'text-blue-400' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', connector: 'text-purple-300', arrow: 'text-purple-400' },
  };
  const c = colors[accentColor] || colors.blue;

  return (
    <div className="flex flex-wrap gap-0 items-center justify-center">
      {stages.map((stage, i) => (
        <div key={stage.label} className="flex items-center" style={{ animationDelay: `${i * 80}ms` }}>
          {i > 0 && (
            <div className="flex items-center mx-1">
              {stage.connected ? (
                <ChevronRight size={20} className={c.arrow} />
              ) : (
                <div className="w-6 border-t-2 border-dashed border-gray-300" />
              )}
            </div>
          )}
          <div className={`p-3 rounded-lg border text-center min-w-[120px] transition-all ${
            stage.connected
              ? `${c.bg} ${c.border}`
              : 'bg-gray-50 border-gray-200 border-dashed'
          }`}>
            <div className="text-xs text-gray-500 uppercase font-medium">{stage.label}</div>
            <div className={`text-lg font-bold mt-1 ${stage.connected ? c.text : 'text-gray-300'}`}>
              {stage.value}
            </div>
            {stage.cost && <div className="text-xs text-gray-400 mt-0.5">Cost: {stage.cost}</div>}
            {stage.note && <div className="text-xs text-amber-500 mt-0.5">{stage.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
