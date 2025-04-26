import L from 'leaflet';
import { getMarker } from '../constants/constants';

export const updateGeoJsonLayer = (
    layerRef: React.RefObject<L.GeoJSON | null>,
    data: GeoJSON.GeoJsonObject,
    map: L.Map,
    color: string
) => {
    const geoJsonOptions: L.GeoJSONOptions = {
        style: () => ({
            color: color
        })
    };

    if (layerRef.current) {
        layerRef.current.clearLayers();
        layerRef.current.addData(data);
    } else {
        layerRef.current = L.geoJSON(data, geoJsonOptions).addTo(map);
    }
};

export const updateGeoJsonLayerMarkers = (
    layerRef: React.RefObject<L.GeoJSON | null>,
    data: GeoJSON.GeoJsonObject,
    map: L.Map,
    markerColor: string
) => {
    const icon = getMarker(markerColor);

    if (layerRef.current) {
        layerRef.current.clearLayers();
        layerRef.current.addData(data);
    } else {
        layerRef.current = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, { icon })
                    .bindTooltip(feature.properties.name, {
                        permanent: false,
                        direction: 'bottom'
                    });
            }
        }).addTo(map)
    }
};
