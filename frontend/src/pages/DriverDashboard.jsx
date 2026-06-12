import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  MapPin,
  Clock,
  Truck,
  AlertTriangle,
  Droplets,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { getBookings, MOCK_BOOKINGS, MOCK_DRIVER } from '../api/index';

const PRIORITY_BADGE = {
  CRITICAL: { label: 'PRIORITY', bg: 'bg-red-500/15', text: 'text-red-400' },
  HIGH: { label: 'URGENT', bg: 'bg-orange-500/15', text: 'text-orange-400' },
  NEXT: { label: 'NEXT', bg: 'bg-amber-500/15', text: 'text-amber-400' },
  QUEUED: { label: 'QUEUED', bg: 'bg-stone-500/15', text: 'text-stone-500' },
};

function getPriorityKey(index, dwpi) {
  if (index === 0 && dwpi >= 0.8) return 'CRITICAL';
  if (index === 0) return 'HIGH';
  if (index === 1) return 'NEXT';
  return 'QUEUED';
}

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const driver = MOCK_DRIVER;

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getBookings();
      const filtered = (Array.isArray(data) ? data : []).filter(
        (b) => b.status === 'ASSIGNED' || b.status === 'IN_TRANSIT' || b.status === 'PENDING'
      );
      if (filtered.length > 0) {
        setBookings(filtered);
        setDemoMode(false);
      } else {
        setBookings(MOCK_BOOKINGS);
        setDemoMode(true);
      }
    } catch {
      setBookings(MOCK_BOOKINGS);
      setDemoMode(true);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  const initials = driver.driver_name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="min-h-dvh bg-[#111008] pb-6">
      {/* ======== HEADER ======== */}
      <header className="bg-[#1A1208] border-b border-amber-500/15 p-4">
        {/* Top row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">
              Kaveri Link
            </span>
          </div>
          <div className="flex items-center gap-2">
            {demoMode && (
              <span className="bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded animate-pulse-amber">
                Demo Mode
              </span>
            )}
            <div className="flex items-center gap-1">
              {demoMode ? (
                <WifiOff className="w-3 h-3 text-stone-500" />
              ) : (
                <Wifi className="w-3 h-3 text-green-400" />
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-beacon" />
              <span className="text-green-400 text-xs">On shift</span>
            </div>
          </div>
        </div>

        {/* Driver row */}
        <div className="flex items-center gap-3 mt-3">
          <div className="w-9 h-9 rounded-full bg-amber-400 text-[#111] font-bold text-sm flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-bold text-sm truncate">{driver.driver_name}</div>
            <div className="text-stone-500 text-xs truncate">
              Tanker {driver.id} · {driver.connect_centre}
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/25 rounded-md px-2 py-1 flex-shrink-0">
            <span className="text-amber-400 text-xs font-bold">⭐ {driver.trust_score}</span>
          </div>
        </div>
      </header>

      {/* ======== STATS STRIP ======== */}
      <div className="flex bg-[#1A1208] border-b border-white/5 px-4 py-2">
        <div className="flex-1 text-center border-r border-white/5">
          <div className="text-amber-400 text-lg font-bold">{driver.stats.assigned}</div>
          <div className="text-stone-500 text-[8px] uppercase tracking-wide">Assigned</div>
        </div>
        <div className="flex-1 text-center border-r border-white/5">
          <div className="text-green-400 text-lg font-bold">{driver.stats.completed}</div>
          <div className="text-stone-500 text-[8px] uppercase tracking-wide">Completed</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-white text-lg font-bold">{driver.stats.loaded_kl}</div>
          <div className="text-stone-500 text-[8px] uppercase tracking-wide">Loaded</div>
        </div>
      </div>

      {/* ======== SECTION LABEL ======== */}
      <div className="px-4 pt-3 pb-2 flex justify-between items-center">
        <span className="text-stone-500 text-[9px] uppercase tracking-widest font-semibold">
          Active Dispatches
        </span>
        {lastRefresh && (
          <span className="text-stone-600 text-[8px]">
            {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
      </div>

      {/* ======== BOOKING CARDS ======== */}
      {loading ? (
        <div className="mx-4 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="shimmer-loading h-28 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="mx-4 mt-8 text-center">
          <Truck className="w-10 h-10 text-stone-700 mx-auto mb-3" />
          <div className="text-stone-500 text-sm">No active dispatches</div>
          <div className="text-stone-600 text-xs mt-1">Waiting for assignment…</div>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking, index) => {
            const priorityKey = getPriorityKey(index, booking.dwpi_score || 0);
            const badge = PRIORITY_BADGE[priorityKey];
            const isActive = index === 0;
            const statusLabel = booking.status === 'ASSIGNED' ? 'ASSIGNED' : booking.status === 'IN_TRANSIT' ? 'EN ROUTE' : 'QUEUED';

            return (
              <button
                key={booking.id}
                id={`dispatch-card-${index}`}
                onClick={() => navigate(`/driver/${booking.id}`)}
                className={`tap-highlight mx-4 w-[calc(100%-2rem)] text-left bg-[#1C1810] border border-amber-500/20 border-l-4 border-l-amber-500 rounded-xl p-3 relative animate-slide-up ${
                  !isActive ? 'opacity-60' : ''
                }`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Top row */}
                <div className="flex justify-between items-start">
                  <span className="text-white font-bold text-sm">{booking.citizen_name}</span>
                  <span
                    className={`${badge.bg} ${badge.text} text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wide`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Ward + details */}
                <div className="text-stone-500 text-xs mt-1 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>
                    {booking.ward_name || booking.ward_id?.replace('WARD_', '')} ·{' '}
                    {(booking.volume_liters || 12000).toLocaleString()}L
                    {booking.dwpi_score ? ` · DWPI ${booking.dwpi_score}` : ''}
                  </span>
                </div>

                {/* Pills */}
                <div className="flex gap-2">
                  <span className="bg-[#1A1208] border border-white/5 rounded px-2 py-0.5 text-stone-400 text-[8.5px] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />~{booking.distance_km || 4.2} km
                  </span>
                  <span className="bg-[#1A1208] border border-white/5 rounded px-2 py-0.5 text-stone-400 text-[8.5px] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />~{booking.duration_min || 15} min
                  </span>
                  <span
                    className={`bg-[#1A1208] border rounded px-2 py-0.5 text-[8.5px] font-semibold ${
                      isActive
                        ? 'border-amber-500/20 text-amber-400'
                        : 'border-white/5 text-stone-500'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* Chevron */}
                <ChevronRight className="absolute right-3 bottom-3 w-4 h-4 text-amber-400/50" />
              </button>
            );
          })}
        </div>
      )}

      {/* ======== EMERGENCY FOOTER ======== */}
      <div className="mx-4 mt-6 bg-red-500/5 border border-red-500/10 rounded-lg p-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
        <div>
          <div className="text-red-400 text-[9px] font-bold uppercase tracking-wide">
            Emergency Override
          </div>
          <div className="text-stone-500 text-[8px] mt-0.5">
            Contact dispatch control for priority rerouting
          </div>
        </div>
      </div>
    </div>
  );
}
