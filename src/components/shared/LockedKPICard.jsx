import { Lock } from 'lucide-react';

export default function LockedKPICard({ label = 'Cost per Deal' }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
            <Lock size={12} className="text-gray-400" />
            <span>{label}</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-gray-400">—</div>
          <div className="mt-1 text-xs text-gray-500">Connect CRM data to unlock</div>
        </div>
      </div>
    </div>
  );
}
