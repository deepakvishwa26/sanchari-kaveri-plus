import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Navigation,
  Brain,
  MapPin,
  ChevronDown,
  Truck,
} from 'lucide-react';
import { MOCK_BOOKINGS } from '../api/index';

// ======== Geo → SVG projection ========
const MIN_LNG = 77.62, MAX_LNG = 77.76, MIN_LAT = 12.89, MAX_LAT = 13.01;
function mapCoord(lng, lat) {
  return {
    x: ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 360 + 10,
    y: ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 156 + 10,
  };
}

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try API first, fall back to mock
    async function fetchBooking() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
        const res = await fetch(`${API_BASE}/bookings/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
          setLoading(false);
          return;
        }
      } catch {
        // fallback below
      }
      // Mock fallback
      const mock = MOCK_BOOKINGS.find((b) => b.id === id) || MOCK_BOOKINGS[0];
      setBooking(mock);
      setLoading(false);
    }
    fetchBooking();
  }, [id]);

  // Build SVG path from GeoJSON route data if available
  const dynamicRoutePath = useMemo(() => {
    if (!booking?.route_geojson?.geometry) return null;
    try {
      const coords = booking.route_geojson.geometry;
      if (!Array.isArray(coords) || coords.length < 2) return null;
      return coords
        .map(([lng, lat], i) => {
          const { x, y } = mapCoord(lng, lat);
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');
    } catch {
      return null;
    }
  }, [booking]);

  if (loading || !booking) {
    return (
      <div className="min-h-dvh bg-[#111008] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  const shortId = (booking.id || '').slice(0, 8).toUpperCase();
  const wardLabel = booking.ward_name || booking.ward_id?.replace('WARD_', '') || 'Unknown';
  const distKm = booking.distance_km || 4.2;
  const durMin = booking.duration_min || 15;
  const ccLabel = booking.connect_centre || 'Whitefield CC';

  // Fallback Bézier or dynamic polyline
  const routeD = dynamicRoutePath || 'M 60 130 Q 190 40 320 46';

  return (
    <div className="min-h-dvh bg-[#111008] pb-6">
      {/* ======== HEADER ======== */}
      <header className="bg-[#1A1208] border-b border-amber-500/12 p-3">
        <button
          onClick={() => navigate('/driver')}
          className="text-stone-500 text-xs flex items-center gap-1 mb-2 tap-highlight"
          id="back-to-dispatches"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          My dispatches
        </button>
        <div className="text-amber-400 font-bold text-xs uppercase tracking-wide">
          Route — Booking #{shortId}
        </div>
        <div className="text-stone-500 text-xs mt-0.5">
          {booking.citizen_name} · {wardLabel} · {(booking.volume_liters || 12000).toLocaleString()}L
        </div>
      </header>

      {/* ======== MAP AREA — Self-contained inline SVG ======== */}
      <div className="w-full bg-[#0C1220] overflow-hidden">
        <svg viewBox="0 0 380 176" width="100%" preserveAspectRatio="xMidYMid meet">
          {/* Grid pattern */}
          <defs>
            <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(255,255,255,0.025)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="380" height="176" fill="url(#mapGrid)" />

          {/* Route arc — dashed amber Bézier (or dynamic polyline) */}
          <path
            id="routePath"
            d={routeD}
            stroke="#F59E0B"
            strokeWidth="2"
            fill="none"
            strokeDasharray="6 4"
          />

          {/* Origin pin — Connect Centre (bottom-left) */}
          <circle cx="60" cy="130" r="6" fill="#0A7A8F" stroke="white" strokeWidth="2" />
          <text x="60" y="148" textAnchor="middle" fontSize="7" fill="#0A7A8F" fontWeight="600">
            {ccLabel}
          </text>

          {/* Destination pin — Delivery (top-right) */}
          <circle cx="320" cy="46" r="6" fill="#F59E0B" stroke="white" strokeWidth="2" />
          <text x="320" y="36" textAnchor="middle" fontSize="7" fill="#F59E0B" fontWeight="600">
            Delivery
          </text>

          {/* Animated pulse dot tracking the route */}
          <circle r="4" fill="#F59E0B" opacity="0.9">
            <animateMotion dur="4s" repeatCount="indefinite">
              <mpath href="#routePath" />
            </animateMotion>
          </circle>

          {/* Distance badge */}
          <rect x="272" y="152" width="100" height="18" rx="4" fill="rgba(0,0,0,0.6)" />
          <text x="322" y="164" textAnchor="middle" fontSize="8" fill="#F59E0B" fontWeight="600">
            {distKm} km · ~{durMin} min
          </text>

          {/* Map label */}
          <text x="8" y="14" fontSize="7" fill="rgba(255,255,255,0.25)" letterSpacing="1.5" fontWeight="500">
            BANGALORE — LIVE ROUTE
          </text>
        </svg>
      </div>

      {/* ======== BODY ======== */}
      <div className="p-3 space-y-3">
        {/* Route card */}
        <div className="bg-[#1C1810] border border-white/5 rounded-lg p-3 animate-slide-up">
          {/* From */}
          <div className="flex items-start gap-2">
            <div className="w-4 flex flex-col items-center pt-0.5">
              <div className="w-2 h-2 rounded-full bg-[#0A7A8F] flex-shrink-0" />
              <div className="w-px h-8 bg-white/10 mt-1" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-stone-500 text-[9px] uppercase tracking-wide font-semibold">
                Load at
              </div>
              <div className="text-white text-[10px] font-semibold mt-0.5 truncate">
                {booking.connect_centre || 'Whitefield Connect Centre'}
              </div>
            </div>
          </div>
          {/* To */}
          <div className="flex items-start gap-2 mt-1">
            <div className="w-4 flex flex-col items-center pt-0.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-stone-500 text-[9px] uppercase tracking-wide font-semibold">
                Deliver to
              </div>
              <div className="text-white text-[10px] font-semibold mt-0.5 truncate">
                {booking.citizen_name} · {wardLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Route details pills */}
        <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '60ms' }}>
          <div className="flex-1 bg-[#1C1810] border border-white/5 rounded-lg p-2 text-center">
            <div className="text-white text-sm font-bold">{booking.distance_km || 4.2} km</div>
            <div className="text-stone-500 text-[8px] uppercase tracking-wide mt-0.5">Distance</div>
          </div>
          <div className="flex-1 bg-[#1C1810] border border-white/5 rounded-lg p-2 text-center">
            <div className="text-white text-sm font-bold">{booking.duration_min || 15} min</div>
            <div className="text-stone-500 text-[8px] uppercase tracking-wide mt-0.5">ETA</div>
          </div>
          <div className="flex-1 bg-[#1C1810] border border-white/5 rounded-lg p-2 text-center">
            <div className="text-white text-sm font-bold">{((booking.volume_liters || 12000) / 1000)}KL</div>
            <div className="text-stone-500 text-[8px] uppercase tracking-wide mt-0.5">Volume</div>
          </div>
        </div>

        {/* AI reasoning card */}
        <div
          className="bg-[#1A1208] border-l-4 border-l-[#8B5CF6] border border-[#8B5CF6]/20 rounded-r-lg p-3 animate-slide-up"
          style={{ animationDelay: '120ms' }}
          id="ai-reasoning-card"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Brain className="w-3 h-3 text-[#8B5CF6]" />
            <span className="text-[#8B5CF6] text-[8px] uppercase tracking-widest font-bold">
              Kaveri AI Dispatch Reason
            </span>
          </div>
          <p className="text-stone-400 text-[9px] leading-relaxed">
            {booking.ai_reasoning ||
              'T-02 selected: highest trust score (0.91) and nearest tanker to Whitefield CC. PRIORITY: HIGH.'}
          </p>
        </div>

        {/* Start route CTA */}
        <button
          onClick={() => navigate(`/driver/${booking.id}/verify`)}
          className="w-full bg-amber-400 hover:bg-amber-500 text-[#111] font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 tap-highlight transition-colors animate-slide-up"
          style={{ animationDelay: '180ms' }}
          id="start-route-btn"
        >
          <Navigation className="w-4 h-4" />
          Start route navigation
        </button>

        {/* Tanker info footer */}
        <div
          className="bg-[#1C1810] border border-white/5 rounded-lg p-3 flex items-center gap-3 animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold">Tanker {booking.assigned_tanker_id || 'T-02'}</div>
            <div className="text-stone-500 text-[9px]">
              {(booking.volume_liters || 12000).toLocaleString()}L capacity · GPS tracked
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-md px-1.5 py-0.5">
            <span className="text-green-400 text-[8px] font-bold uppercase">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
