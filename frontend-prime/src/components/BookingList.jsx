import { Zap, RefreshCw } from 'lucide-react';

const STATUS = {
  PENDING:    { pill: 'bg-red-950 text-red-400 border border-red-800',     dot: 'bg-red-400'    },
  ASSIGNED:   { pill: 'bg-amber-950 text-amber-400 border border-amber-800', dot: 'bg-amber-400'  },
  IN_TRANSIT: { pill: 'bg-blue-950 text-blue-400 border border-blue-800',  dot: 'bg-blue-400'   },
  DELIVERED:  { pill: 'bg-green-950 text-green-400 border border-green-800', dot: 'bg-green-400' },
};

export default function BookingList({ bookings, onDispatch, lastUpdate }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 flex flex-col h-full border border-slate-700/40">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Live Bookings</h2>
          <span className="font-mono text-xs bg-teal-950 text-teal-400 border border-teal-800/60 px-2 py-0.5 rounded-full">
            {bookings.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
            LIVE
          </span>
          {lastUpdate && (
            <span className="text-xs text-slate-700 font-mono">
              {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="overflow-y-auto flex-1 space-y-1.5 sidebar-scroll">
        {bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-16 text-slate-700 text-xs gap-1">
            <RefreshCw size={13} className="animate-spin" />
            Waiting for bookings…
          </div>
        )}
        {bookings.map(b => {
          const s = STATUS[b.status] || STATUS.DELIVERED;
          return (
            <div
              key={b.id}
              className="flex items-center gap-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-700/20 rounded-lg px-3 py-2 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`}></span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{b.citizen_name}</p>
                <p className="text-slate-600 text-xs font-mono">
                  {b.ward_id?.replace('WARD_', '')} · {b.volume_liters.toLocaleString()}L
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold flex-shrink-0 ${s.pill}`}>
                {b.status}
              </span>
              {b.status === 'PENDING' && onDispatch && (
                <button
                  onClick={() => onDispatch(b.id)}
                  className="flex items-center gap-1 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white text-xs px-2.5 py-1 rounded-lg font-bold transition-all duration-150 flex-shrink-0"
                >
                  <Zap size={10} />
                  Dispatch
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
