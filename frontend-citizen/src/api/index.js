import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const api = axios.create({ baseURL: BASE });

// === LIVE API CALLS (these work once Dev 1's backend is running) ===
export const createBooking = (data) => api.post('/bookings', data).then(r => r.data);
export const getBooking = (id) => api.get(`/bookings/${id}`).then(r => r.data);
export const getBookings = () => api.get('/bookings').then(r => r.data);
export const getWards = () => api.get('/wards').then(r => r.data);
export const confirmDelivery = (bookingId, otp) =>
  api.post('/confirm-delivery', { booking_id: bookingId, otp }).then(r => r.data);

// === WARD DROPDOWN OPTIONS ===
// Used in the booking form. Also used as fallback before /wards loads.
export const WARD_OPTIONS = [
  { value: 'WARD_WHITEFIELD',    label: 'Whitefield',    lat: 12.967, lng: 77.750 },
  { value: 'WARD_MAHADEVAPURA',  label: 'Mahadevapura',  lat: 12.994, lng: 77.706 },
  { value: 'WARD_BELLANDUR',     label: 'Bellandur',     lat: 12.927, lng: 77.676 },
  { value: 'WARD_HSR',           label: 'HSR Layout',    lat: 12.908, lng: 77.640 },
  { value: 'WARD_KORAMANGALA',   label: 'Koramangala',   lat: 12.934, lng: 77.626 },
  { value: 'WARD_INDIRANAGAR',   label: 'Indiranagar',   lat: 12.978, lng: 77.640 },
];

// === MOCK BOOKING (for testing before backend is live) ===
export const MOCK_BOOKING = {
  booking_id: 'mock-booking-uuid-1234',
  otp: '382910',
  status: 'PENDING',
  estimated_wait_hours: 4,
  citizen_name: 'Priya Sharma',
  ward_id: 'WARD_WHITEFIELD',
  volume_liters: 12000,
  delivery_lat: 12.967,
  delivery_lng: 77.750,
  ai_reasoning: 'RECOMMENDATION: T-02 | REASON: Nearest tanker, highest trust score 0.91 | PRIORITY: HIGH',
};
