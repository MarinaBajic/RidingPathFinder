const API_BASE = "http://localhost:8080/api";

export const fetchRoads = async (bounds: L.LatLngBounds, zoom: number) => {
	const url = `${API_BASE}/roads?minLng=${bounds.getWest()}&minLat=${bounds.getSouth()}&maxLng=${bounds.getEast()}&maxLat=${bounds.getNorth()}&zoom=${zoom}`;
	const res = await fetch(url);
	return await res.json();
};

export const fetchWaypoints = async () => {
	const res = await fetch(`${API_BASE}/waypoints`);
	return await res.json();
};

export const saveWaypoint = async (name: string, description: string, lat: number, lng: number) => {
	const res = await fetch(`${API_BASE}/waypoints`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, description, latitude: lat, longitude: lng }),
	});
	return res.ok;
};