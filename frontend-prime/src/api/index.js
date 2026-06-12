import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const api  = axios.create({ baseURL: BASE });

// ── Real API calls ────────────────────────────────────────────────────────────
export const getBookings     = () => api.get('/bookings').then(r => r.data);
export const getWards        = () => api.get('/wards').then(r => r.data);
export const getTankers      = () => api.get('/tankers').then(r => r.data);
export const dispatchTanker  = (bookingId) =>
  api.post('/dispatch', { booking_id: bookingId }).then(r => r.data);
export const getDemandPulse  = () =>
  api.get('/analytics/demand-pulse').then(r => r.data);
export const resetDemo       = () => api.post('/demo/reset').then(r => r.data);
export const toggleEmergency = (wardId) =>
  api.patch(`/wards/${wardId}/emergency`).then(r => r.data);

// ── Mock data — auto-used until backend is live at 1 PM ───────────────────────
export const MOCK_WARDS = [
  { id: 'WARD_WHITEFIELD',   name: 'Whitefield',   lat: 12.967, lng: 77.750, dwpi_score: 0.89, pending_bookings: 14, emergency_mode: false },
  { id: 'WARD_MAHADEVAPURA', name: 'Mahadevapura', lat: 12.994, lng: 77.706, dwpi_score: 0.82, pending_bookings: 11, emergency_mode: false },
  { id: 'WARD_VARTHUR',      name: 'Varthur',      lat: 12.940, lng: 77.757, dwpi_score: 0.76, pending_bookings: 10, emergency_mode: false },
  { id: 'WARD_BELLANDUR',    name: 'Bellandur',    lat: 12.927, lng: 77.676, dwpi_score: 0.67, pending_bookings:  8, emergency_mode: false },
  { id: 'WARD_ANEKAL',       name: 'Anekal',       lat: 12.713, lng: 77.696, dwpi_score: 0.61, pending_bookings:  7, emergency_mode: false },
  { id: 'WARD_HSR',          name: 'HSR Layout',   lat: 12.908, lng: 77.640, dwpi_score: 0.51, pending_bookings:  5, emergency_mode: false },
  { id: 'WARD_KORAMANGALA',  name: 'Koramangala',  lat: 12.934, lng: 77.626, dwpi_score: 0.34, pending_bookings:  2, emergency_mode: false },
  { id: 'WARD_INDIRANAGAR',  name: 'Indiranagar',  lat: 12.978, lng: 77.640, dwpi_score: 0.22, pending_bookings:  1, emergency_mode: false },
];

export const MOCK_BOOKINGS = [
  { id: 'bk-001', citizen_name: 'Priya Sharma',  ward_id: 'WARD_WHITEFIELD',   volume_liters: 12000, status: 'PENDING',    delivery_lat: 12.967, delivery_lng: 77.750, dwpi_score: 0.89, ai_reasoning: null },
  { id: 'bk-002', citizen_name: 'Arjun Mehta',   ward_id: 'WARD_MAHADEVAPURA', volume_liters:  6000, status: 'ASSIGNED',   delivery_lat: 12.994, delivery_lng: 77.706, dwpi_score: 0.82, ai_reasoning: 'RECOMMENDATION: T-01 | REASON: Nearest tanker, trust score 0.91, 4.2 km from Connect Centre. | PRIORITY: HIGH' },
  { id: 'bk-003', citizen_name: 'Lakshmi Rajan', ward_id: 'WARD_HSR',          volume_liters: 12000, status: 'IN_TRANSIT', delivery_lat: 12.908, delivery_lng: 77.640, dwpi_score: 0.51, ai_reasoning: null },
  { id: 'bk-004', citizen_name: 'Rahul Nair',    ward_id: 'WARD_VARTHUR',      volume_liters:  6000, status: 'PENDING',    delivery_lat: 12.940, delivery_lng: 77.757, dwpi_score: 0.76, ai_reasoning: null },
  { id: 'bk-005', citizen_name: 'Sunita Patil',  ward_id: 'WARD_BELLANDUR',    volume_liters: 12000, status: 'DELIVERED',  delivery_lat: 12.927, delivery_lng: 77.676, dwpi_score: 0.67, ai_reasoning: null },
];
