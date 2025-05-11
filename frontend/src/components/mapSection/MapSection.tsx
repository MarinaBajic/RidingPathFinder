import { useEffect, useRef, useState } from "react";
import Button from "../button/Button";
import Map from "../map/Map";
import Instructions from "../instructions/Instructions";
import { deleteWaypoint, fetchNearbyFromPath, fetchNearbyFromRoad, fetchWaypoints, saveWaypoint } from "../../services/waypointService";
import { removeGeoJsonLayer, updateGeoJsonLayer, updateGeoJsonLayerMarkers } from "../../utils/geoJsonUtils";
import L from "leaflet";
import { fetchRoads } from "../../services/roadService";
import { Waypoint } from "../../types/Waypoint";
import { getMarker } from "../../constants/constants";
import Details from "../details/Details";
import Swal from "sweetalert2";
import { fetchPathInfo, fetchPaths } from "../../services/pathService";
import { Path } from "../../types/Path";

const MapSection = () => {
    const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
    const [selectedPath, setSelectedPath] = useState<Path | null>(null);
    const [radius, setRadius] = useState<number>(1000);

    const [isMapReady, setIsMapReady] = useState(false);
    const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
    const [isDisplayingPaths, setIsDisplayingPaths] = useState(false);

    const mapRef = useRef<L.Map | null>(null);

    const roadLayerRef = useRef<L.GeoJSON | null>(null);
    const waypointLayerRef = useRef<L.GeoJSON | null>(null);
    const pathLayerRef = useRef<L.GeoJSON | null>(null);
    const highlightedWaypointsLayerRef = useRef<L.GeoJSON | null>(null);

    const popupRef = useRef<L.Popup | null>(null);
    const selectedMarkerRef = useRef<L.Marker | null>(null);
    const circleRef = useRef<L.Circle | null>(null);

    const togglePaths = () => setIsDisplayingPaths(prev => !prev)
    const toggleAddingWaypoint = () => setIsAddingWaypoint(prev => !prev)

    const setupLayerClick = (layerRef: React.RefObject<L.GeoJSON | null>, handleClick: (layer: L.Layer) => Promise<void>) => {
        layerRef.current?.eachLayer(layer => {
            layer.on('click', () => handleClick(layer));
        });
    };

    const displayRoads = async () => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        try {
            const data = await fetchRoads(map.getBounds(), map.getZoom());
            updateGeoJsonLayer(roadLayerRef, data, map, 'grey');
        } catch (error) {
            console.error('Error fetching roads:', error);
        }
    };

    const displayPaths = async () => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        try {
            const data = await fetchPaths();
            updateGeoJsonLayer(pathLayerRef, data, map, 'red', 6);
            setupLayerClick(pathLayerRef, handlePathClick);
        } catch (error) {
            console.error('Error fetching roads:', error);
        }
    };

    const displayWaypoints = async () => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        try {
            const data = await fetchWaypoints(map.getBounds(), map.getZoom());
            updateGeoJsonLayerMarkers(waypointLayerRef, data, map);
            setupLayerClick(waypointLayerRef, handleWaypointClick);
        } catch (error) {
            console.error('Error fetching waypoints:', error);
        }
    };

    const handlePathClick = async (layer: L.Layer) => {
        const pathId = (layer as L.Layer & { feature: { properties: { path_id: number } } }).feature.properties.path_id;
        const roadId = (layer as L.Layer & { feature: { properties: { road_id: number } } }).feature.properties.road_id;
        try {
            const data: Path = await fetchPathInfo(pathId);
            setSelectedPath(data);

            const nearbyWaypoints = await fetchNearbyFromPath(pathId);
            console.log('Nearby waypoints:', nearbyWaypoints);
            
        }
        catch (error) {
            console.error('Error fetching path info:', error);
        }
    };

    const handleWaypointClick = async (layer: L.Layer) => {
        resetMarkers();

        const coordinates = (layer as L.Layer & { feature: { geometry: { coordinates: number[] } } }).feature.geometry.coordinates;
        const properties = (layer as L.Layer & { feature: { properties: { id: number, name: string, fclass: string } } }).feature.properties;

        const data: Waypoint = {
            id: properties.id,
            name: properties.name,
            fclass: properties.fclass,
            latitude: coordinates[1],
            longitude: coordinates[0],
        };

        setSelectedWaypoint(data);

        const icon = getMarker('orange');
        selectedMarkerRef.current = L.marker([data.latitude, data.longitude], {
            icon,
            zIndexOffset: 1
        }).addTo(mapRef.current!);

        circleRef.current = L.circle([data.latitude, data.longitude], {
            radius,
            color: 'orange',
            fillColor: 'orange',
            fillOpacity: 0.2,
            weight: 1
        }).addTo(mapRef.current!);
    };

    const resetMarkers = () => {
        selectedMarkerRef.current?.remove();
        selectedMarkerRef.current = null;

        circleRef.current?.remove();
        circleRef.current = null;

        highlightedWaypointsLayerRef.current?.clearLayers();
        highlightedWaypointsLayerRef.current = null;
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (!mapRef.current) return;

        if (isAddingWaypoint) {
            const { lat, lng } = e.latlng;
            openSaveWaypointPopup(lat, lng);
        }
        resetMarkers();
        setSelectedWaypoint(null);
        setSelectedPath(null);
    };

    const handleSaveWaypoint = async (
        lat: number, lng: number, popup?: L.Popup | null
    ) => {
        const { value: name } = await Swal.fire({
            title: 'Enter waypoint name',
            input: 'text',
            inputPlaceholder: 'Waypoint name',
            showCancelButton: true,
        });
        if (!name) return;

        const { value: description } = await Swal.fire({
            title: 'Select description',
            input: 'select',
            inputOptions: {
                'monument': 'Monument 🏛️',
                'viewpoint': 'Viewpoint 🔭',
                'park': 'Park 🌳',
                'drinking_water': 'Drinking Water 💧',
            },
            inputPlaceholder: 'Select a description',
            showCancelButton: true,
        });
        if (!description) return;

        const success = await saveWaypoint(name, description, lat, lng);

        if (success) {
            Swal.fire('Saved!', 'Waypoint saved! ✅', 'success');
            displayWaypoints();
            popup?.remove();
        } else {
            Swal.fire('Oops!', 'Failed to save waypoint. 😢', 'error');
        }
    };

    const handleDeleteWaypoint = async (
        id: number, popup?: L.Popup | null,
    ) => {
        const success = await deleteWaypoint(id);
        if (success) {
            Swal.fire('Deleted!', 'Waypoint deleted!', 'success');
            setSelectedWaypoint(null);
            displayWaypoints();
            popup?.remove();
            resetMarkers();
        } else {
            Swal.fire('Oops!', 'Failed to delete waypoint. 😢', 'error');
        }
    };

    const openSaveWaypointPopup = (lat: number, lng: number) => {
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <div style="font-family: sans-serif;">
                <p style="font-size: 1rem; font-weight: bold;">Save this location as a waypoint?</p>
                <button id="save-waypoint" style="padding: 4px 8px; color: white; background-color: MediumSeaGreen; border: 1px solid green; border-radius: 4px; cursor:pointer;">Save</button>
            </div>
        `;

        popupContent.querySelector('#save-waypoint')?.addEventListener('click', () => {
            handleSaveWaypoint(lat, lng, popupRef.current);
            setIsAddingWaypoint(false);
        });

        popupRef.current = L.popup().setLatLng([lat, lng]).setContent(popupContent).openOn(mapRef.current!);
    };


    useEffect(() => {
        if (!mapRef.current || !isMapReady) return;
        const map = mapRef.current;

        map.on('moveend', displayWaypoints);
        map.on("click", handleMapClick);

        if (isDisplayingPaths) {
            removeGeoJsonLayer(roadLayerRef);
            displayPaths();
        }
        else {
            map.on('moveend', displayRoads)
            removeGeoJsonLayer(pathLayerRef);
            displayRoads()
        };

        displayWaypoints();
        resetMarkers();

        return () => {
            map.off('moveend', displayRoads);
            map.off('moveend', displayWaypoints);
            map.off("click", handleMapClick);
        };
    }, [isDisplayingPaths, isAddingWaypoint, isMapReady]);


    return (
        <div className="full-width bg-(--color-dark) scroll-mt-32 flex gap-4 py-16">
            <h2 className="text-center text-3xl font-bold text-white mb-8">Rides and Trails in Serbia</h2>
            <Instructions />
            <div className="flex gap-4">
                <Map mapRef={mapRef} onInit={() => setIsMapReady(true)} />
                <div className="flex gap-4 flex-col w-full max-w-[400px] mx-auto">
                    <Details
                        mapRef={mapRef}
                        circleRef={circleRef}
                        highlightedWaypointsLayerRef={highlightedWaypointsLayerRef}
                        radius={radius}
                        selectedWaypoint={selectedWaypoint}
                        selectedPath={selectedPath}
                        interactions={{
                            setRadius,
                            handleDeleteWaypoint,
                        }} />
                    {isAddingWaypoint && (
                        <p className="text-center text-white animate-pulse">
                            Click on the map to add a waypoint ✨
                        </p>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={togglePaths} >
                            {isDisplayingPaths ? 'Remove all paths' : 'Show all paths'}
                        </Button>
                        <Button onClick={toggleAddingWaypoint} hierarchy="secondary">
                            {isAddingWaypoint ? 'Cancel adding Waypoint' : 'Add new Waypoint'}
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MapSection