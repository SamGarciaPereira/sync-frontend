export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Tenta obter a localização atual do navegador. Best-effort: nunca lança —
 * devolve null se não houver suporte, se a permissão for negada ou se demorar.
 */
export function getCurrentPositionSafe(
  timeoutMs = 8000,
): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}
