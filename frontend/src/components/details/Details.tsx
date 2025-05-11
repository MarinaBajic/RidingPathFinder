import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import { Waypoint } from "../../types/Waypoint";
import Swal from "sweetalert2";
import { fetchNearbyFromPath, fetchNearbyFromWaypoint } from "../../services/waypointService";
import { Path } from "../../types/Path";
import L from "leaflet";

interface DetailsProps {
    mapRef: React.RefObject<L.Map | null>;
    circleRef: React.RefObject<L.Circle | null>;
    highlightedWaypointsLayerRef: React.RefObject<L.GeoJSON | null>;
    radius: number;
    selectedWaypoint: Waypoint | null;
    selectedPath: Path | null;
    interactions: {
        setRadius: (radius: number) => void;
        handleDeleteWaypoint: (id: number) => void;
    };
}

const Details = ({ mapRef, circleRef, highlightedWaypointsLayerRef, radius, selectedWaypoint, selectedPath, interactions }: DetailsProps) => {
    const [highlightedWaypoints, setHighlightedWaypoints] = useState<GeoJSON.Feature[]>([]);

    const highlightNearbyWaypoints = async (object: any) => {
        try {
            let data;
            if ('id' in object && 'fclass' in object)
                data = await fetchNearbyFromWaypoint(object.id, radius);
            else if ('name' in object && 'description' in object)
                data = await fetchNearbyFromPath(object.id);
            else return;

            setHighlightedWaypoints(data.features);

            if (!highlightedWaypointsLayerRef.current) {
                highlightedWaypointsLayerRef.current = L.geoJSON().addTo(mapRef.current!);
            }

            highlightedWaypointsLayerRef.current.clearLayers();

            data.features.forEach((feature: { geometry: { coordinates: any; }; }) => {
                const { coordinates } = feature.geometry;
                const [lng, lat] = coordinates;

                const circle = L.circleMarker([lat, lng], {
                    radius: 6,
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 0.5,
                });

                highlightedWaypointsLayerRef.current!.addLayer(circle);
            });
        } catch (error) {
            console.error('Error fetching nearby waypoints:', error);
        }
    };


    useEffect(() => {
        setHighlightedWaypoints([]);

        if (selectedWaypoint)
            highlightNearbyWaypoints(selectedWaypoint);
        else if (selectedPath)
            highlightNearbyWaypoints(selectedPath);

        if (mapRef.current && circleRef.current) {
            circleRef.current.setRadius(radius);
            mapRef.current.fitBounds(circleRef.current.getBounds());
        }
    }, [selectedWaypoint, selectedPath, radius]);


    return (
        <div className="h-full rounded-sm shadow-lg bg-white p-4 space-y-4">
            <h3 className="text-lg font-bold">
                {selectedWaypoint ?
                    selectedWaypoint.name ? selectedWaypoint.name : "No name" :
                    selectedPath ? selectedPath.name : "Details"}
            </h3>
            <p className="text-sm text-gray-500">
                {selectedWaypoint ? selectedWaypoint.fclass :
                    selectedPath ? selectedPath.description : "Click on a marker or a path to see details ✨"}
            </p>

            {selectedWaypoint && (
                <div className="space-y-2">
                    <label
                        htmlFor="radius"
                        className="text-sm font-semibold"
                    >
                        Radius: {radius / 1000}km
                    </label>
                    <input
                        type="range"
                        id="radius"
                        min={500}
                        max={20000}
                        step={500}
                        value={radius}
                        onChange={(e) => {
                            const newRadius = Number(e.target.value);
                            interactions.setRadius(newRadius);
                        }}
                        className="w-full accent-green-700"
                    />
                </div>
            )}

            {highlightedWaypoints.length > 0 && (
                <div className="my-4">
                    <h4 className="font-semibold">Nearby waypoints:</h4>
                    <ul>
                        {highlightedWaypoints.map((feature) => {
                            const { id, name } = feature.properties as { id: number, name: string };
                            return (
                                <li key={id}>- {name}</li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {selectedWaypoint && (
                <Button
                    onClick={async () => {
                        Swal.fire({
                            title: "Are you sure?",
                            text: `You are about to delete a ${selectedWaypoint.fclass} - ${selectedWaypoint.name}!`,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, delete it!"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                interactions.handleDeleteWaypoint(selectedWaypoint.id);
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Your file has been deleted.",
                                    icon: "success"
                                });
                            }
                        });
                    }}
                    hierarchy="secondary"
                >
                    Delete selected Waypoint
                </Button>
            )}
        </div >
    );
};

export default Details;
