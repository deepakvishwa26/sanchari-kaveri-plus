import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Clock, Info } from 'lucide-react';
import StatusTimeline from '../components/StatusTimeline';

export default function BookingStatus() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const displayId = bookingId || 'A3F8';

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-[430px] mx-auto">

        {/* ── Teal Header ── */}
        <div className="bg-[#0A7A8F] p-4">
          {/* Back link */}
          <button
            id="btn-back-bookings"
            onClick={() => navigate('/book')}
            className="flex items-center gap-1 text-white/60 text-xs mb-2 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>My bookings</span>
          </button>

          {/* Name */}
          <h1 className="text-white font-bold text-base">
            Priya Sharma
          </h1>

          {/* Sub */}
          <p className="text-white/60 text-xs">
            Whitefield · 12,000L · Booking #{displayId}
          </p>
        </div>

        {/* ── Body ── */}
        <div className="p-4">

          {/* Timeline */}
          <StatusTimeline />

          {/* ── ETA Card ── */}
          <div className="bg-slate-800 border-l-4 border-[#0A7A8F] rounded-r-xl p-3 mb-4">
            {/* Label */}
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={12} className="text-slate-500" />
              <span className="text-[9px] uppercase text-slate-500 tracking-widest">
                Estimated Arrival
              </span>
            </div>

            {/* Value */}
            <p className="text-white text-xl font-bold mt-1">
              12:30 PM
            </p>

            {/* Sub */}
            <p className="text-slate-500 text-xs mt-1">
              ~2 hrs · Updated live every 30s
            </p>
          </div>

          {/* ── OTP Info Note (citizen sees this, driver enters it) ── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-[#0A7A8F] shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-semibold mb-1">
                  OTP verification at delivery
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  When the tanker arrives, share your OTP with the driver to confirm delivery. Your OTP was shown on the booking confirmation screen.
                </p>
              </div>
            </div>
          </div>

          {/* ── Back to Booking ── */}
          <button
            id="btn-new-booking"
            onClick={() => navigate('/book')}
            className="w-full bg-slate-800 border border-[#0A7A8F] rounded-xl py-3 text-sky-400 font-semibold flex items-center justify-center gap-2 hover:bg-slate-700 transition-all duration-200 active:scale-[0.98]"
          >
            <ShieldCheck size={18} />
            <span>Book another tanker</span>
          </button>

        </div>
      </div>
    </div>
  );
}
