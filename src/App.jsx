import { useState, useMemo } from 'react';
import Header from './components/Header';
import Overview from './components/Dashboard/Overview';
import SearchDashboard from './components/Search/SearchDashboard';
import SocialDashboard from './components/Social/SocialDashboard';
import PricingDashboard from './components/Pricing/PricingDashboard';
import GoogleMetaAudit from './components/Audit/GoogleMetaAudit';
import SEOIntelligence from './components/SEO/SEOIntelligence';
import ChatPanel from './components/Chat/ChatPanel';
import { useDashboard } from './context/DashboardContext';
import { useAuth } from './context/AuthContext';
import { CLIENT_OPTIONS } from './config/platformConfig';

// Base pages available to all clients
const BASE_PAGES = [
  { key: 'overview', label: 'Overview', fullLabel: 'Overview' },
  { key: 'search', label: 'Search', fullLabel: 'Search Performance' },
  { key: 'social', label: 'Social', fullLabel: 'Social Performance' },
  { key: 'chat', label: 'Chat', fullLabel: 'AI Chat' },
];

// Client-specific pages (CLIENT_PAGES pattern from TAU-Reporting)
const CLIENT_PAGES = {
  '247cf': [
    { key: 'pricing', label: 'Pricing', fullLabel: 'Pricing & Elasticity', after: 'social' },
    { key: 'audit', label: 'Audit', fullLabel: 'Performance Audit', after: 'pricing' },
    { key: 'seo', label: 'SEO', fullLabel: 'SEO Intelligence', after: 'audit' },
  ],
};

function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  const { clientSlug } = useDashboard();
  const { user } = useAuth();

  // Build page list: base + client-specific tabs
  const pages = useMemo(() => {
    const result = [...BASE_PAGES];
    const clientExtras = CLIENT_PAGES[clientSlug] || [];
    for (const extra of clientExtras) {
      const insertIdx = extra.after
        ? result.findIndex(p => p.key === extra.after) + 1
        : result.length - 1;
      result.splice(insertIdx, 0, extra);
    }
    return result;
  }, [clientSlug]);

  // If current page is removed (client switch), reset to overview
  if (!pages.find(p => p.key === currentPage)) {
    setCurrentPage('overview');
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <Overview />;
      case 'search': return <SearchDashboard />;
      case 'social': return <SocialDashboard />;
      case 'pricing': return <PricingDashboard />;
      case 'audit': return <GoogleMetaAudit />;
      case 'seo': return <SEOIntelligence />;
      case 'chat': return <ChatPanel />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with client/date/channel controls */}
      <Header />

      {/* Tab navigation */}
      <nav className="bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {pages.map((page) => (
              <button
                key={page.key}
                onClick={() => setCurrentPage(page.key)}
                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                  currentPage === page.key
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="hidden md:inline">{page.fullLabel}</span>
                <span className="md:hidden">{page.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
