import { useState, useEffect } from 'react';
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

  if (loading || !booking) {
    return (
      <div className="min-h-dvh bg-[#111008] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  const shortId = (booking.id || '').slice(0, 8).toUpperCase();
  const wardLabel = booking.ward_name || booking.ward_id?.replace('WARD_', '') || 'Unknown';

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

      {/* ======== MAP AREA ======== */}
      <div className="h-44 bg-[#0C1220] relative overflow-hidden map-grid">
        {/* Map label */}
        <span className="absolute top-2 left-2 text-[7px] text-white/25 uppercase tracking-wider z-10 font-semibold">
          Bangalore — Live Route
        </span>

        {/* Source pin */}
        <div className="absolute bottom-10 left-8 z-10">
          <div className="w-2.5 h-2.5 bg-[#0A7A8F] border-2 border-white rounded-full shadow-lg shadow-[#0A7A8F]/30" />
          <div className="mt-1 text-[7.5px] text-[#0A7A8F] font-semibold whitespace-nowrap">
            ● {booking.connect_centre || 'Whitefield CC'}
          </div>
        </div>

        {/* Destination pin */}
        <div className="absolute top-8 right-10 z-10">
          <div className="mb-1 text-[7.5px] text-amber-400 font-semibold whitespace-nowrap text-right">
            ◆ Delivery
          </div>
          <div className="w-2.5 h-2.5 bg-amber-400 border-2 border-white rounded-full shadow-lg shadow-amber-400/30 ml-auto" />
        </div>

        {/* Route line (SVG arc) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 430 176"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 50 140 Q 200 20 370 50"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.6"
            className="animate-route-dash"
          />
        </svg>

        {/* Distance badge */}
        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-amber-400 text-[8px] font-semibold px-2 py-0.5 rounded z-10">
          {booking.distance_km || 4.2} km · ~{booking.duration_min || 15} min
        </div>
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
