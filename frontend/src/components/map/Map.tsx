import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapProps {
	mapRef: React.RefObject<L.Map | null>;
	onInit?: () => void;
}

const Map = ({ mapRef, onInit }: MapProps) => {
	const mapContainer = useRef(null);
	let highlightLayer: L.Layer | null = null;

	const highlightFeature = (url: string, propertyName: string) => {
		if (highlightLayer && mapRef.current) {
			mapRef.current.removeLayer(highlightLayer);
			highlightLayer = null;
		}

		fetch(url)
			.then(res => res.json())
			.then(data => {
				highlightLayer = L.geoJSON(data, {
					style: { color: 'red', weight: 3 },
					onEachFeature: (feature, layer) => {
						layer.bindPopup(`${feature.properties[propertyName] || 'No name'}`);
					}
				}).addTo(mapRef.current!);

				mapRef.current?.fitBounds((highlightLayer as L.GeoJSON).getBounds());
			});
	};

	useEffect(() => {
		if (mapContainer.current && !mapRef.current) {
			mapRef.current = L.map(mapContainer.current).setView([45.2671, 19.8335], 13);

			const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
			}).addTo(mapRef.current);

			const raster = L.tileLayer.wms('http://localhost:8080/geoserver/ne/wms', {
				layers: 'ne:world',
				format: 'image/png',
				transparent: true
			});

			const opstine = L.geoJSON(null, {
				onEachFeature: (feature, layer) => {
					layer.bindPopup(feature.properties.NAME_2 || 'No name');
					layer.on('click', () => {
						const name = feature.properties.NAME_2;
						const url = `http://localhost:8080/geoserver/rpf/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=rpf:opstine&outputFormat=application/json&cql_filter=NAME_2='${name}'`;
						highlightFeature(url, 'NAME_2');
					});
				}
			});
			fetch("http://localhost:8080/geoserver/rpf/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=rpf%3Aopstine&outputFormat=application%2Fjson")
				.then(res => res.json())
				.then(data => opstine.addData(data));

			const okruzi = L.geoJSON(null, {
				onEachFeature: (feature, layer) => {
					layer.bindPopup(feature.properties.NAME_1 || 'No name');
					layer.on('click', () => {
						const name = feature.properties.NAME_1;
						const url = `http://localhost:8080/geoserver/rpf/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=rpf:okruzi&outputFormat=application/json&cql_filter=NAME_1='${name}'`;
						highlightFeature(url, 'NAME_1');
					});
				}
			});
			fetch("http://localhost:8080/geoserver/rpf/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=rpf%3Aokruzi&outputFormat=application%2Fjson")
				.then(res => res.json())
				.then(data => okruzi.addData(data));


			const baseLayers = {
				'OpenStreetMap': osm,
				'NaturalEarth Map': raster,
			};

			const overlays = {
				"Show Districts": okruzi,
				"Show Municipalities": opstine
			};

			L.control.layers(baseLayers, overlays).addTo(mapRef.current);

			mapRef.current.on('overlayremove', () => {
				if (highlightLayer) {
					mapRef.current?.removeLayer(highlightLayer);
					highlightLayer = null;
				}
			});

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
			className="h-[90dvh] w-full shadow-lg rounded-sm mx-auto"
		/>
	);
};

export default Map;
