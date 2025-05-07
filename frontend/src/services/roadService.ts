import { API_BASE } from "./mapService";

// FAILED PATH FINDING
// export const fetchPath = async (bounds: L.LatLngBounds, startId: number, endId: number) => {
// 	const url = `${API_BASE}/roads/path?minLng=${bounds.getWest()}&minLat=${bounds.getSouth()}&maxLng=${bounds.getEast()}&maxLat=${bounds.getNorth()}&startId=${startId}&endId=${endId}`;
// 	const res = await fetch(url);
// 	return await res.json();
// }

export const fetchRoads = async (bounds: L.LatLngBounds, zoom: number) => {
	const url = `${API_BASE}/roads?minLng=${bounds.getWest()}&minLat=${bounds.getSouth()}&maxLng=${bounds.getEast()}&maxLat=${bounds.getNorth()}&zoom=${zoom}`;
	const res = await fetch(url);
	return await res.json();
};
