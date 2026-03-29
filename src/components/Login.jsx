import { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
        return;
      }
      onLoginSuccess(data.user);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a365d] to-[#2b6cb0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 text-white text-center" style={{ backgroundColor: '#1a365d' }}>
            <h1 className="text-2xl font-bold">TAU Performance</h1>
            <p className="text-sm opacity-80 mt-1">Performance Marketing Dashboard</p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a365d] hover:bg-[#2b6cb0] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <details className="group">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 text-center select-none">
                  Demo credentials
                </summary>
                <div className="mt-3 space-y-1 text-center">
                  {[['TAU', 'Demo2026'], ['247CF', '247CF2026']].map(([u, p]) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => { setUsername(u); setPassword(p); setError(''); }}
                      className="inline-block mx-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono text-gray-600 transition-colors"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
        <p className="text-center text-white/60 text-xs mt-4">Powered by TAU</p>
      </div>
    </div>
  );
}
