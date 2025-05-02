import { API_BASE } from "./mapService";

export const fetchPois = async (bounds: L.LatLngBounds, zoom: number) => {
	const res = await fetch(`${API_BASE}/pois?minLng=${bounds.getWest()}&minLat=${bounds.getSouth()}&maxLng=${bounds.getEast()}&maxLat=${bounds.getNorth()}&zoom=${zoom}`);
	return await res.json();
};