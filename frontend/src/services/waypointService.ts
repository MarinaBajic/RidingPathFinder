import { API_BASE } from "./mapService";


export const fetchNearbyFromRoad = async (road_id: number) => {
	const res = await fetch(`${API_BASE}/waypoints/nearby-road?roadId=${road_id}`);
	return await res.json()
}

export const fetchNearbyFromLocation = async (lat: number, lng: number, radius: number) => {
	const res = await fetch(`${API_BASE}/waypoints/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
	return await res.json();
};

export const fetchNearbyFromWaypoint = async (id: number, radius: number) => {
	const res = await fetch(`${API_BASE}/waypoints/${id}/nearby?radius=${radius}`);
	return await res.json();
};

export const deleteWaypoint = async (id: number) => {
	const res = await fetch(`${API_BASE}/waypoints/${id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});
	if (res.status === 404) {
		throw new Error("Failed to delete waypoint");
	}
	return res.ok;
}

export const fetchWaypoints = async (bounds: L.LatLngBounds, zoom: number) => {
	const res = await fetch(`${API_BASE}/waypoints?minLng=${bounds.getWest()}&minLat=${bounds.getSouth()}&maxLng=${bounds.getEast()}&maxLat=${bounds.getNorth()}&zoom=${zoom}`);
	return await res.json();
};

export const saveWaypoint = async (name: string, fclass: string, lat: number, lng: number) => {
	const res = await fetch(`${API_BASE}/waypoints`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, fclass, latitude: lat, longitude: lng }),
	});
	return res.ok;
};
