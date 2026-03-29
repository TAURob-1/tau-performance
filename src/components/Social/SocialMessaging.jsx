import SectionHeader from '../shared/SectionHeader';
import GradeBadge from '../shared/GradeBadge';
import { MESSAGING_THEMES } from '../../data/auditData';

export default function SocialMessaging() {
  const activeThemes = MESSAGING_THEMES.filter(t => t.status !== 'NOT PRESENT');
  const absentThemes = MESSAGING_THEMES.filter(t => t.status === 'NOT PRESENT');

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <SectionHeader title="Messaging Theme Performance" sub="Which angles are working, which are absent. TAU: 'soft search / no credit impact' should be #1 for bad credit audience." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeThemes.map(t => {
          const borderColor = t.grade.startsWith('A') ? 'border-l-green-500' : t.grade.startsWith('B') ? 'border-l-blue-500' : 'border-l-amber-500';
          return (
            <div key={t.theme} className={`bg-white border border-gray-200 rounded-lg p-4 border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">{t.theme}</span>
                <GradeBadge grade={t.grade} />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>{t.ads} ads</span>
                <span>{t.spend}</span>
                <span>CPA: {t.cpa}</span>
              </div>
              <div className="mt-1.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  t.status.includes('top') ? 'bg-green-100 text-green-700' :
                  t.status.includes('under') ? 'bg-amber-100 text-amber-700' :
                  t.status.includes('mixed') ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{t.status}</span>
              </div>
            </div>
          );
        })}
        {absentThemes.map(t => (
          <div key={t.theme} className="border-2 border-dashed border-red-300 rounded-lg p-4 bg-red-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-red-700">{t.theme}</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">NOT PRESENT</span>
            </div>
            <p className="text-xs text-red-600">Opportunity: test this messaging angle to expand creative diversity and reduce fatigue risk.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
