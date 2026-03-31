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
export function usePerformanceData(options = {}) {
  const { crmAvgOrderValue } = options;
  const [data, setData] = useState([]);
  const [crmRaw, setCrmRaw] = useState(null);
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
          fetchData('/api/data/247cf/crm'),
          fetchData('/api/data/247cf/meta-adsets'),
          fetchData('/api/data/247cf/meta-ads'),
          fetchData('/api/data/247cf/meta-age'),
          fetchData('/api/data/247cf/meta-gender'),
          fetchData('/api/data/247cf/meta-placement'),
        ]);
        const val = (r) => r.status === 'fulfilled' ? r.value : [];
        if (!cancelled) {
          setData(val(results[0]));
          setCrmRaw(results[1].status === 'fulfilled' ? results[1].value : null);
          setMetaAdsets(val(results[2]));
          setMetaAds(val(results[3]));
          setMetaAge(val(results[4]));
          setMetaGender(val(results[5]));
          setMetaPlacement(val(results[6]));
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
  const rollupData = useMemo(() => getReportingRollupRecords(data), [data]);
  const rollupSearchData = useMemo(() => rollupData.filter(r => r.channel === 'Google Ads'), [rollupData]);
  const rollupSocialData = useMemo(() => rollupData.filter(r => r.channel === 'Meta'), [rollupData]);

  const activeData = useMemo(() => data.filter(r =>
    r.status === 'Enabled' || r.status === 'active'
  ), [data]);

  const metrics = useMemo(() => computeMetrics(data), [data]);
  const searchMetrics = useMemo(() => computeMetrics(searchData), [searchData]);
  const socialMetrics = useMemo(() => computeMetrics(socialData), [socialData]);
  const crmData = useMemo(
    () => loadCRMData(rollupData, crmRaw, crmAvgOrderValue),
    [rollupData, crmRaw, crmAvgOrderValue]
  );

  return {
    data, loading, error,
    searchData, socialData, activeData,
    rollupData, rollupSearchData, rollupSocialData,
    crmRaw, crmData,
    metaAdsets, metaAds, metaAge, metaGender, metaPlacement,
    metrics, searchMetrics, socialMetrics,
  };
}

export function getReportingRollupRecords(records) {
  return records.filter((record) => {
    if (record.channel === 'Google Ads') return !record.ad_set && !record.ad;
    if (record.channel === 'Meta') return Boolean(record.ad_set) && !record.ad;
    return false;
  });
}

function toNumber(value) {
  return Number(value || 0);
}

function normalizeCampaignName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getCampaignDisplayName(record) {
  return record.campaign || record.ad_set || record.ad || 'Unnamed';
}

function mapCRMSourceToChannel(source) {
  const normalized = String(source || '').toLowerCase();
  if (normalized.includes('google')) return 'google';
  if (normalized.includes('bing')) return 'bing';
  if (
    normalized === 'fb' ||
    normalized.includes('facebook') ||
    normalized.includes('instagram') ||
    normalized.includes('threads') ||
    normalized === 'an'
  ) return 'meta';
  return 'other';
}

function mapAdChannelToCRMChannel(channel) {
  if (channel === 'Google Ads') return 'google';
  if (channel === 'Meta') return 'meta';
  return 'other';
}

function getMonthLabel(month) {
  const [year, monthIndex] = String(month || '').split('-').map(Number);
  if (!year || !monthIndex) return month;
  return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' })
    .format(new Date(Date.UTC(year, monthIndex - 1, 1)));
}

function getMonthDateRange(month) {
  const [year, monthIndex] = String(month || '').split('-').map(Number);
  if (!year || !monthIndex) return null;
  return {
    start: new Date(Date.UTC(year, monthIndex - 1, 1)),
    end: new Date(Date.UTC(year, monthIndex, 0)),
  };
}

function countInclusiveDays(start, end) {
  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function getMonthOverlapRatio(record, month) {
  const monthRange = getMonthDateRange(month);
  if (!monthRange) return 0;
  const start = new Date(`${record.date_start}T00:00:00Z`);
  const end = new Date(`${record.date_end}T00:00:00Z`);
  const overlapStart = start > monthRange.start ? start : monthRange.start;
  const overlapEnd = end < monthRange.end ? end : monthRange.end;
  if (overlapEnd < overlapStart) return 0;
  const totalDays = countInclusiveDays(start, end);
  const overlapDays = countInclusiveDays(overlapStart, overlapEnd);
  return totalDays > 0 ? overlapDays / totalDays : 0;
}

function getCampaignMatchScore(left, right) {
  if (!left || !right) return -1;
  if (left === right) return 100000 + left.length;
  if (left.includes(right) || right.includes(left)) {
    const shorter = Math.min(left.length, right.length);
    const longer = Math.max(left.length, right.length);
    return Math.round((shorter / longer) * 1000);
  }
  return -1;
}

function findBestCampaignMatch(name, candidates) {
  const normalizedName = normalizeCampaignName(name);
  if (!normalizedName) return null;

  const matches = candidates
    .map((candidate) => ({
      ...candidate,
      score: getCampaignMatchScore(normalizedName, candidate.normalizedName),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || right.febSpend - left.febSpend);

  if (!matches.length) return null;
  const best = matches[0];
  return {
    ...best,
    matchType: best.normalizedName === normalizedName ? 'exact' : 'partial',
  };
}

export function loadCRMData(records, crmSource, avgOrderValueOverride) {
  if (!crmSource?.by_month || !Array.isArray(records)) {
    return {
      monthly: [],
      totals: null,
      campaigns: [],
      matchedCampaigns: [],
      coverage: null,
      note: '',
      reliablePeriod: '',
      avgOrderValue: 0,
      defaultAvgOrderValue: 0,
    };
  }

  const reliablePeriod = crmSource.reliable_period;
  const avgOrderValue = Number.isFinite(avgOrderValueOverride)
    ? avgOrderValueOverride
    : toNumber(crmSource.avg_order_value_gbp);
  const monthTotals = crmSource.by_month[reliablePeriod] || { applications: 0, deals: 0 };

  const monthly = Object.entries(crmSource.by_month)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([month, values]) => {
      const applications = toNumber(values.applications);
      const deals = toNumber(values.deals);
      return {
        month,
        label: getMonthLabel(month),
        applications,
        deals,
        dealRate: applications > 0 ? (deals / applications) * 100 : 0,
        revenue: deals * avgOrderValue,
        reliable: month === reliablePeriod,
      };
    });

  const adRollups = records.reduce((acc, record) => {
    const channel = mapAdChannelToCRMChannel(record.channel);
    const name = getCampaignDisplayName(record);
    const normalizedName = normalizeCampaignName(name);
    if (channel === 'other' || !normalizedName) return acc;

    const ratio = getMonthOverlapRatio(record, reliablePeriod);
    const key = `${channel}::${normalizedName}`;
    if (!acc[key]) {
      acc[key] = {
        channel,
        name,
        normalizedName,
        febSpend: 0,
        febApplications: 0,
      };
    }

    acc[key].febSpend += toNumber(record.cost_gbp) * ratio;
    acc[key].febApplications += toNumber(record.orders) * ratio;
    return acc;
  }, {});

  const adCandidatesByChannel = Object.values(adRollups).reduce((acc, candidate) => {
    if (!acc[candidate.channel]) acc[candidate.channel] = [];
    acc[candidate.channel].push(candidate);
    return acc;
  }, {});

  const crmCampaignGroups = (crmSource.by_campaign || [])
    .filter((row) => row.month === reliablePeriod)
    .reduce((acc, row) => {
      const channel = mapCRMSourceToChannel(row.utm_source);
      const utmCampaign = row.utm_campaign || 'Unassigned';
      const key = `${channel}::${utmCampaign}`;
      if (!acc[key]) {
        acc[key] = {
          month: row.month,
          utmCampaign,
          sourceChannel: channel,
          sources: new Set(),
          applications: 0,
          deals: 0,
          reliable: Boolean(row.reliable),
        };
      }

      acc[key].sources.add(row.utm_source);
      acc[key].applications += toNumber(row.applications);
      acc[key].deals += toNumber(row.deals);
      acc[key].reliable = acc[key].reliable && Boolean(row.reliable);
      return acc;
    }, {});

  const campaigns = Object.values(crmCampaignGroups)
    .map((group) => {
      const match = findBestCampaignMatch(group.utmCampaign, adCandidatesByChannel[group.sourceChannel] || []);
      const applications = group.applications;
      const deals = group.deals;
      const spend = match ? match.febSpend : null;
      const platformApplications = match ? match.febApplications : null;
      const revenue = deals * avgOrderValue;
      const cpa = spend != null && platformApplications > 0 ? spend / platformApplications : null;
      const cpd = spend != null && deals > 0 ? spend / deals : null;
      const dealRoi = spend != null && spend > 0 ? revenue / spend : null;

      return {
        month: group.month,
        channel: group.sourceChannel,
        channelLabel: group.sourceChannel === 'meta'
          ? 'Meta'
          : group.sourceChannel === 'google'
            ? 'Google'
            : group.sourceChannel === 'bing'
              ? 'Bing'
              : 'Other',
        campaign: group.utmCampaign,
        applications,
        platformApplications,
        deals,
        reliable: group.reliable,
        dealRate: applications > 0 ? (deals / applications) * 100 : 0,
        spend,
        cpa,
        cpd,
        revenue,
        dealRoi,
        sources: [...group.sources].sort(),
        matchedCampaign: match?.name || null,
        matchType: match?.matchType || null,
        hasSpendMatch: Boolean(match),
      };
    })
    .sort((left, right) => right.deals - left.deals || left.campaign.localeCompare(right.campaign));

  const matchedCampaigns = campaigns
    .filter((campaign) => campaign.hasSpendMatch && campaign.spend > 0)
    .sort((left, right) => {
      if (right.dealRoi !== left.dealRoi) return (right.dealRoi || 0) - (left.dealRoi || 0);
      return right.deals - left.deals;
    });

  const totalFebSpend = records.reduce(
    (sum, record) => sum + (toNumber(record.cost_gbp) * getMonthOverlapRatio(record, reliablePeriod)),
    0
  );

  return {
    note: crmSource.note || '',
    reliablePeriod,
    avgOrderValue,
    defaultAvgOrderValue: toNumber(crmSource.avg_order_value_gbp),
    monthly,
    totals: {
      label: getMonthLabel(reliablePeriod),
      applications: toNumber(monthTotals.applications),
      deals: toNumber(monthTotals.deals),
      spend: totalFebSpend,
      dealRate: toNumber(monthTotals.applications) > 0
        ? (toNumber(monthTotals.deals) / toNumber(monthTotals.applications)) * 100
        : 0,
      revenue: toNumber(monthTotals.deals) * avgOrderValue,
      costPerDeal: toNumber(monthTotals.deals) > 0 ? totalFebSpend / toNumber(monthTotals.deals) : 0,
      dealRoi: totalFebSpend > 0 ? (toNumber(monthTotals.deals) * avgOrderValue) / totalFebSpend : 0,
      reliable: true,
    },
    campaigns,
    matchedCampaigns,
    coverage: {
      totalCampaigns: campaigns.length,
      matchedCampaigns: matchedCampaigns.length,
      matchedDeals: matchedCampaigns.reduce((sum, campaign) => sum + campaign.deals, 0),
      matchedApplications: matchedCampaigns.reduce((sum, campaign) => sum + campaign.applications, 0),
      totalDeals: toNumber(monthTotals.deals),
      totalApplications: toNumber(monthTotals.applications),
    },
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
  currencyFull: (v) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v),
  number: (v) => v >= 1000000 ? `${(v/1000000).toFixed(2)}M` : v >= 1000 ? `${(v/1000).toFixed(1)}K` : v.toLocaleString('en-GB'),
  numberFull: (v) => Number(v || 0).toLocaleString('en-GB'),
  pct: (v) => `${v.toFixed(2)}%`,
  pctCompact: (v) => `${v.toFixed(1)}%`,
  cpa: (v) => `£${v.toFixed(2)}`,
  roi: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`,
  roas: (v) => `${v.toFixed(2)}x`,
};
