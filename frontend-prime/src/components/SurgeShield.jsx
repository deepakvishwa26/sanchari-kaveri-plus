import { ShieldCheck, TrendingDown } from 'lucide-react';

export default function SurgeShield() {
  const rows = [
    { scenario: 'Off-Peak',        bwssb: '₹1,290', pvtA: '₹1,500', pvtB: '₹1,600', saving: '₹210',   star: false },
    { scenario: 'Peak Summer',     bwssb: '₹1,290', pvtA: '₹3,000', pvtB: '₹3,200', saving: '₹1,910', star: true  },
    { scenario: 'Peripheral Zone', bwssb: '₹1,500', pvtA: '₹2,200', pvtB: '₹2,500', saving: '₹1,000', star: false },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-4 flex flex-col h-full border border-slate-700/40 overflow-y-auto sidebar-scroll">
      <div className="flex items-center gap-2 mb-0.5">
        <ShieldCheck size={13} className="text-yellow-400" />
        <h2 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Surge Shield</h2>
        <span className="ml-auto text-xs text-slate-600">12,000L · INR</span>
      </div>
      <p className="text-slate-600 text-xs mb-3">BWSSB vs private tanker — real-time price transparency</p>

      <table className="w-full text-xs border-collapse flex-1">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-1.5 pr-2 text-slate-500 font-medium">Scenario</th>
            <th className="text-right px-1 text-teal-400 font-bold">BWSSB</th>
            <th className="text-right px-1 text-slate-600 font-medium">Pvt A</th>
            <th className="text-right px-1 text-slate-600 font-medium">Pvt B</th>
            <th className="text-right pl-2 text-green-400 font-bold">Save</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-b border-slate-700/30 ${r.star ? 'bg-green-950/15' : ''}`}>
              <td className={`py-2 pr-2 font-medium ${r.star ? 'text-white' : 'text-slate-400'}`}>
                {r.star && <span className="text-yellow-400 mr-1">★</span>}
                {r.scenario}
              </td>
              <td className="text-right px-1 text-teal-400 font-bold font-mono">{r.bwssb}</td>
              <td className="text-right px-1 text-slate-600 font-mono">{r.pvtA}</td>
              <td className="text-right px-1 text-slate-600 font-mono">{r.pvtB}</td>
              <td className={`text-right pl-2 font-bold font-mono ${r.star ? 'text-green-400 text-sm' : 'text-green-600'}`}>
                {r.saving}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 bg-green-950/40 border border-green-900/50 rounded-lg p-2 flex items-center gap-2">
        <TrendingDown size={13} className="text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs font-bold">
          Peak summer: citizens save <span className="text-green-300">₹1,910</span> per booking
        </p>
      </div>
    </div>
  );
}
