import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
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

          {/* ── Confirm CTA ── */}
          <button
            id="btn-enter-otp"
            onClick={() => navigate(`/confirm/${displayId}`)}
            className="w-full bg-[#0A7A8F] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-400 transition-all duration-200 active:scale-[0.98]"
          >
            <ShieldCheck size={18} />
            <span>Tanker arrived? Enter OTP</span>
          </button>

        </div>
      </div>
    </div>
  );
}
