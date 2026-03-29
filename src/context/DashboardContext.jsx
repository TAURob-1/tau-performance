import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const DashboardContext = createContext(null);

function getDefaultDateRange() {
  return { start: '2026-01-01', end: '2026-03-06' };
}

function getDefaultComparison() {
  return { start: '2025-10-01', end: '2025-12-31' };
}

export function DashboardProvider({ children }) {
  const [clientSlug, setClientSlug] = useState('247cf');
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [comparisonPeriod, setComparisonPeriod] = useState(getDefaultComparison);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(['google_ads', 'meta_ads']);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const toggleChannel = useCallback((channelId) => {
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(c => c !== channelId)
        : [...prev, channelId]
    );
  }, []);

  const value = useMemo(() => ({
    clientSlug,
    setClientSlug,
    dateRange,
    setDateRange,
    comparisonPeriod,
    setComparisonPeriod,
    showComparison,
    setShowComparison,
    selectedChannels,
    setSelectedChannels,
    toggleChannel,
    selectedCampaigns,
    setSelectedCampaigns,
  }), [
    clientSlug, dateRange, comparisonPeriod, showComparison,
    selectedChannels, toggleChannel, selectedCampaigns,
  ]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
}
