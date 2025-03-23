import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

const Map = () => {
	const mapContainer = useRef(null);
	const mapRef = useRef<L.Map | null>(null);
	const roadLayerRef = useRef<L.GeoJSON | null>(null);
	const waypointLayerRef = useRef<L.GeoJSON  | null>(null);

	const [roads, setRoads] = useState([]);
	const [waypoints, setWaypoints] = useState([]);


	const fetchRoads = async () => {
		if (!mapRef.current) return;

		const bounds = mapRef.current.getBounds();
		const zoom = mapRef.current.getZoom();
		const url = `http://localhost:8080/api/roads?minLng=${bounds.getWest()}&minLat=${bounds.getSouth()}&maxLng=${bounds.getEast()}&maxLat=${bounds.getNorth()}&zoom=${zoom}`;

		try {
			const response = await fetch(url);
			const data = await response.json();

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

	const fetchWaypoints = async () => {
		if (!mapRef.current) return;

		const url = "http://localhost:8080/api/waypoints";

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (waypointLayerRef.current) {
				waypointLayerRef.current.clearLayers();
				waypointLayerRef.current.addData(data);

			} else {
				waypointLayerRef.current = L.geoJSON(data).addTo(mapRef.current);
			}

			setWaypoints(data);

			// Loop through waypoints data
			// data.forEach((waypoint: any) => {
			// 	const { name, description, location } = waypoint;
			// 	const [latitude, longitude] = location.coordinates;

			// 	// Create a marker for each waypoint
			// 	const marker = L.marker([latitude, longitude]);
			// 	marker.bindPopup(`<b>${name}</b><br>${description}`);
			// 	marker.addTo(waypointLayerRef.current!);
			// });
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

			mapRef.current.on('moveend', fetchRoads);
			mapRef.current.on('zoomend', fetchRoads);

			fetchRoads();
			fetchWaypoints();
		}

		return () => {
			mapRef.current?.off('moveend', fetchRoads);
			mapRef.current?.off('zoomend', fetchRoads);
			mapRef.current?.remove();
			mapRef.current = null;
		};
	}, []);

	return (
		<div
			ref={mapContainer}
			style={{ height: '100vh', width: '100%' }}
		/>
	);
};

export default Map;
