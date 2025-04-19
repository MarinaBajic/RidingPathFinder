import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapProps {
	mapRef: React.RefObject<L.Map | null>;
	onInit?: () => void;
}

const Map = ({ mapRef, onInit }: MapProps) => {
	const mapContainer = useRef(null);

	useEffect(() => {
		if (mapContainer.current && !mapRef.current) {
			mapRef.current = L.map(mapContainer.current).setView([45.2671, 19.8335], 13);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
			}).addTo(mapRef.current);

			onInit?.();
		}

		return () => {
			mapRef.current?.remove();
			mapRef.current = null;
		};
	}, []);

	return (
		<div
			id='map'
			ref={mapContainer}
			className="h-[70dvh] w-full shadow-lg rounded-sm mx-auto"
		/>
	);
};

export default Map;
