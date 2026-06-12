export default function StatBadge({ label, value, valueColor = 'text-teal-400', icon }) {
  return (
    <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-700/60 rounded-lg px-3 py-1.5">
      {icon && <span className="text-slate-500">{icon}</span>}
      <div>
        <p className={`font-mono font-bold text-sm leading-none ${valueColor}`}>{value}</p>
        <p className="text-slate-600 text-xs mt-0.5 leading-none">{label}</p>
      </div>
    </div>
  );
}
