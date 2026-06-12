import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const getColor = (score) => {
  if (score >= 0.7) return '#EF4444';
  if (score >= 0.5) return '#F59E0B';
  return '#22C55E';
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, score } = payload[0].payload;
  return (
    <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', fontFamily: 'monospace', fontSize: '11px' }}>
      <p style={{ color: '#F1F5F9', fontWeight: 'bold', marginBottom: '3px' }}>{name}</p>
      <p style={{ color: getColor(score) }}>DWPI: <strong>{score.toFixed(2)}</strong></p>
      <p style={{ color: '#64748B' }}>{score >= 0.7 ? 'CRITICAL' : score >= 0.5 ? 'HIGH' : 'LOW'} stress</p>
    </div>
  );
};

export default function DWPIScoreCard({ wards }) {
  const data = [...wards]
    .sort((a, b) => b.dwpi_score - a.dwpi_score)
    .map(w => ({ name: w.name.split(' ')[0], score: w.dwpi_score }));

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/40">
      <div className="flex items-center gap-2 mb-0.5">
        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
        <h2 className="text-xs font-bold text-slate-100 uppercase tracking-widest">DWPI Ward Index</h2>
      </div>
      <p className="text-slate-600 text-xs mb-3">Ward stress ranking — sorted by severity</p>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 1]} tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine y={0.7} stroke="#EF444440" strokeDasharray="4 2"
            label={{ value: 'CRIT', fill: '#EF4444', fontSize: 8, position: 'insideTopRight' }} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={26}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getColor(entry.score)} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex gap-4 mt-2 justify-center">
        <span className="text-xs text-red-400 font-mono">● Critical ≥0.7</span>
        <span className="text-xs text-amber-400 font-mono">● High ≥0.5</span>
        <span className="text-xs text-green-400 font-mono">● Low &lt;0.5</span>
      </div>
    </div>
  );
}
