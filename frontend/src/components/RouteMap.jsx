import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ======== Custom icon builders ========

function createPinIcon(color, label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26C32 7.16 24.84 0 16 0z"
            fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: `<div style="position:relative;width:32px;height:42px;">
             ${svg}
             <span style="position:absolute;top:44px;left:50%;transform:translateX(-50%);
                          white-space:nowrap;font-size:9px;font-weight:700;color:${color};
                          text-shadow:0 1px 3px rgba(0,0,0,0.8);font-family:Inter,system-ui,sans-serif;">
               ${label}
             </span>
           </div>`,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
}

function createDriverIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="17" fill="#F59E0B" stroke="white" stroke-width="2" opacity="0.9"/>
      <circle cx="18" cy="18" r="10" fill="rgba(0,0,0,0.15)"/>
      <path d="M12 20h12M12 20l1-4h10l1 4M14 16v-2h8v2M13 20v2h2v-2M21 20v2h2v-2"
            stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

// ======== Map bounds fitter ========

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    }
  }, [map, points]);
  return null;
}

// ======== OSRM route fetcher ========

async function fetchOSRMRoute(originLat, originLng, destLat, destLng) {
  const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM ${res.status}`);
  const data = await res.json();
  if (!data.routes || data.routes.length === 0) throw new Error('No routes');
  const route = data.routes[0];
  const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  return {
    coords,
    distanceKm: (route.distance / 1000).toFixed(1),
    durationMin: Math.round(route.duration / 60),
  };
}

// ======== Main component ========

export default function RouteMap({
  pickupLat,
  pickupLng,
  pickupLabel = 'Whitefield CC',
  deliveryLat,
  deliveryLng,
  deliveryLabel = 'Delivery',
  onRouteInfo,
}) {
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [routeError, setRouteError] = useState(false);
  const watchIdRef = useRef(null);

  // Memoize icons so they don't re-create on every render
  const pickupIcon = useMemo(() => createPinIcon('#0A7A8F', pickupLabel), [pickupLabel]);
  const deliveryIcon = useMemo(() => createPinIcon('#F59E0B', deliveryLabel), [deliveryLabel]);
  const driverIcon = useMemo(() => createDriverIcon(), []);

  // ---- Fetch OSRM route ----
  useEffect(() => {
    let cancelled = false;
    async function loadRoute() {
      try {
        const result = await fetchOSRMRoute(pickupLat, pickupLng, deliveryLat, deliveryLng);
        if (cancelled) return;
        setRouteCoords(result.coords);
        setRouteInfo(result);
        setRouteError(false);
        if (onRouteInfo) onRouteInfo(result);
      } catch (err) {
        console.warn('OSRM route failed, using straight line:', err.message);
        if (cancelled) return;
        setRouteCoords([
          [pickupLat, pickupLng],
          [deliveryLat, deliveryLng],
        ]);
        setRouteInfo({ distanceKm: '4.2', durationMin: 15 });
        setRouteError(true);
        if (onRouteInfo) onRouteInfo({ distanceKm: '4.2', durationMin: 15 });
      }
    }
    loadRoute();
    return () => { cancelled = true; };
  }, [pickupLat, pickupLng, deliveryLat, deliveryLng]);

  // ---- Live GPS tracking ----
  useEffect(() => {
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setDriverPos({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        console.warn('GPS unavailable:', err.message);
        // Simulate driver near pickup for demo
        setDriverPos({
          latitude: pickupLat + 0.002,
          longitude: pickupLng - 0.003,
          accuracy: 50,
        });
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [pickupLat, pickupLng]);

  // Fallback simulated driver position when GPS is denied
  useEffect(() => {
    if (driverPos) return;
    const timer = setTimeout(() => {
      if (!driverPos) {
        setDriverPos({
          latitude: pickupLat + 0.002,
          longitude: pickupLng - 0.003,
          accuracy: 100,
        });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [driverPos, pickupLat, pickupLng]);

  const fitPoints = [
    { lat: pickupLat, lng: pickupLng },
    { lat: deliveryLat, lng: deliveryLng },
  ];

  const center = [
    (pickupLat + deliveryLat) / 2,
    (pickupLng + deliveryLng) / 2,
  ];

  return (
    <div className="h-44 w-full overflow-hidden relative">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={true}
        doubleClickZoom={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <FitBounds points={fitPoints} />

        {/* Route polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#F59E0B',
              weight: 5,
              dashArray: '10 10',
              opacity: 0.85,
            }}
          />
        )}

        {/* Pickup marker */}
        <Marker position={[pickupLat, pickupLng]} icon={pickupIcon} />

        {/* Delivery marker */}
        <Marker position={[deliveryLat, deliveryLng]} icon={deliveryIcon} />

        {/* Driver marker */}
        {driverPos && (
          <Marker
            position={[driverPos.latitude, driverPos.longitude]}
            icon={driverIcon}
          />
        )}
      </MapContainer>

      {/* Route info overlay */}
      {routeInfo && (
        <div className="absolute bottom-1.5 right-1.5 z-[1000] bg-black/70 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-2">
          <span className="text-amber-400 text-[9px] font-bold">
            {routeInfo.distanceKm} km
          </span>
          <span className="text-white/20 text-[8px]">·</span>
          <span className="text-amber-400 text-[9px] font-bold">
            ~{routeInfo.durationMin} min
          </span>
          {routeError && (
            <>
              <span className="text-white/20 text-[8px]">·</span>
              <span className="text-stone-500 text-[7px]">est.</span>
            </>
          )}
        </div>
      )}

      {/* Map label overlay */}
      <div className="absolute top-1.5 left-2 z-[1000]">
        <span className="text-[7px] text-white/30 uppercase tracking-wider font-semibold">
          Bangalore — Live Route
        </span>
      </div>
    </div>
  );
}
