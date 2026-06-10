import { useMemo } from 'react';

/**
 * Detecta si el usuario está en un dispositivo móvil.
 *
 * Por qué no lo calculamos fuera del hook (module-level):
 * En entornos con SSR o bundlers que pre-evalúan módulos, `navigator` puede
 * ser `undefined` al importar el módulo, haciendo que la detección siempre
 * retorne `false`. Dentro de un hook, se garantiza ejecución en el cliente.
 *
 * La regex cubre todos los UAs comunes: Samsung Internet, Opera Mobile,
 * Firefox Mobile, MIUI Browser, etc. — no solo Chrome/Safari.
 */
export function useIsMobile(): boolean {
  return useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|Samsung/i.test(
      navigator.userAgent
    );
  }, []);
}
