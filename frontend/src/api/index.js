const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function getBookings() {
  const res = await fetch(`${API_BASE}/bookings`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getWards() {
  const res = await fetch(`${API_BASE}/wards`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function verifyOTP(bookingId, otp) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function confirmDelivery(bookingId) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/deliver`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ====== MOCK DATA (fallback for demo) ======

export const MOCK_BOOKINGS = [
  {
    id: 'a3f8e1d2-b7c4-4f9a-8e31-abc123def456',
    citizen_name: 'Priya Sharma',
    phone: '9900112233',
    ward_id: 'WARD_WHITEFIELD',
    ward_name: 'Whitefield',
    delivery_lat: 12.969,
    delivery_lng: 77.748,
    volume_liters: 12000,
    status: 'ASSIGNED',
    otp: '112233',
    assigned_tanker_id: 'T-02',
    ai_reasoning:
      'T-02 selected: highest trust score (0.91) and nearest tanker to Whitefield CC. Ward DWPI 0.89 indicates critical water stress requiring immediate dispatch. PRIORITY: HIGH.',
    created_at: new Date().toISOString(),
    dwpi_score: 0.89,
    distance_km: 4.2,
    duration_min: 15,
    route_source: 'openrouteservice',
    connect_centre: 'Whitefield Connect Centre',
    connect_centre_lat: 12.985,
    connect_centre_lng: 77.748,
  },
  {
    id: 'b9d3f4a1-c2e8-4b7d-9f12-def456abc789',
    citizen_name: 'Ramesh Gowda',
    phone: '9900445566',
    ward_id: 'WARD_MAHADEVAPURA',
    ward_name: 'Mahadevapura',
    delivery_lat: 12.991,
    delivery_lng: 77.709,
    volume_liters: 12000,
    status: 'ASSIGNED',
    otp: '445566',
    assigned_tanker_id: 'T-02',
    ai_reasoning:
      'T-02 assigned after completing Whitefield delivery. Mahadevapura critical infrastructure flag active. PRIORITY: HIGH.',
    created_at: new Date().toISOString(),
    dwpi_score: 0.82,
    distance_km: 5.8,
    duration_min: 22,
    route_source: 'fallback',
    connect_centre: 'Whitefield Connect Centre',
    connect_centre_lat: 12.985,
    connect_centre_lng: 77.748,
  },
];

export const MOCK_DRIVER = {
  id: 'T-02',
  driver_name: 'Suresh Babu',
  phone: '9845003344',
  trust_score: 0.91,
  capacity_liters: 12000,
  connect_centre: 'Whitefield CC',
  status: 'ON_SHIFT',
  stats: {
    assigned: 2,
    completed: 5,
    loaded_kl: '12KL',
  },
};
