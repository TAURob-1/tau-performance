import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SectionHeader from '../shared/SectionHeader';
import CustomTooltip from '../shared/CustomTooltip';
import { cpaCellClass } from '../shared/HeatmapCell';
import { fmt } from '../../services/dataLoader';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function SocialDemographics({ ageData, genderData, placementData }) {
  return (
    <>
      {/* Age + Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <SectionHeader title="Age Breakdown" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="age" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tickFormatter={v => fmt.number(v)} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="results" fill="#3B82F6" name="Applications" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <table className="w-full text-xs mt-2">
            <thead><tr className="bg-gray-50"><th className="text-left py-1 px-2 text-xs font-semibold text-gray-500 uppercase">Age</th><th className="text-right py-1 px-2 text-xs font-semibold text-gray-500 uppercase">Results</th><th className="text-right py-1 px-2 text-xs font-semibold text-gray-500 uppercase">Spend</th><th className="text-right py-1 px-2 text-xs font-semibold text-gray-500 uppercase">CPA</th></tr></thead>
            <tbody>
              {ageData.map(a => (
                <tr key={a.age} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-1 px-2">{a.age}</td>
                  <td className="py-1 px-2 text-right">{fmt.number(a.results)}</td>
                  <td className="py-1 px-2 text-right">{fmt.currency(a.spend)}</td>
                  <td className={`py-1 px-2 text-right font-medium ${cpaCellClass(a.cpa)}`}>{a.cpa > 0 ? fmt.cpa(a.cpa) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <SectionHeader title="Gender Breakdown" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={genderData} dataKey="results" nameKey="gender" cx="50%" cy="50%" outerRadius={70} label={({ gender, percent }) => `${gender} ${(percent * 100).toFixed(0)}%`}>
                {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => fmt.number(v)} />
            </PieChart>
          </ResponsiveContainer>
          <table className="w-full text-xs mt-2">
            <thead><tr className="bg-gray-50"><th className="text-left py-1 px-2 text-xs font-semibold text-gray-500 uppercase">Gender</th><th className="text-right py-1 px-2 text-xs font-semibold text-gray-500 uppercase">Results</th><th className="text-right py-1 px-2 text-xs font-semibold text-gray-500 uppercase">Spend</th><th className="text-right py-1 px-2 text-xs font-semibold text-gray-500 uppercase">CPA</th></tr></thead>
            <tbody>
              {genderData.map(g => (
                <tr key={g.gender} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-1 px-2 capitalize">{g.gender}</td>
                  <td className="py-1 px-2 text-right">{fmt.number(g.results)}</td>
                  <td className="py-1 px-2 text-right">{fmt.currency(g.spend)}</td>
                  <td className={`py-1 px-2 text-right font-medium ${cpaCellClass(g.cpa)}`}>{g.cpa > 0 ? fmt.cpa(g.cpa) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Placement Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader title="Placement Breakdown" sub="Facebook Feed dominates. Audience Network at £62+ CPA — kill immediately." />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Placement</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Results</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPA</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Impressions</th>
              </tr>
            </thead>
            <tbody>
              {placementData.map(p => (
                <tr key={p.placement} className={`border-b border-gray-100 hover:bg-gray-50 ${p.cpa > 50 ? 'bg-red-50' : ''}`}>
                  <td className="py-2 px-3 text-gray-900 max-w-[250px] truncate" title={p.placement}>{p.placement}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(p.results)}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.currency(p.spend)}</td>
                  <td className={`py-2 px-3 text-right font-medium ${cpaCellClass(p.cpa)}`}>{p.cpa > 0 ? fmt.cpa(p.cpa) : '—'}</td>
                  <td className="py-2 px-3 text-right text-gray-700">{fmt.number(p.impressions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
