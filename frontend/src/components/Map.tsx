import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { fetchRoads, fetchWaypoints } from '../services/mapService';
import { updateGeoJsonLayer } from '../utils/geoJsonUtils';
import { handleSaveWaypointPopup } from '../utils/popupUtils';

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
			updateGeoJsonLayer(roadLayerRef, data, mapRef.current);
			setRoads(data);
		} catch (error) {
			console.error('Error fetching roads:', error);
		}
	};

	const handleFetchWaypoints = async () => {
		if (!mapRef.current) return;

		try {
			const data = await fetchWaypoints();
			updateGeoJsonLayer(waypointLayerRef, data, mapRef.current);
			setWaypoints(data);
		} catch (error) {
			console.error('Error fetching waypoints:', error);
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
			handleSaveWaypointPopup(lat, lng, map, popupRef, setIsAddingWaypoint, handleFetchWaypoints);
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
