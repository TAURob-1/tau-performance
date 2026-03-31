import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Generate synthetic sparkline data with a trend direction
function generateSparkline(value, trend = 'up', points = 8) {
  const base = typeof value === 'number' ? value : 100;
  const data = [];
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const trendFactor = trend === 'up' ? progress * 0.3 : trend === 'down' ? -progress * 0.3 : 0;
    const noise = (Math.random() - 0.5) * 0.15;
    data.push({ v: base * (0.85 + trendFactor + noise) });
  }
  return data;
}

export default function KPICard({
  label,
  value,
  sub,
  trend,
  trendValue,
  sparklineData,
  sparklineTrend = 'up',
  color = 'blue',
  className = '',
  valueClassName = '',
  subClassName = '',
  hideSparkline = false,
}) {
  const colors = {
    blue: { spark: '#3B82F6', bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { spark: '#10B981', bg: 'bg-green-50', text: 'text-green-600' },
    purple: { spark: '#8B5CF6', bg: 'bg-purple-50', text: 'text-purple-600' },
    orange: { spark: '#F59E0B', bg: 'bg-orange-50', text: 'text-orange-600' },
    red: { spark: '#EF4444', bg: 'bg-red-50', text: 'text-red-600' },
  };
  const c = colors[color] || colors.blue;
  const data = sparklineData || generateSparkline(100, sparklineTrend);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400';

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</div>
          <div className={`text-2xl font-bold text-gray-900 mt-1 ${valueClassName}`}>{value}</div>
          <div className="flex items-center gap-1.5 mt-1">
            {trend && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
                <TrendIcon size={12} />
                {trendValue}
              </span>
            )}
            {sub && <span className={`text-xs text-gray-400 ${subClassName}`}>{trend ? '· ' : ''}{sub}</span>}
          </div>
        </div>
        {!hideSparkline && (
          <div className="w-20 h-10 ml-2 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="v" stroke={c.spark} strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
