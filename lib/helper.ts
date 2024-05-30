import { Map } from "mapbox-gl";

export const randomPoints = (numPoints: number, bounds: [number, number, number, number]) => {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  const points = [];
  for (let i = 0; i < numPoints; i++) {
      const lng = Math.random() * (maxLng - minLng) + minLng;
      const lat = Math.random() * (maxLat - minLat) + minLat;
      points.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] } });
  }
  return points;
};

export const spinGlobe = (map: React.MutableRefObject<Map | null>, spinEnabled: boolean ) => {
    const secondsPerRevolution = 120;
    const maxSpinZoom = 3;
    const slowSpinZoom = 3;

    if (!map.current) return;
    const zoom = map.current.getZoom();
    if (spinEnabled && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.current.getCenter();
      center.lng -= distancePerSecond;
      map.current.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  };