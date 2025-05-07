import L from 'leaflet';
import { getMarker } from '../constants/constants';

export const updateGeoJsonLayer = (
    layerRef: React.RefObject<L.GeoJSON | null>,
    data: GeoJSON.GeoJsonObject,
    map: L.Map,
    color: string,
    weight: number = 2
) => {
    const geoJsonOptions: L.GeoJSONOptions = {
        style: () => ({
            color: color,
            weight: weight
        })
    };

    if (layerRef.current) {
        layerRef.current.clearLayers();
        layerRef.current.addData(data);
    } else {
        layerRef.current = L.geoJSON(data, geoJsonOptions).addTo(map);
    }
};

export const removeGeoJsonLayer = (
    layerRef: React.RefObject<L.GeoJSON | null>
) => {
    if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
    }
}

export const updateGeoJsonLayerMarkers = (
    layerRef: React.RefObject<L.GeoJSON | null>,
    data: GeoJSON.GeoJsonObject,
    map: L.Map,
    markerColor: string = 'blue'
) => {
    let icon = getMarker(markerColor);

    if (layerRef.current) {
        layerRef.current.clearLayers();
        layerRef.current.addData(data);
    } else {
        layerRef.current = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                if (feature.properties.fclass === 'monument')
                    icon = getMarker('violet');
                else if (feature.properties.fclass === 'park' || feature.properties.fclass === 'viewpoint')
                    icon = getMarker('green');
                else
                    icon = getMarker('blue');

                return L.marker(latlng, { icon })
                    .bindTooltip(feature.properties.name, {
                        permanent: false,
                        direction: 'bottom'
                    });
            }
        }).addTo(map)
    }
};
