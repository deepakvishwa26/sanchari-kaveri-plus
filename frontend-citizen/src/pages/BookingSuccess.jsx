import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Radio } from 'lucide-react';
import { WARD_OPTIONS, MOCK_BOOKING } from '../api/index';

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get booking data from navigation state, or fall back to mock
  const booking = location.state?.booking || MOCK_BOOKING;
  const form = location.state?.form || {
    citizen_name: 'Priya Sharma',
    ward_id: 'WARD_WHITEFIELD',
    volume_liters: 12000,
  };

  const ward = WARD_OPTIONS.find(w => w.value === (form.ward_id || booking.ward_id));
  const wardLabel = ward?.label || 'Whitefield';
  const volume = form.volume_liters || booking.volume_liters || 12000;
  const volumeLabel = volume >= 1000 ? `${(volume / 1000).toFixed(0)},000L` : `${volume}L`;
  const otp = booking.otp || '382910';
  const bookingShort = (booking.booking_id || 'A3F8').slice(-4).toUpperCase();
  const price = volume === 12000 ? '₹1,290' : '₹645';
  const privateCost = volume === 12000 ? '₹3,200' : '₹1,600';
  const waitHours = booking.estimated_wait_hours || 4;

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-start justify-center">
      <div className="max-w-[430px] w-full mx-auto p-4 pt-10">

        {/* ── Checkmark Circle ── */}
        <div className="w-14 h-14 bg-[#0A7A8F] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-white" strokeWidth={2.5} />
        </div>

        {/* ── Title ── */}
        <h1 className="text-green-400 text-xl font-bold text-center">
          Booking Confirmed
        </h1>

        {/* ── Subtitle ── */}
        <p className="text-slate-400 text-xs text-center mb-4">
          Booking #{bookingShort} · registered successfully
        </p>

        {/* ── OTP Display Box ── */}
        <div className="bg-[#0F2537] border border-[#0A7A8F] rounded-xl p-5 text-center mb-4">
          {/* Label */}
          <p className="text-slate-400 text-[9px] uppercase tracking-widest mb-2">
            Delivery OTP — Share only with driver
          </p>

          {/* OTP Digits */}
          <p className="text-5xl font-mono font-bold text-white tracking-[10px] leading-tight">
            {otp}
          </p>

          {/* Note */}
          <p className="text-slate-500 text-[8px] mt-2">
            Generated securely · expires on delivery
          </p>
        </div>

        {/* ── Booking Meta Card ── */}
        <div className="bg-slate-800 rounded-xl p-3 space-y-2 mb-4">
          {/* Ward */}
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Ward</span>
            <span className="text-white font-semibold">{wardLabel}</span>
          </div>

          {/* Volume */}
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Volume</span>
            <span className="text-white font-semibold">{volumeLabel}</span>
          </div>

          {/* Amount charged */}
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Amount charged</span>
            <span className="text-green-400 font-bold">{price}</span>
          </div>

          {/* Estimated wait */}
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Estimated wait</span>
            <span className="text-amber-400 font-bold">~{waitHours} hrs</span>
          </div>

          {/* Private cost */}
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Private would cost</span>
            <span className="text-red-400 line-through">{privateCost}</span>
          </div>
        </div>

        {/* ── Track Button ── */}
        <button
          id="btn-track-delivery"
          onClick={() => navigate(`/status/${bookingShort}`)}
          className="w-full bg-slate-800 border border-[#0A7A8F] rounded-xl py-3 text-sky-400 font-semibold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all duration-200 active:scale-[0.98]"
        >
          <Radio size={18} />
          <span>Track delivery live</span>
        </button>

      </div>
    </div>
  );
}
