import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Check } from 'lucide-react';

export default function OTPConfirmPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = otp.replace(/\s/g, '').length === 6;

  const handleConfirm = async () => {
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      // Simulate API call (swap with confirmDelivery when backend is live)
      await new Promise(r => setTimeout(r, 600));

      // In production: await confirmDelivery(bookingId, otp);
      setConfirmed(true);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Success State ──
  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="max-w-[430px] w-full mx-auto text-center">
          {/* Bouncing green circle */}
          <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>

          {/* Title */}
          <h1 className="text-green-400 text-3xl font-bold mb-2">
            Delivery Confirmed!
          </h1>

          {/* Savings message */}
          <p className="text-teal-400 font-semibold text-lg mt-2">
            You saved ₹1,910 vs private tankers
          </p>

          {/* Back to home */}
          <button
            id="btn-back-home"
            onClick={() => navigate('/book')}
            className="mt-8 text-slate-500 text-sm hover:text-white transition-colors underline underline-offset-4"
          >
            Book another tanker
          </button>
        </div>
      </div>
    );
  }

  // ── OTP Entry State ──
  return (
    <div className="min-h-screen bg-[#0F172A] p-4 flex items-center justify-center">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm text-center">
        {/* Title */}
        <h1 className="text-teal-400 text-xl font-bold mb-1">
          Confirm Delivery
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-sm mb-6">
          Enter the 6-digit OTP shown by the driver
        </p>

        {/* OTP Input */}
        <input
          id="input-otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            setOtp(val);
            setError('');
          }}
          placeholder="● ● ● ● ● ●"
          className="w-full bg-slate-700 text-white text-center text-4xl font-mono rounded-xl p-4 tracking-[12px] focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-slate-600 placeholder:tracking-[12px]"
        />

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}

        {/* Confirm Button */}
        <button
          id="btn-confirm-delivery"
          onClick={handleConfirm}
          disabled={!isValid || loading}
          className={`w-full font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
            isValid
              ? 'bg-green-500 text-white hover:bg-green-400 cursor-pointer'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>Confirm Delivery</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
