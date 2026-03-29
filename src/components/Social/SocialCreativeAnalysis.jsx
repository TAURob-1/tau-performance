import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Image, Video, Smartphone, LayoutGrid, Globe, Eye } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';
import CustomTooltip from '../shared/CustomTooltip';
import GradeBadge from '../shared/GradeBadge';
import { cpaCellClass, concentrationCellClass } from '../shared/HeatmapCell';
import { fmt } from '../../services/dataLoader';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const FORMAT_ICONS = { 'Feed': Image, 'Reels': Video, 'Stories': Smartphone, 'Video': Video, 'Marketplace': LayoutGrid, 'Audience Network': Globe, 'Explore/Search': Eye };

export default function SocialCreativeAnalysis({ formatPerf, creativeConcentration }) {
  return (
    <>
      {/* Creative Format Performance */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Creative Format Performance" sub="Dynamic carousel dominates (A- grade). Video weak (D grade). Reels-native absent (F). Stories absent (F)." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={formatPerf} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={v => fmt.currency(v)} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis type="category" dataKey="format" width={120} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="spend" name="Spend" radius={[0, 4, 4, 0]}>
                {formatPerf.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Format</th>
                  <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">% Spend</th>
                  <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                  <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Results</th>
                  <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPA</th>
                </tr>
              </thead>
              <tbody>
                {formatPerf.map(f => {
                  const Icon = FORMAT_ICONS[f.format] || Image;
                  const grade = f.cpa > 0 && f.cpa < 18 ? 'A-' : f.cpa > 0 && f.cpa < 25 ? 'B' : f.cpa > 0 && f.cpa < 40 ? 'C' : f.cpa > 0 ? 'D' : '—';
                  return (
                    <tr key={f.format} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 px-2 font-medium text-gray-900">
                        <span className="inline-flex items-center gap-1.5">
                          <Icon size={13} className="text-gray-400" />
                          {f.format}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-center"><GradeBadge grade={grade} /></td>
                      <td className="py-1.5 px-2 text-right text-gray-600">{f.pct.toFixed(1)}%</td>
                      <td className="py-1.5 px-2 text-right text-gray-700">{fmt.currency(f.spend)}</td>
                      <td className="py-1.5 px-2 text-right text-gray-700">{fmt.number(f.results)}</td>
                      <td className={`py-1.5 px-2 text-right font-medium ${cpaCellClass(f.cpa)}`}>{f.cpa > 0 ? fmt.cpa(f.cpa) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Missing formats as red ABSENT cards */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border-2 border-dashed border-red-300 bg-red-50">
            <div className="flex items-center gap-2 mb-1">
              <Video size={16} className="text-red-500" />
              <span className="text-sm font-semibold text-red-700">Reels-Native Video</span>
              <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">ABSENT</span>
            </div>
            <p className="text-xs text-red-600">Reels is Meta's highest growth placement with lowest CPMs. No Reels-native (9:16 vertical) creative exists. Build Reels programme urgently.</p>
          </div>
          <div className="p-3 rounded-lg border-2 border-dashed border-red-300 bg-red-50">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={16} className="text-red-500" />
              <span className="text-sm font-semibold text-red-700">Stories-Specific Creative</span>
              <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">ABSENT</span>
            </div>
            <p className="text-xs text-red-600">No Stories-optimised creative (15s, full-screen). Stories placements are getting feed creative auto-cropped — sub-optimal.</p>
          </div>
        </div>
      </div>

      {/* Creative Concentration Risk */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Creative Concentration & Fatigue Risk" sub="One carousel ad from Jul 2025 = ~30% of total spend (£117K). High single-asset dependency." />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creative</th>
                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">% of Spend</th>
                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Results</th>
                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPA</th>
                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quality</th>
              </tr>
            </thead>
            <tbody>
              {creativeConcentration.map((a, i) => (
                <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 ${concentrationCellClass(a.pct)}`}>
                  <td className="py-1.5 px-2 text-gray-900 max-w-[250px] truncate" title={a.fullName}>{a.name}</td>
                  <td className="py-1.5 px-2 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${a.pct > 20 ? 'bg-red-100 text-red-700' : a.pct > 10 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                      {a.pct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{fmt.currency(a.spend)}</td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{fmt.number(a.results)}</td>
                  <td className={`py-1.5 px-2 text-right font-medium ${cpaCellClass(a.cpa)}`}>{a.cpa > 0 ? fmt.cpa(a.cpa) : '—'}</td>
                  <td className={`py-1.5 px-2 text-right text-gray-700 ${a.frequency > 5 ? 'text-amber-600 font-medium' : ''}`}>{a.frequency > 0 ? a.frequency.toFixed(1) : '—'}</td>
                  <td className="py-1.5 px-2 text-gray-600">{a.quality && a.quality !== '-' ? a.quality : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-700 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
          <span><strong>234 ads with zero spend</strong> and 67 inactive campaigns should be archived to reduce account clutter.</span>
        </div>
      </div>
    </>
  );
}
