import { API_BASE } from "./mapService";


export const fetchWaypointInfo = async (id: number) => {
	const res = await fetch(`${API_BASE}/waypoints/${id}`);
	if (res.status === 404) {
		throw new Error("Failed to fetch waypoint data");
	}
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
