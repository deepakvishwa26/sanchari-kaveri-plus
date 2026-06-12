import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import { createBooking, WARD_OPTIONS, MOCK_BOOKING } from '../api/index';
import PriceComparison from '../components/PriceComparison';

// Set this to true to test without backend
const USE_MOCK = true;

const VOLUMES = [
  { liters: 12000, label: '12,000L', price: '₹1,290' },
  { liters: 6000, label: '6,000L', price: '₹645' },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    citizen_name: 'Priya Sharma',
    phone: '98765 43210',
    ward_id: 'WARD_WHITEFIELD',
    address: '42, 2nd Cross, EPIP Zone, Whitefield',
    volume_liters: 12000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.citizen_name.trim()) { setError('Please enter your name.'); return; }
    if (!form.phone.trim()) { setError('Please enter your mobile number.'); return; }
    if (!form.ward_id) { setError('Please select your ward.'); return; }
    if (!form.address.trim()) { setError('Please enter your delivery address.'); return; }

    setLoading(true);
    try {
      let result;
      if (USE_MOCK) {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));
        result = MOCK_BOOKING;
      } else {
        const ward = WARD_OPTIONS.find(w => w.value === form.ward_id);
        const payload = {
          ...form,
          delivery_lat: ward?.lat || 12.97,
          delivery_lng: ward?.lng || 77.75,
        };
        result = await createBooking(payload);
      }
      // Navigate to success page with booking data
      navigate('/success', { state: { booking: result, form } });
    } catch (err) {
      setError('Booking failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-[430px] mx-auto">

        {/* ── Header Section ── */}
        <div
          className="p-[18px] pb-5"
          style={{ background: 'linear-gradient(180deg, #0A7A8F 0%, #05505F 100%)' }}
        >
          {/* Brand label */}
          <p className="text-white/50 uppercase text-[9px] tracking-widest font-semibold mb-1">
            Sanchari Kaveri Plus
          </p>

          {/* Title */}
          <h1 className="text-white text-xl font-bold mb-1">
            Book Water Tanker
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-xs mb-3">
            BIS-certified Cauvery water, direct to your door
          </p>

          {/* Pill chip */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
            <span className="text-white text-[9px]">
              Fixed govt. rate · ₹1,290 / 12,000L
            </span>
          </div>
        </div>

        {/* ── Form Body ── */}
        <div className="p-4 space-y-3">

          {/* Full Name */}
          <div>
            <label className="text-slate-500 uppercase text-[9px] tracking-widest block mb-1">Full Name</label>
            <input
              id="input-citizen-name"
              type="text"
              name="citizen_name"
              value={form.citizen_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full bg-slate-700 text-white rounded-lg p-3 text-sm border border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-slate-500 uppercase text-[9px] tracking-widest block mb-1">Mobile Number</label>
            <input
              id="input-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              className="w-full bg-slate-700 text-white rounded-lg p-3 text-sm border border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>

          {/* Ward Dropdown */}
          <div>
            <label className="text-slate-500 uppercase text-[9px] tracking-widest block mb-1">Ward</label>
            <select
              id="select-ward"
              name="ward_id"
              value={form.ward_id}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white rounded-lg p-3 text-sm border border-slate-600 focus:ring-2 focus:ring-teal-500 focus:outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="" disabled>Select your ward ▾</option>
              {WARD_OPTIONS.map(w => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="text-slate-500 uppercase text-[9px] tracking-widest block mb-1">Delivery Address</label>
            <textarea
              id="input-address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House/Flat No, Street, Landmark"
              rows={2}
              className="w-full bg-slate-700 text-white rounded-lg p-3 text-sm border border-slate-600 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Volume Selector */}
          <div>
            <label className="text-slate-500 uppercase text-[9px] tracking-widest block mb-1">Volume</label>
            <div className="grid grid-cols-2 gap-2">
              {VOLUMES.map(v => {
                const isActive = form.volume_liters === v.liters;
                return (
                  <button
                    key={v.liters}
                    id={`btn-volume-${v.liters}`}
                    type="button"
                    onClick={() => setForm({ ...form, volume_liters: v.liters })}
                    className={`rounded-lg py-2.5 text-center border transition-all ${
                      isActive
                        ? 'bg-[#0A7A8F] text-white border-[#0A7A8F]'
                        : 'bg-slate-700 text-slate-400 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-bold text-sm">{v.label}</div>
                    <div className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-slate-500'}`}>
                      {v.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Surge Shield Price Comparison */}
          <PriceComparison />

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2">
              {error}
            </p>
          )}

          {/* CTA Button */}
          <button
            id="btn-book-tanker"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#0A7A8F] hover:bg-teal-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Droplets size={18} />
                <span>Book Tanker</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
