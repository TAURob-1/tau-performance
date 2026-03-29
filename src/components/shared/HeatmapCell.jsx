// CPA heatmap: green for low, amber for mid, red for high
export function cpaCellClass(cpa, { low = 20, high = 40 } = {}) {
  if (cpa <= 0) return '';
  if (cpa < low) return 'bg-green-50 text-green-700';
  if (cpa < high) return 'bg-amber-50 text-amber-700';
  return 'bg-red-50 text-red-700';
}

// Percentage-based heatmap: red for high concentration, amber for medium
export function concentrationCellClass(pct, { high = 20, medium = 10 } = {}) {
  if (pct > high) return 'bg-red-50';
  if (pct > medium) return 'bg-amber-50';
  return '';
}

export default function HeatmapCell({ value, displayValue, type = 'cpa', thresholds, className = '' }) {
  const cellClass = type === 'cpa'
    ? cpaCellClass(value, thresholds)
    : concentrationCellClass(value, thresholds);

  return (
    <td className={`py-2 px-3 text-right font-medium ${cellClass} ${className}`}>
      {displayValue || value}
    </td>
  );
}
