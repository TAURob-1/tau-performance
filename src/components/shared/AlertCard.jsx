import { AlertCircle, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: XCircle, iconColor: 'text-red-500' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertTriangle, iconColor: 'text-amber-500' },
  success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: CheckCircle, iconColor: 'text-green-500' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Info, iconColor: 'text-blue-500' },
};

export default function AlertCard({ title, text, severity = 'info', icon: CustomIcon }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;
  const Icon = CustomIcon || config.icon;

  return (
    <div className={`p-4 rounded-lg border ${config.bg} ${config.border} ${config.text}`}>
      <div className="flex gap-3">
        <Icon size={18} className={`${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="min-w-0">
          <div className="text-xs font-semibold mb-1">{title}</div>
          <div className="text-sm opacity-80">{text}</div>
        </div>
      </div>
    </div>
  );
}
