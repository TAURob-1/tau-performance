export default function GradeBadge({ grade }) {
  const color = grade.startsWith('A') ? 'bg-green-100 text-green-700' :
    grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
    grade.startsWith('C') ? 'bg-amber-100 text-amber-700' :
    grade.startsWith('D') ? 'bg-orange-100 text-orange-700' :
    grade === 'F' ? 'bg-red-100 text-red-700' :
    grade === '—' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500';
  return <span className={`px-2 py-0.5 rounded text-xs font-bold ${color}`}>{grade}</span>;
}
