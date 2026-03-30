// Data loader for 247CF consolidated performance data
import { useState, useEffect, useMemo } from 'react';
import { computeDealMetrics } from '../data/funnelAssumptions';

// Fetch consolidated data from API
async function fetchData(endpoint) {
  const response = await fetch(endpoint, { credentials: 'include' });
  if (response.status === 401) {
    // Session expired (e.g. server restart) — reload to trigger login
    window.location.reload();
    return [];
  }
  if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
  return response.json();
}

// Main hook — fetches consolidated data once, provides filtered views
export function usePerformanceData() {
  const [data, setData] = useState([]);
  const [metaAdsets, setMetaAdsets] = useState([]);
  const [metaAds, setMetaAds] = useState([]);
  const [metaAge, setMetaAge] = useState([]);
  const [metaGender, setMetaGender] = useState([]);
  const [metaPlacement, setMetaPlacement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const results = await Promise.allSettled([
          fetchData('/api/data/247cf'),
          fetchData('/api/data/247cf/meta-adsets'),
          fetchData('/api/data/247cf/meta-ads'),
          fetchData('/api/data/247cf/meta-age'),
          fetchData('/api/data/247cf/meta-gender'),
          fetchData('/api/data/247cf/meta-placement'),
        ]);
        const val = (r) => r.status === 'fulfilled' ? r.value : [];
        if (!cancelled) {
          setData(val(results[0]));
          setMetaAdsets(val(results[1]));
          setMetaAds(val(results[2]));
          setMetaAge(val(results[3]));
          setMetaGender(val(results[4]));
          setMetaPlacement(val(results[5]));
          // Surface error only if primary dataset failed
          if (results[0].status === 'rejected') {
            throw results[0].reason;
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const searchData = useMemo(() => data.filter(r => r.channel === 'Google Ads'), [data]);
  const socialData = useMemo(() => data.filter(r => r.channel === 'Meta'), [data]);

  const activeData = useMemo(() => data.filter(r =>
    r.status === 'Enabled' || r.status === 'active'
  ), [data]);

  const metrics = useMemo(() => computeMetrics(data), [data]);
  const searchMetrics = useMemo(() => computeMetrics(searchData), [searchData]);
  const socialMetrics = useMemo(() => computeMetrics(socialData), [socialData]);

  return {
    data, loading, error,
    searchData, socialData, activeData,
    metaAdsets, metaAds, metaAge, metaGender, metaPlacement,
    metrics, searchMetrics, socialMetrics,
  };
}

// Compute aggregate metrics from consolidated records
export function computeMetrics(records) {
  const totals = records.reduce((acc, r) => {
    acc.impressions += Number(r.impressions || 0);
    acc.clicks += Number(r.clicks || 0);
    acc.orders += Number(r.orders || 0);
    acc.cost += Number(r.cost_gbp || 0);
    acc.revenue += Number(r.revenue_gbp || 0);
    return acc;
  }, { impressions: 0, clicks: 0, orders: 0, cost: 0, revenue: 0 });

  const deal = computeDealMetrics(totals.cost, totals.orders, totals.revenue);

  return {
    ...totals,
    ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
    cpc: totals.clicks > 0 ? totals.cost / totals.clicks : 0,
    cpa: totals.orders > 0 ? totals.cost / totals.orders : 0,
    roas: totals.cost > 0 ? totals.revenue / totals.cost : 0,
    convRate: totals.clicks > 0 ? (totals.orders / totals.clicks) * 100 : 0,
    ...deal,
  };
}

// Format helpers
export const fmt = {
  currency: (v) => v >= 1000000 ? `£${(v/1000000).toFixed(2)}M` : v >= 1000 ? `£${(v/1000).toFixed(1)}K` : `£${v.toFixed(2)}`,
  number: (v) => v >= 1000000 ? `${(v/1000000).toFixed(2)}M` : v >= 1000 ? `${(v/1000).toFixed(1)}K` : v.toLocaleString('en-GB'),
  pct: (v) => `${v.toFixed(2)}%`,
  cpa: (v) => `£${v.toFixed(2)}`,
  roi: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`,
  roas: (v) => `${v.toFixed(2)}x`,
};
