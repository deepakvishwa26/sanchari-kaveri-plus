import { useState, useEffect } from 'react';
import { AlertOctagon, Activity, Truck, Droplets, RefreshCw } from 'lucide-react';
import BangaloreMap     from '../components/BangaloreMap';
import BookingList      from '../components/BookingList';
import StatBadge        from '../components/StatBadge';
import {
  getBookings, getWards, dispatchTanker, resetDemo,
  MOCK_WARDS, MOCK_BOOKINGS,
} from '../api/index';

export default function PrimeDashboard() {
  const [wards,       setWards]       = useState(MOCK_WARDS);
  const [bookings,    setBookings]    = useState(MOCK_BOOKINGS);
  const [aiText,      setAiText]      = useState('');
  const [resetting,   setResetting]   = useState(false);
  const [dispatching, setDispatching] = useState(null);
  const [lastUpdate,  setLastUpdate]  = useState(new Date());

  // ── Fetch wards once; poll bookings every 5s ────────────────────────────────
  useEffect(() => {
    getWards().then(setWards).catch(() => setWards(MOCK_WARDS));

    const fetchBookings = () => {
      getBookings()
        .then(data => { setBookings(data); setLastUpdate(new Date()); })
        .catch(() => { /* API not ready — silently keep mock data */ });
    };

    fetchBookings();
    const id = setInterval(fetchBookings, 5000);
    return () => clearInterval(id);
  }, []);

  // ── Dispatch ────────────────────────────────────────────────────────────────
  const handleDispatch = async (bookingId) => {
    setDispatching(bookingId);
    try {
      const result = await dispatchTanker(bookingId);
      setAiText(
        result.ai_reasoning ||
        'RECOMMENDATION: T-02 | REASON: Nearest tanker (4.2 km), trust score 0.91. Optimal route via Sarjapur Road. ETA 18 min. | PRIORITY: HIGH'
      );
      getBookings().then(setBookings).catch(() => {});
    } catch {
      // Fallback so demo still works without backend
      setAiText('RECOMMENDATION: T-02 | REASON: Highest trust score 0.91. Closest to Whitefield Connect Centre. | PRIORITY: HIGH');
    } finally {
      setDispatching(null);
    }
  };

  // ── Demo reset ──────────────────────────────────────────────────────────────
  const handleReset = async () => {
    setResetting(true);
    try {
      await resetDemo();
      const [w, b] = await Promise.all([getWards(), getBookings()]);
      setWards(w); setBookings(b); setAiText('');
    } catch {
      setWards(MOCK_WARDS); setBookings(MOCK_BOOKINGS); setAiText('');
    } finally {
      setResetting(false);
    }
  };

  // ── Derived stats ───────────────────────────────────────────────────────────
  const pendingCount  = bookings.filter(b => b.status === 'PENDING').length;
  const criticalWards = wards.filter(w => w.dwpi_score >= 0.7).length;
  const inTransit     = bookings.filter(b => b.status === 'IN_TRANSIT').length;

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">

      {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
      <header className="bg-slate-900 border-b border-slate-800 px-5 py-2.5 flex items-center justify-between flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Droplets size={18} className="text-teal-400" />
          <div>
            <p className="font-mono font-bold text-teal-400 tracking-[0.2em] text-sm leading-none">KAVERI PRIME</p>
            <p className="text-slate-600 text-xs font-mono mt-0.5">BWSSB Command Dashboard · Bangalore</p>
          </div>
        </div>

        {/* Stats + Controls */}
        <div className="flex items-center gap-2.5">
          <StatBadge label="Pending"        value={pendingCount}  valueColor="text-red-400"   icon={<AlertOctagon size={11} />} />
          <StatBadge label="Critical Wards" value={criticalWards} valueColor="text-amber-400" icon={<Activity size={11} />} />
          <StatBadge label="In Transit"     value={inTransit}     valueColor="text-blue-400"  icon={<Truck size={11} />} />

          <div className="h-5 w-px bg-slate-800 mx-1"></div>

          <span className="font-mono text-xs text-slate-700 hidden sm:block">
            {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-40"
          >
            <RefreshCw size={10} className={resetting ? 'animate-spin' : ''} />
            {resetting ? 'Resetting…' : 'Demo Reset'}
          </button>
        </div>
      </header>

      {/* ══ MAIN ════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 gap-3 p-3 overflow-hidden">

        {/* LEFT: Map + bottom panels (future) */}
        <div className="flex flex-col gap-3 flex-1 overflow-hidden">
          {/* Map */}
          <div className="flex-1 rounded-xl overflow-hidden border border-slate-800/80" style={{ minHeight: '340px' }}>
            <BangaloreMap wards={wards} bookings={bookings} onDispatch={handleDispatch} />
          </div>

          {/* Bottom 2-column row */}
          <div className="grid grid-cols-2 gap-3" style={{ height: '250px' }}>
            <BookingList bookings={bookings} onDispatch={handleDispatch} lastUpdate={lastUpdate} />
            <div className="bg-slate-800 rounded-xl border border-slate-700/40 flex items-center justify-center">
              <p className="text-slate-700 text-xs font-mono">Surge Shield → Feature 8</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar placeholder */}
        <div className="w-72 flex flex-col gap-3 overflow-y-auto sidebar-scroll flex-shrink-0">
          <div className="bg-slate-800 rounded-xl border border-slate-700/40 p-4 flex items-center justify-center h-40">
            <p className="text-slate-700 text-xs font-mono">AI Dispatch → Feature 6</p>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700/40 p-4 flex items-center justify-center h-52">
            <p className="text-slate-700 text-xs font-mono">DWPI Chart → Feature 7</p>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700/40 p-4 flex items-center justify-center h-40">
            <p className="text-slate-700 text-xs font-mono">Emergency → Feature 9</p>
          </div>
          <p className="text-slate-800 text-xs font-mono text-center pb-2">
            Sanchari Kaveri Plus · HackArena 2.0 · Blr Zonals
          </p>
        </div>
      </div>
    </div>
  );
}
