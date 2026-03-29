import { useDashboard } from '../context/DashboardContext';
import { CLIENT_OPTIONS, CHANNEL_CONFIG } from '../config/platformConfig';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { logout } = useAuth();
  const {
    clientSlug,
    setClientSlug,
    dateRange,
    setDateRange,
    selectedChannels,
    toggleChannel,
  } = useDashboard();

  const client = CLIENT_OPTIONS.find(c => c.id === clientSlug) || CLIENT_OPTIONS[0];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left: client + date */}
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{client.name}</h2>
              <p className="text-xs text-gray-500">{client.vertical}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-2 py-1 text-xs border border-gray-300 rounded"
              />
              <span className="text-gray-400 text-xs">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Right: channel filters + logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Object.values(CHANNEL_CONFIG).map(ch => (
                <button
                  key={ch.id}
                  onClick={() => toggleChannel(ch.id)}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                    selectedChannels.includes(ch.id)
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                  style={selectedChannels.includes(ch.id) ? { backgroundColor: ch.color } : {}}
                >
                  {ch.name}
                </button>
              ))}
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
