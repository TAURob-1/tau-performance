export default function SectionHeader({ title, sub, action }) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {sub && <p className="text-xs text-gray-400 mt-0.5 max-w-2xl">{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
