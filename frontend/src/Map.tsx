import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { fetchRoads, fetchWaypoints, saveWaypoint } from './services/mapService';

const Map = () => {
	const mapContainer = useRef(null);
	const mapRef = useRef<L.Map | null>(null);
	const roadLayerRef = useRef<L.GeoJSON | null>(null);
	const waypointLayerRef = useRef<L.GeoJSON | null>(null);
	const popupRef = useRef<L.Popup | null>(null);

	const [roads, setRoads] = useState([]);
	const [waypoints, setWaypoints] = useState([]);

	const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);


	const handleFetchRoads = async () => {
		if (!mapRef.current) return;

		const bounds = mapRef.current.getBounds();
		const zoom = mapRef.current.getZoom();

		try {
			const data = await fetchRoads(bounds, zoom);
			if (roadLayerRef.current) {
				roadLayerRef.current.clearLayers();
				roadLayerRef.current.addData(data);
			} else {
				roadLayerRef.current = L.geoJSON(data).addTo(mapRef.current);
			}

			setRoads(data);
		} catch (error) {
			console.error('Error fetching roads:', error);
		}
	};

	const handleFetchWaypoints = async () => {
		if (!mapRef.current) return;

		try {
			const data = await fetchWaypoints();

			if (waypointLayerRef.current) {
				waypointLayerRef.current.clearLayers();
				waypointLayerRef.current.addData(data);

			} else {
				waypointLayerRef.current = L.geoJSON(data).addTo(mapRef.current);
			}

			setWaypoints(data);
		} catch (error) {
			console.error('Error fetching waypoints:', error);
		}
	};

	const handleSaveWaypoint = async (lat: number, lng: number) => {
		const name = prompt("Enter waypoint name:");
		if (!name) return;

		const description = prompt("Enter description:");
		if (!description) return;

		const success = await saveWaypoint(name, description, lat, lng);

		if (success) {
			alert("Waypoint saved!");
			handleFetchWaypoints(); // refresh ✨
			if (popupRef.current) {
				popupRef.current.remove(); // Close the popup
			}
		} else {
			alert("Failed to save waypoint.");
		}
	};

	useEffect(() => {
		if (mapContainer.current && !mapRef.current) {
			mapRef.current = L.map(mapContainer.current).setView([45.2671, 19.8335], 13);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
			}).addTo(mapRef.current);

			mapRef.current.on('moveend', handleFetchRoads);
			mapRef.current.on('zoomend', handleFetchWaypoints);

			handleFetchRoads();
			handleFetchWaypoints();
		}

		return () => {
			mapRef.current?.off('moveend', handleFetchRoads);
			mapRef.current?.off('zoomend', handleFetchRoads);
			mapRef.current?.remove();
			mapRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (!mapRef.current) return;

		const map = mapRef.current;

		const handleMapClick = (e: L.LeafletMouseEvent) => {
			if (!isAddingWaypoint) return;

			const { lat, lng } = e.latlng;

			const popup = L.popup()
				.setLatLng(e.latlng)
				.setContent(`
					<div>
						<p>Save this location as a waypoint?</p>
						<button id="save-waypoint" style="cursor:pointer;">Save</button>
					</div>
				`)
				.openOn(mapRef.current!);

			popupRef.current = popup;

			document.getElementById("save-waypoint")?.addEventListener("click", () => {
				handleSaveWaypoint(lat, lng);
			});

			setIsAddingWaypoint(false); // disable after adding
		};

		map.on('click', handleMapClick);

		return () => {
			map.off('click', handleMapClick);
		};
	}, [isAddingWaypoint]);


	return (
		<div>
			<div
				ref={mapContainer}
				style={{ height: '100vh', width: '100%' }}
			/>
			<button onClick={() => setIsAddingWaypoint(true)}>Add Waypoint</button>
		</div>
	);
};

export default Map;
