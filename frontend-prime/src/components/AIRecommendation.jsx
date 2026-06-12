import { Bot, AlertTriangle, Minus, CheckCircle } from 'lucide-react';

const PRIORITY = {
  HIGH:   { color: 'text-red-400',   border: 'border-red-800',   bg: 'bg-red-950/60',   Icon: AlertTriangle },
  MEDIUM: { color: 'text-amber-400', border: 'border-amber-800', bg: 'bg-amber-950/60', Icon: Minus },
  LOW:    { color: 'text-green-400', border: 'border-green-800', bg: 'bg-green-950/60', Icon: CheckCircle },
};

export default function AIRecommendation({ text }) {
  const parsed = text ? {
    tanker:   text.match(/RECOMMENDATION:\s*([^|]+)/)?.[1]?.trim(),
    reason:   text.match(/REASON:\s*([^|]+)/)?.[1]?.trim(),
    priority: text.match(/PRIORITY:\s*(.+)/)?.[1]?.trim(),
  } : null;

  const pc = parsed?.priority ? (PRIORITY[parsed.priority] || PRIORITY.MEDIUM) : null;

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/40">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-violet-400"></div>
        <h2 className="text-xs font-bold text-slate-100 uppercase tracking-widest">AI Dispatch</h2>
        <span className="ml-auto text-xs text-violet-600 font-mono">Gemini</span>
      </div>

      {!parsed && (
        <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center">
          <Bot size={18} className="text-slate-700 mx-auto mb-1.5" />
          <p className="text-slate-600 text-xs">
            Click <span className="text-teal-400 font-bold">Dispatch</span> on any pending booking
          </p>
        </div>
      )}

      {parsed && (
        <div className="ai-fade-in space-y-2">
          {/* Tanker assigned */}
          <div className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2">
            <span className="text-slate-500 text-xs">Assigned Tanker</span>
            <span className="font-mono font-bold text-teal-400 text-base">{parsed.tanker}</span>
          </div>
          {/* Gemini reasoning */}
          <div className="bg-violet-950/30 border border-violet-900/50 rounded-lg p-2.5">
            <p className="text-violet-300 text-xs leading-relaxed">{parsed.reason}</p>
          </div>
          {/* Priority badge */}
          {pc && (
            <div className={`flex items-center justify-center gap-1.5 border rounded-lg py-1.5 ${pc.border} ${pc.bg}`}>
              <pc.Icon size={11} className={pc.color} />
              <span className={`text-xs font-bold font-mono ${pc.color}`}>PRIORITY: {parsed.priority}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
