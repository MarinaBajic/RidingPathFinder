import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { deleteWaypoint, fetchNearbyFromWaypoint, fetchWaypointInfo, fetchWaypoints } from "../../services/waypointService";
import { fetchRoads } from "../../services/roadService";
import { updateGeoJsonLayer, updateGeoJsonLayerMarkers } from '../../utils/geoJsonUtils';
import { handleDeleteWaypointPopup, handleSaveWaypointPopup } from '../../utils/popupUtils';
import { useWaypoint } from '../../context/WaypointContext';

interface MapProps {
	isAddingWaypoint: boolean;
	setIsAddingWaypoint: Dispatch<SetStateAction<boolean>>;
	isDeletingWaypoint: boolean;
	setIsDeletingWaypoint: Dispatch<SetStateAction<boolean>>;
	radius: number;
}

const Map = ({ isAddingWaypoint, setIsAddingWaypoint, isDeletingWaypoint, setIsDeletingWaypoint, radius }: MapProps) => {
	const mapContainer = useRef(null);
	const mapRef = useRef<L.Map | null>(null);

	const roadLayerRef = useRef<L.GeoJSON | null>(null);

	const waypointLayerRef = useRef<L.GeoJSON | null>(null);
	const highlightLayerRef = useRef<L.GeoJSON | null>(null);

	const popupRef = useRef<L.Popup | null>(null);

	const [roads, setRoads] = useState([]);
	const [waypoints, setWaypoints] = useState<L.Marker[]>([]);
	const [highlightedWaypoints, setHighlightedWaypoints] = useState<L.Marker[]>([]);

	const { selected, setSelected } = useWaypoint();

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
			updateGeoJsonLayerMarkers(waypointLayerRef, data, mapRef.current, 'blue');

			waypointLayerRef.current?.eachLayer((layer) => {
				layer.on('click', async () => {
					handleWaypointClick(layer);
				});
			});

			setWaypoints(data);
		} catch (error) {
			console.error('Error fetching waypoints:', error);
		}
	};

	const handleFetchNearbyWaypoints = async (id: number) => {
		if (!mapRef.current) return;

		try {
			const data = await fetchNearbyFromWaypoint(id, radius);
			updateGeoJsonLayerMarkers(highlightLayerRef, data, mapRef.current, 'red');

			highlightLayerRef.current?.eachLayer((layer) => {
				layer.on('click', async () => {
					handleWaypointClick(layer);
				});
			});

			setHighlightedWaypoints(data);
		} catch (error) {
			console.error('Error fetching nearby waypoints:', error);
		}
	};

	const handleWaypointClick = async (layer: L.Layer) => {
		const id = (layer as L.Layer & { feature: { properties: { id: number } } }).feature.properties.id;
		try {
			const waypointData = await fetchWaypointInfo(id);
			setSelected(waypointData);

			if (popupRef.current) {
				popupRef.current.remove();
			}
			popupRef.current = L.popup({ offset: L.point(0, -20) })
				.setLatLng((layer as L.Marker).getLatLng())
				.setContent(`
					<div style="font-family: sans-serif;">
    					<p style="font-size: 1rem; font-weight: bold; margin: 0;">${waypointData.name}</p>
    					<p style="margin: 0 0 16px 0; font-size: 0.875rem; color: #555;">Check panel to the right for details.</p>
					</div>
				`)
				.openOn(mapRef.current!);

			handleFetchNearbyWaypoints(id);
		}
		catch (error) {
			console.error('Error fetching waypoint info:', error);
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

	useEffect(() => {
		if (!mapRef.current) return;
		const map = mapRef.current;

		if (isDeletingWaypoint) {
			if (selected?.id !== undefined) {
				handleDeleteWaypointPopup(selected.id, selected.latitude, selected.longitude, map, popupRef, setIsDeletingWaypoint, handleFetchWaypoints);
			}
		}

	}, [isDeletingWaypoint]);


	return (
		<div
			id='map'
			ref={mapContainer}
			className="h-[70dvh] w-full shadow-lg rounded-sm mx-auto"
		/>
	);
};

export default Map;
