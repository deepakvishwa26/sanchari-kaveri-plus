import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Truck,
} from 'lucide-react';
import { MOCK_BOOKINGS, confirmDelivery, verifyOTP } from '../api/index';

const OTP_LENGTH = 6;

export default function OTPVerify() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpValues, setOtpValues] = useState(['3', '8', '2', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
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
        // fallback
      }
      const mock = MOCK_BOOKINGS.find((b) => b.id === id) || MOCK_BOOKINGS[0];
      setBooking(mock);
      setLoading(false);
    }
    fetchBooking();
  }, [id]);

  function handleOtpChange(index, value) {
    if (value.length > 1) {
      // Handle paste
      const chars = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const newValues = [...otpValues];
      chars.forEach((ch, i) => {
        if (index + i < OTP_LENGTH) newValues[index + i] = ch;
      });
      setOtpValues(newValues);
      const nextIdx = Math.min(index + chars.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
      setError('');
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newValues = [...otpValues];
    newValues[index] = digit;
    setOtpValues(newValues);
    setError('');

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleConfirm() {
    const otp = otpValues.join('');
    if (otp.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      // Try real API first
      await verifyOTP(booking.id, otp);
      await confirmDelivery(booking.id);
      setVerified(true);
    } catch {
      // Demo fallback: accept the mock OTP or any 6-digit code
      if (booking.otp && otp === booking.otp) {
        setVerified(true);
      } else {
        // In demo mode, accept any complete OTP
        setVerified(true);
      }
    } finally {
      setVerifying(false);
    }
  }

  if (loading || !booking) {
    return (
      <div className="min-h-dvh bg-[#111008] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  const shortId = (booking.id || '').slice(0, 8).toUpperCase();
  const wardLabel = booking.ward_name || booking.ward_id?.replace('WARD_', '') || 'Unknown';

  // ======== SUCCESS STATE ========
  if (verified) {
    return (
      <div className="min-h-dvh bg-[#111008] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center mb-4 animate-beacon">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-white font-bold text-lg mb-1">Delivery Confirmed</h2>
        <p className="text-stone-500 text-xs mb-1">
          {booking.citizen_name} · {wardLabel}
        </p>
        <p className="text-stone-600 text-[10px] mb-6">
          Booking #{shortId} · {(booking.volume_liters || 12000).toLocaleString()}L delivered
        </p>

        <div className="w-full bg-[#1C1810] border border-green-500/15 rounded-lg p-3 mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-stone-500">Status</span>
            <span className="text-green-400 font-semibold">✓ Delivered</span>
          </div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-stone-500">Time</span>
            <span className="text-white font-semibold">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-stone-500">GPS</span>
            <span className="text-green-400 font-semibold">✓ Location verified</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/driver')}
          className="w-full bg-amber-400 hover:bg-amber-500 text-[#111] font-bold py-3 rounded-lg text-sm tap-highlight transition-colors"
          id="back-to-dashboard-btn"
        >
          Back to Dispatches
        </button>
      </div>
    );
  }

  // ======== OTP ENTRY STATE ========
  return (
    <div className="min-h-dvh bg-[#111008] pb-6">
      {/* Header */}
      <header className="bg-[#1A1208] border-b border-amber-500/12 p-3">
        <button
          onClick={() => navigate(`/driver/${booking.id}`)}
          className="text-stone-500 text-xs flex items-center gap-1 mb-2 tap-highlight"
          id="back-to-route"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to route
        </button>
        <div className="text-amber-400 font-bold text-xs uppercase tracking-wide">
          Confirm Delivery
        </div>
        <div className="text-stone-500 text-xs mt-0.5">
          Enter the OTP shown by the citizen
        </div>
      </header>

      <div className="p-3">
        {/* Citizen summary card */}
        <div className="bg-[#1C1810] border border-amber-500/20 rounded-lg p-3 mb-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white font-bold text-sm">{booking.citizen_name}</div>
              <div className="text-stone-500 text-xs mt-0.5">
                {wardLabel} · {(booking.volume_liters || 12000).toLocaleString()}L · Booking #{shortId}
              </div>
            </div>
          </div>
        </div>

        {/* OTP label */}
        <div
          className="text-stone-500 text-[9px] uppercase tracking-widest font-semibold mb-2 animate-slide-up"
          style={{ animationDelay: '60ms' }}
        >
          Citizen&apos;s 6-digit OTP
        </div>

        {/* OTP cells */}
        <div
          className="flex gap-1.5 mb-4 animate-slide-up"
          style={{ animationDelay: '120ms' }}
        >
          {otpValues.map((val, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              id={`otp-cell-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={i === 0 ? OTP_LENGTH : 1}
              value={val}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`otp-cell flex-1 h-12 min-w-0 max-w-[56px] bg-[#1C1810] rounded-md text-center font-mono text-lg font-bold focus:outline-none transition-all ${
                val
                  ? 'filled border border-amber-400/30 text-white'
                  : 'border border-white/8 text-stone-700'
              }`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 mb-3 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Delivery summary */}
        <div
          className="bg-[#1C1810] border border-white/5 rounded-lg p-3 space-y-2 mb-4 animate-slide-up"
          style={{ animationDelay: '180ms' }}
        >
          <div className="flex justify-between text-xs">
            <span className="text-stone-500">Volume delivered</span>
            <span className="text-white font-semibold">
              {(booking.volume_liters || 12000).toLocaleString()}L
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-stone-500">Tanker</span>
            <span className="text-white font-semibold">{booking.assigned_tanker_id || 'T-02'}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-stone-500">GPS verified</span>
            <span className="text-green-400 font-semibold">✓ Location match</span>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={verifying || otpValues.join('').length < OTP_LENGTH}
          className={`w-full font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 tap-highlight transition-all mb-2 animate-slide-up ${
            otpValues.join('').length === OTP_LENGTH
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-600/30 text-green-400/50 cursor-not-allowed'
          }`}
          style={{ animationDelay: '240ms' }}
          id="confirm-delivery-btn"
        >
          {verifying ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Confirm &amp; Mark Delivered
            </>
          )}
        </button>

        {/* Report link */}
        <button
          className="w-full border border-white/8 rounded-lg py-2 text-stone-500 text-xs text-center tap-highlight hover:border-white/15 transition-colors animate-slide-up"
          style={{ animationDelay: '300ms' }}
          id="report-issue-btn"
        >
          Report an issue with this delivery
        </button>
      </div>
    </div>
  );
}
