import { fmt } from '../../services/dataLoader';
import SectionHeader from '../shared/SectionHeader';
import { cpaCellClass } from '../shared/HeatmapCell';
import { BUDGET_LIMITED_CAMPAIGNS } from '../../data/auditData';
import { INTENT_COLORS } from './SearchIntentAnalysis';

export default function SearchCampaignTable({ campaigns, sortKey, sortDir, onSort }) {
  const SortHeader = ({ k, children }) => (
    <th onClick={() => onSort(k)} className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none bg-gray-50">
      {children} {sortKey === k ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <SectionHeader title={`All Google Ads Campaigns (${campaigns.length})`} sub="Click column headers to sort. Campaigns classified by intent tier." />
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0">
            <tr className="bg-gray-50">
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Campaign</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Intent</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Type</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
              <SortHeader k="cost">Spend</SortHeader>
              <SortHeader k="impressions">Impr.</SortHeader>
              <SortHeader k="clicks">Clicks</SortHeader>
              <SortHeader k="orders">Apps</SortHeader>
              <SortHeader k="cpa">CPA</SortHeader>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => {
              const isBudgetLimited = BUDGET_LIMITED_CAMPAIGNS.some(b => b.campaign === c.campaign);
              const isPaused = c.status !== 'Enabled';
              return (
                <tr key={c.campaign} className={`border-b border-gray-100 hover:bg-gray-50 ${isBudgetLimited ? 'border-l-4 border-l-amber-400' : ''} ${isPaused ? 'opacity-50' : ''}`}>
                  <td className="py-2 px-3 text-gray-900 max-w-[200px] truncate" title={c.campaign}>{c.campaign}</td>
                  <td className="py-2 px-3">
                    <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: INTENT_COLORS[c.intent] }} />
                    <span className="text-xs text-gray-600">{c.intent}</span>
                  </td>
                  <td className="py-2 px-3 text-gray-600 text-xs">{c.campaign_type}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.status === 'Enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                  </td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.currency(c.cost)}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(c.impressions)}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(c.clicks)}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(c.orders)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${cpaCellClass(c.cpa)}`}>{c.cpa > 0 ? fmt.cpa(c.cpa) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
