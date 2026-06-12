import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

const getDWPIColor = (score) => {
  if (score >= 0.7) return '#EF4444';
  if (score >= 0.5) return '#F59E0B';
  return '#22C55E';
};
const getDWPILabel = (score) => {
  if (score >= 0.7) return 'CRITICAL';
  if (score >= 0.5) return 'HIGH';
  return 'LOW';
};
const getStatusColor = (status) => {
  if (status === 'PENDING')    return '#EF4444';
  if (status === 'ASSIGNED')   return '#F59E0B';
  if (status === 'IN_TRANSIT') return '#60A5FA';
  return '#22C55E';
};

// CARTO dark tile — makes this look like a real command dashboard
const DARK_TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function BangaloreMap({ wards, bookings, onDispatch }) {
  return (
    <MapContainer
      center={[12.954, 77.690]}
      zoom={12}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer attribution={DARK_ATTR} url={DARK_TILE} />

      {/* Ward DWPI circles — sized & colored by stress score */}
      {wards.map(w => {
        const isCritical = w.dwpi_score >= 0.7;
        return (
          <CircleMarker
            key={w.id}
            center={[w.lat, w.lng]}
            radius={Math.max(22, w.dwpi_score * 44)}
            pathOptions={{
              color:       getDWPIColor(w.dwpi_score),
              fillColor:   getDWPIColor(w.dwpi_score),
              fillOpacity: isCritical ? 0.35 : 0.18,
              weight:      isCritical ? 2.5 : 1.5,
              dashArray:   w.emergency_mode ? '6 3' : undefined,
              className:   isCritical ? 'dwpi-critical-pulse' : '',
            }}
          >
            <Popup>
              <div style={{ minWidth: '180px', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.7' }}>
                <strong style={{ color: getDWPIColor(w.dwpi_score), fontSize: '14px' }}>{w.name}</strong><br />
                DWPI: <strong>{w.dwpi_score.toFixed(2)}</strong>{' '}
                <span style={{ background: getDWPIColor(w.dwpi_score), color: '#fff', borderRadius: '4px', padding: '1px 7px', fontSize: '10px', fontWeight: 'bold' }}>
                  {getDWPILabel(w.dwpi_score)}
                </span><br />
                Pending: <strong>{w.pending_bookings}</strong> bookings<br />
                {w.emergency_mode && <span style={{ color: '#EF4444', fontWeight: 'bold' }}>⚠ EMERGENCY ACTIVE</span>}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* Booking pins — live, color-coded by status */}
      {bookings
        ?.filter(b => ['PENDING', 'ASSIGNED', 'IN_TRANSIT'].includes(b.status))
        .map(b => (
          <CircleMarker
            key={b.id}
            center={[b.delivery_lat, b.delivery_lng]}
            radius={9}
            pathOptions={{
              color:       '#fff',
              fillColor:   getStatusColor(b.status),
              fillOpacity: 0.95,
              weight:      2,
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.8' }}>
                <strong style={{ fontSize: '13px' }}>{b.citizen_name}</strong><br />
                Ward: {b.ward_id?.replace('WARD_', '')}<br />
                Volume: <strong>{b.volume_liters.toLocaleString()}L</strong><br />
                Status:{' '}
                <span style={{ background: getStatusColor(b.status), color: '#fff', borderRadius: '4px', padding: '1px 8px', fontSize: '10px', fontWeight: 'bold' }}>
                  {b.status}
                </span><br />
                {b.status === 'PENDING' && onDispatch && (
                  <button
                    onClick={() => onDispatch(b.id)}
                    style={{ marginTop: '8px', background: '#0D9488', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 14px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', width: '100%' }}
                  >
                    ⚡ Dispatch Tanker
                  </button>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
