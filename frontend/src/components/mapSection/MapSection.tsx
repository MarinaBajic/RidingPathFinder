import { useEffect, useRef, useState } from "react";
import Button from "../button/Button";
import Map from "../map/Map";
import Instructions from "../instructions/Instructions";
import { deleteWaypoint, fetchNearbyFromWaypoint, fetchWaypointInfo, fetchWaypoints, saveWaypoint } from "../../services/waypointService";
import { updateGeoJsonLayer, updateGeoJsonLayerMarkers } from "../../utils/geoJsonUtils";
import L from "leaflet";
import { fetchPath, fetchRoads } from "../../services/roadService";
import { Waypoint } from "../../types/Waypoint";
import { getMarker } from "../../constants/constants";
import Details from "../details/Details";

const MapSection = () => {
    const [isMapReady, setIsMapReady] = useState(false);
    const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
    const [radius, setRadius] = useState<number>(10000);

    const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
    const [highlightedWaypoints, setHighlightedWaypoints] = useState<GeoJSON.Feature[]>([]);

    const mapRef = useRef<L.Map | null>(null);
    const popupRef = useRef<L.Popup | null>(null);
    const roadLayerRef = useRef<L.GeoJSON | null>(null);
    const pathLayerRef = useRef<L.GeoJSON | null>(null);
    const waypointLayerRef = useRef<L.GeoJSON | null>(null);
    const highlightLayerRef = useRef<L.GeoJSON | null>(null);

    const greenMarkerRef = useRef<L.Marker | null>(null);
    const circleRef = useRef<L.Circle | null>(null);

    const setupLayerClick = (layerRef: React.RefObject<L.GeoJSON | null>) => {
        layerRef.current?.eachLayer(layer => {
            layer.on('click', () => handleWaypointClick(layer));
        });
    };

    const displayRoads = async () => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        const bounds = map.getBounds();
        const zoom = map.getZoom();

        try {
            const data = await fetchRoads(bounds, zoom);
            updateGeoJsonLayer(roadLayerRef, data, map, 'blue');
        } catch (error) {
            console.error('Error fetching roads:', error);
        }
    };

    const displayWaypoints = async () => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        try {
            const data = await fetchWaypoints();
            updateGeoJsonLayerMarkers(waypointLayerRef, data, map, 'blue');
            setupLayerClick(waypointLayerRef);
        } catch (error) {
            console.error('Error fetching waypoints:', error);
        }
    };

    const displayPath = async (endWaypointId: number) => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        const bounds = map.getBounds();

        try {
            const data = await fetchPath(bounds, selectedWaypoint?.id as number, endWaypointId as number);
            updateGeoJsonLayer(pathLayerRef, data, map, 'red');
            // roadLayerRef.current?.clearLayers();
            console.log('Path data:', data);
        } catch (error) {
            console.error('Error fetching roads:', error);
        }
    };

    const handleWaypointClick = async (layer: L.Layer) => {
        const id = (layer as L.Layer & { feature: { properties: { id: number } } }).feature.properties.id;
        try {
            resetMarkers();
            const data: Waypoint = await fetchWaypointInfo(id);
            setSelectedWaypoint(data);

            const icon = getMarker('green');
            greenMarkerRef.current = L.marker([data.latitude, data.longitude], {
                icon,
                zIndexOffset: 1
            }).addTo(mapRef.current!);

            circleRef.current = L.circle([data.latitude, data.longitude], {
                radius,
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.2,
                weight: 1
            }).addTo(mapRef.current!);

            mapRef.current?.setView([data.latitude, data.longitude], 11);

            highlightNearbyWaypoints(id);
        }
        catch (error) {
            console.error('Error fetching waypoint info:', error);
        }
    };

    const highlightNearbyWaypoints = async (id: number) => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        try {
            const data = await fetchNearbyFromWaypoint(id, radius);
            setHighlightedWaypoints(data.features);
            updateGeoJsonLayerMarkers(highlightLayerRef, data, map, 'red');
            setupLayerClick(highlightLayerRef);
        } catch (error) {
            console.error('Error fetching nearby waypoints:', error);
        }
    };

    const resetMarkers = () => {
        greenMarkerRef.current?.remove();
        greenMarkerRef.current = null;
        circleRef.current?.remove();
        circleRef.current = null;
        highlightLayerRef.current?.clearLayers();
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (!mapRef.current) return;

        if (isAddingWaypoint) {
            const { lat, lng } = e.latlng;
            openSaveWaypointPopup(lat, lng);
        }
        resetMarkers();
        setSelectedWaypoint(null);
    };

    const handleSaveWaypoint = async (
        lat: number, lng: number, popup?: L.Popup | null
    ) => {
        const name = prompt("Enter waypoint name:");
        if (!name) return;

        const description = prompt("Enter description:");
        if (!description) return;

        const success = await saveWaypoint(name, description, lat, lng);

        if (success) {
            alert("Waypoint saved!");
            displayWaypoints();
            popup?.remove();
        } else {
            alert("Failed to save waypoint.");
        }
    };

    const handleDeleteWaypoint = async (
        id: number, popup?: L.Popup | null,
    ) => {
        const success = await deleteWaypoint(id);
        if (success) {
            alert("Waypoint deleted!");
            setSelectedWaypoint(null);
            displayWaypoints();
            popup?.remove();
            resetMarkers();
        } else {
            alert("Failed to delete waypoint.");
        }
    };

    const openSaveWaypointPopup = (lat: number, lng: number) => {
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <div style="font-family: sans-serif;">
                <p style="font-size: 1rem; font-weight: bold;">Save this location as a waypoint?</p>
                <button id="save-waypoint" style="padding: 4px 8px; border: 1px solid green; border-radius: 4px; cursor:pointer;">Save</button>
            </div>
        `;

        popupContent.querySelector('#save-waypoint')?.addEventListener('click', () => {
            handleSaveWaypoint(lat, lng, popupRef.current);
            setIsAddingWaypoint(false);
        });

        popupRef.current = L.popup().setLatLng([lat, lng]).setContent(popupContent).openOn(mapRef.current!);
    };

    const openDeleteWaypointPopup = (id: number, lat: number, lng: number) => {
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <div style="font-family: sans-serif;">
                <p style="font-size: 1rem; font-weight: bold;">Delete this waypoint?</p>
                <button id="delete-waypoint" style="padding: 4px 8px; border: 1px solid red; border-radius: 4px; cursor:pointer;">Delete</button>
            </div>
        `;

        popupContent.querySelector('#delete-waypoint')?.addEventListener('click', () => {
            handleDeleteWaypoint(id, popupRef.current);
        });

        popupRef.current = L.popup({ offset: L.point(0, -20) }).setLatLng([lat, lng]).setContent(popupContent).openOn(mapRef.current!);
    };


    useEffect(() => {
        if (!mapRef.current || !circleRef.current) return;
        const bounds = circleRef.current.getBounds();
        mapRef.current.fitBounds(bounds, { padding: [30, 30] });
    }, [radius]);


    useEffect(() => {
        if (!mapRef.current || !isMapReady) return;
        const map = mapRef.current;

        map.on('moveend', displayRoads);
        map.on('zoomend', displayRoads);
        map.on("click", handleMapClick);

        displayRoads();
        displayWaypoints();
        resetMarkers();

        return () => {
            map.off('moveend', displayRoads);
            map.off('zoomend', displayRoads);
            map.off("click", handleMapClick);
        };
    }, [isAddingWaypoint, isMapReady]);

    return (
        <div className="full-width bg-(--color-dark) scroll-mt-32 py-16">
            <h2 className="text-center text-3xl font-bold text-white mb-8">Rides and Trails in Serbia</h2>
            <div className="flex gap-4">
                <Map mapRef={mapRef} onInit={() => setIsMapReady(true)} />
                <div className="flex gap-4 flex-col w-full max-w-[400px] mx-auto">
                    <Instructions />
                    <Details
                        circleRef={circleRef}
                        radius={radius}
                        selectedWaypoint={selectedWaypoint}
                        highlightedWaypoints={highlightedWaypoints}
                        interactions={{
                            setRadius,
                            openDeleteWaypointPopup,
                            highlightNearbyWaypoints,
                            displayPath
                        }} />
                    {isAddingWaypoint && (
                        <p className="text-center text-white animate-pulse">
                            Click on the map to add a waypoint ✨
                        </p>
                    )}
                    <Button onClick={() => setIsAddingWaypoint(prev => !prev)}>
                        {isAddingWaypoint ? 'Cancel adding Waypoint' : 'Add new Waypoint'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MapSection