import L from 'leaflet';

export const updateGeoJsonLayer = (
    layerRef: React.RefObject<L.GeoJSON | null>,
    data: GeoJSON.GeoJsonObject,
    map: L.Map
) => {
    if (layerRef.current) {
        layerRef.current.clearLayers();
        layerRef.current.addData(data);
    } else {
        layerRef.current = L.geoJSON(data).addTo(map);
    }
};

export const updateGeoJsonLayerMarkers = (
    layerRef: React.RefObject<L.GeoJSON | null>,
    data: GeoJSON.GeoJsonObject,
    map: L.Map,
    markerColor: string
) => {
    const icon = L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${markerColor}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

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
