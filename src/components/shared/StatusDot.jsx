const STATUS_COLORS = {
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-400',
};

export default function StatusDot({ status, label, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block ${sizeClass} rounded-full ${STATUS_COLORS[status] || STATUS_COLORS.gray}`} />
      {label && <span className="text-xs text-gray-600">{label}</span>}
    </span>
  );
}
