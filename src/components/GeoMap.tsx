import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPoint {
  state: string;
  municipality: string;
  count: number;
  lat?: number;
  lng?: number;
}

interface GeoMapProps {
  locations: LocationPoint[];
  selectedState: string | null;
  onSelectState: (state: string | null) => void;
}

const MEXICO_STATE_COORDS: Record<string, [number, number]> = {
  'Aguascalientes': [21.8853, -102.2916],
  'Baja California': [32.5000, -116.0000],
  'Baja California Sur': [24.1667, -110.3000],
  'Campeche': [19.8500, -90.5333],
  'Chiapas': [16.5000, -92.5000],
  'Chihuahua': [28.6353, -106.0889],
  'Coahuila': [27.5000, -101.5000],
  'Colima': [19.2333, -103.7167],
  'Durango': [24.0167, -104.6667],
  'Guanajuato': [21.0167, -101.2500],
  'Guerrero': [17.6000, -99.5000],
  'Hidalgo': [20.1167, -98.7333],
  'Jalisco': [20.6667, -103.3333],
  'México': [19.4000, -99.1333],
  'Estado de México': [19.4000, -99.1333],
  'Michoacán': [19.7000, -101.1167],
  'Morelos': [18.7500, -99.0667],
  'Nayarit': [21.5000, -104.9000],
  'Nuevo León': [25.6667, -100.3000],
  'Oaxaca': [17.0500, -96.7167],
  'Puebla': [19.0500, -98.2000],
  'Querétaro': [20.5833, -100.3833],
  'Quintana Roo': [21.1333, -86.8667],
  'San Luis Potosí': [22.1500, -100.9833],
  'Sinaloa': [25.0000, -107.5000],
  'Sonora': [29.0000, -110.0000],
  'Tabasco': [18.0000, -92.5000],
  'Tamaulipas': [24.0000, -98.5000],
  'Tlaxcala': [19.3167, -98.2333],
  'Veracruz': [19.4333, -97.1333],
  'Yucatán': [20.9667, -89.6167],
  'Zacatecas': [22.7667, -102.5833],
  'Ciudad de México': [19.4326, -99.1332],
  '—': [23.6345, -102.5528],
};

function createIcon(state: string, isSelected: boolean, count: number) {
  const size = Math.min(24 + Math.sqrt(count) * 4, 48);
  const color = isSelected ? '#ef4444' : '#3b82f6';
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: 700;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FitBounds({ points }: { points: LocationPoint[] }) {
  const map = useMap();
  useEffect(() => {
    const valid = points.filter(p => p.lat && p.lng);
    if (valid.length > 0) {
      const bounds = L.latLngBounds(valid.map(p => [p.lat!, p.lng!]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

export default function GeoMap({ locations, selectedState, onSelectState }: GeoMapProps) {
  const points = useMemo(() =>
    locations.map(loc => {
      const coord = MEXICO_STATE_COORDS[loc.state];
      return {
        ...loc,
        lat: coord?.[0],
        lng: coord?.[1],
      };
    }),
    [locations]
  );

  const center: [number, number] = [23.6345, -102.5528]; // Mexico center

  return (
    <MapContainer
      center={center}
      zoom={5}
      className="w-full h-[400px] rounded-xl border border-border/80 z-0"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {points.map(p => {
        if (!p.lat || !p.lng) return null;
        const isSelected = selectedState === p.state;
        return (
          <Marker
            key={p.state + p.municipality}
            position={[p.lat, p.lng]}
            icon={createIcon(p.state, isSelected, p.count)}
            eventHandlers={{
              click: () => onSelectState(isSelected ? null : p.state),
            }}
          >
            <Popup>
              <div className="text-xs">
                <strong>{p.municipality}</strong>, {p.state}
                <br />
                {p.count} respuestas
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
