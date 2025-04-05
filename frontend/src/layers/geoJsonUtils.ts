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
