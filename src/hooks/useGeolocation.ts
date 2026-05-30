import { useState, useCallback } from 'react';
import type { GeoLocation } from '@/lib/types';

// Mexico states and their approximate coordinate bounds
// Used as fallback for reverse geocoding
const MEXICO_STATES: Record<string, { latRange: [number, number]; lonRange: [number, number] }> = {
  'Aguascalientes': { latRange: [21.7, 22.5], lonRange: [-102.9, -102.0] },
  'Baja California': { latRange: [28.0, 32.7], lonRange: [-117.2, -114.7] },
  'Baja California Sur': { latRange: [22.8, 28.0], lonRange: [-115.1, -109.4] },
  'Campeche': { latRange: [17.8, 20.0], lonRange: [-92.5, -89.1] },
  'Chiapas': { latRange: [14.5, 17.6], lonRange: [-94.2, -90.4] },
  'Chihuahua': { latRange: [25.6, 31.8], lonRange: [-109.1, -103.3] },
  'Ciudad de Mexico': { latRange: [19.1, 19.6], lonRange: [-99.4, -98.9] },
  'Coahuila': { latRange: [24.5, 29.9], lonRange: [-104.0, -99.8] },
  'Colima': { latRange: [18.6, 19.5], lonRange: [-104.7, -103.5] },
  'Durango': { latRange: [22.3, 26.8], lonRange: [-107.2, -103.4] },
  'Guanajuato': { latRange: [20.0, 21.8], lonRange: [-102.1, -99.6] },
  'Guerrero': { latRange: [16.3, 18.9], lonRange: [-102.2, -98.0] },
  'Hidalgo': { latRange: [19.6, 21.4], lonRange: [-99.9, -97.9] },
  'Jalisco': { latRange: [18.9, 22.8], lonRange: [-105.7, -101.5] },
  'Mexico': { latRange: [18.3, 20.3], lonRange: [-100.6, -98.5] },
  'Michoacan': { latRange: [17.9, 20.4], lonRange: [-103.7, -100.1] },
  'Morelos': { latRange: [18.3, 19.1], lonRange: [-99.5, -98.6] },
  'Nayarit': { latRange: [20.6, 23.1], lonRange: [-105.8, -103.7] },
  'Nuevo Leon': { latRange: [23.2, 27.8], lonRange: [-101.2, -98.4] },
  'Oaxaca': { latRange: [15.6, 18.7], lonRange: [-98.1, -93.9] },
  'Puebla': { latRange: [17.8, 20.6], lonRange: [-99.1, -96.7] },
  'Queretaro': { latRange: [20.0, 21.7], lonRange: [-100.6, -99.0] },
  'Quintana Roo': { latRange: [18.5, 21.6], lonRange: [-89.4, -86.7] },
  'San Luis Potosi': { latRange: [21.2, 24.3], lonRange: [-102.3, -98.3] },
  'Sinaloa': { latRange: [22.5, 26.9], lonRange: [-109.5, -105.4] },
  'Sonora': { latRange: [26.3, 32.5], lonRange: [-115.1, -108.4] },
  'Tabasco': { latRange: [17.2, 18.7], lonRange: [-94.1, -91.0] },
  'Tamaulipas': { latRange: [22.2, 27.7], lonRange: [-100.2, -97.1] },
  'Tlaxcala': { latRange: [19.1, 19.7], lonRange: [-98.7, -97.6] },
  'Veracruz': { latRange: [17.1, 22.5], lonRange: [-98.7, -93.6] },
  'Yucatan': { latRange: [19.6, 21.7], lonRange: [-91.0, -87.5] },
  'Zacatecas': { latRange: [21.0, 25.1], lonRange: [-104.4, -101.6] },
};

function estimateState(lat: number, lon: number): string {
  for (const [state, bounds] of Object.entries(MEXICO_STATES)) {
    if (
      lat >= bounds.latRange[0] && lat <= bounds.latRange[1] &&
      lon >= bounds.lonRange[0] && lon <= bounds.lonRange[1]
    ) {
      return state;
    }
  }
  return 'Desconocido';
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async (): Promise<GeoLocation | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocalización no disponible en este navegador');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false, // We only need approximate location
          timeout: 15000,
          maximumAge: 300000, // 5 min cache is fine for municipality-level
        });
      });

      const { latitude, longitude } = position.coords;

      // Try reverse geocoding with Nominatim (free, no API key)
      let municipality = 'Desconocido';
      let state = 'Desconocido';

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es&zoom=10`,
          { headers: { 'User-Agent': 'DatosChain-Beta/1.0' } }
        );
        const data = await res.json();
        const addr = data.address || {};

        municipality = addr.city || addr.town || addr.municipality || addr.county || 'Desconocido';
        state = addr.state || estimateState(latitude, longitude);
      } catch {
        // Fallback to coordinate-based estimation
        state = estimateState(latitude, longitude);
      }

      const geo: GeoLocation = { municipality, state, latitude, longitude };
      setLocation(geo);
      return geo;
    } catch (err) {
      const msg = err instanceof GeolocationPositionError
        ? getGeoErrorMessage(err)
        : err instanceof Error
          ? err.message
          : 'Error al obtener ubicación';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, error, requestLocation };
}

function getGeoErrorMessage(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return 'Permiso de ubicación denegado. Habilita el GPS en tu dispositivo.';
    case err.POSITION_UNAVAILABLE:
      return 'No se pudo determinar tu ubicación. Verifica tu conexión.';
    case err.TIMEOUT:
      return 'La solicitud de ubicación tardó demasiado. Intenta de nuevo.';
    default:
      return 'Error desconocido al obtener ubicación.';
  }
}
