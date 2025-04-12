import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { deleteWaypoint, fetchWaypointInfo, fetchWaypoints } from "../../services/waypointService";
import { fetchRoads } from "../../services/roadService";
import { updateGeoJsonLayer } from '../../utils/geoJsonUtils';
import { handleSaveWaypointPopup } from '../../utils/popupUtils';

interface MapProps {
	isAddingWaypoint: boolean;
	setIsAddingWaypoint: Dispatch<SetStateAction<boolean>>;
}

const Map = ({ isAddingWaypoint, setIsAddingWaypoint }: MapProps) => {
	const mapContainer = useRef(null);
	const mapRef = useRef<L.Map | null>(null);
	const roadLayerRef = useRef<L.GeoJSON | null>(null);
	const waypointLayerRef = useRef<L.GeoJSON | null>(null);
	const popupRef = useRef<L.Popup | null>(null);

	const [roads, setRoads] = useState([]);
	const [waypoints, setWaypoints] = useState([]);

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

			waypointLayerRef.current?.eachLayer((layer) => {
				layer.on('click', async () => {
					const id = (layer as L.Layer & { feature: { properties: { id: number } } }).feature.properties.id;
					try {
						const waypointData = await fetchWaypointInfo(id);
						if (popupRef.current) {
							popupRef.current.remove();
						}
						popupRef.current = L.popup()
							.setLatLng((layer as L.Marker).getLatLng())
							.setContent(`Name: ${waypointData.name}<br>
										Description: ${waypointData.description}<br><br>
										<button id="delete-waypoint-btn">🗑️ Delete</button>`)
							.openOn(mapRef.current!);

						setTimeout(() => {
							const btn = document.getElementById('delete-waypoint-btn');
							if (btn) {
								btn.addEventListener('click', async () => {
									try {
										await deleteWaypoint(id);
										popupRef.current?.remove();
										await handleFetchWaypoints(); // refresh map
									} catch (err) {
										console.error('Error deleting waypoint:', err);
									}
								});
							}
						}, 0);

					}
					catch (error) {
						console.error('Error fetching waypoint info:', error);
					}
				});
			});

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
		<div
			id='map'
			ref={mapContainer}
			className="h-[70dvh] w-full shadow-lg rounded-xl mx-auto"
		/>
	);
};

export default Map;
