import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import './Details.scss'
import { Waypoint } from "../../types/Waypoint";
import Swal from "sweetalert2";
import { fetchNearbyFromWaypoint } from "../../services/waypointService";

interface DetailsProps {
    mapRef: React.RefObject<L.Map | null>;
    circleRef: React.RefObject<L.Circle | null>;
    radius: number;
    selectedWaypoint: Waypoint | null;
    interactions: {
        setRadius: (radius: number) => void;
        handleDeleteWaypoint: (id: number) => void;
        // displayPath: (endWaypointId: number) => void;
    };
}

const Details = ({ mapRef, circleRef, radius, selectedWaypoint, interactions }: DetailsProps) => {
    const [highlightedWaypoints, setHighlightedWaypoints] = useState<GeoJSON.Feature[]>([]);
    // const [endWaypointId, setEndWaypointId] = useState<number | null>(null);
    // const [optionalWaypointsIds, setOptionalWaypointsIds] = useState<number[]>([]);

    // const [isLoading, setIsLoading] = useState(false);
    // const isFindPathsBtnDisabled = !endWaypointId;
    // const filteredWaypoints = highlightedWaypoints.filter(
    //     (feature) => feature.properties?.id !== endWaypointId
    // );

    const highlightNearbyWaypoints = async (id: number) => {
        try {
            const data = await fetchNearbyFromWaypoint(id, radius);
            setHighlightedWaypoints(data.features);
        } catch (error) {
            console.error('Error fetching nearby waypoints:', error);
        }
    };

    // const handleWaypointCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    //     if (e.target.checked) {
    //         setOptionalWaypointsIds((prev: number[]) => [...prev, id]);
    //     } else {
    //         setOptionalWaypointsIds((prev: number[]) => prev.filter(wp => wp !== id));
    //     }
    // };


    useEffect(() => {
        // setEndWaypointId(null);
        // setOptionalWaypointsIds([]);

        if (selectedWaypoint) {
            highlightNearbyWaypoints(selectedWaypoint.id);
        }
        if (mapRef.current && circleRef.current) {
            circleRef.current.setRadius(radius);
            mapRef.current.fitBounds(circleRef.current.getBounds());
        }
    }, [selectedWaypoint, radius]);


    return (
        <div className="h-full rounded-sm shadow-lg bg-white p-4 space-y-4">
            <h3 className="text-lg font-bold">
                {!selectedWaypoint ? "Details" : selectedWaypoint.name ?
                    selectedWaypoint.name : "No name"}
            </h3>
            <p className="text-sm text-gray-500">
                {!selectedWaypoint
                    ? "Click on a marker to see details ✨"
                    : selectedWaypoint.fclass}
            </p>
            {selectedWaypoint && (
                <>
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
                            min={1000}
                            max={50000}
                            step={1000}
                            value={radius}
                            onChange={(e) => {
                                const newRadius = Number(e.target.value);
                                interactions.setRadius(newRadius);
                            }}
                            className="w-full accent-green-700"
                        />
                    </div>

                    {highlightedWaypoints.length > 0 && (
                        <>
                            {/* <div className="my-2">
                                <h4 className="font-semibold">Choose end waypoint 🚩</h4>
                                {highlightedWaypoints.map((feature) => {
                                    const { id, name } = feature.properties as { id: number; name: string };
                                    return (
                                        <div key={id} className="flex gap-2 items-center">
                                            <input
                                                type="radio"
                                                name="endWaypoint"
                                                value={id}
                                                checked={endWaypointId === id}
                                                onChange={() => setEndWaypointId(id)}
                                            />
                                            <label>{name}</label>
                                        </div>
                                    );
                                })}
                            </div> */}
                            <div className="my-2">
                                <h4 className="font-semibold">Nearby waypoints:</h4>
                                {highlightedWaypoints.map((feature) => {
                                    const { name } = feature.properties as { name: string };
                                    return (
                                        <ul className="flex gap-2 items-center">
                                            <li>- {name}</li>
                                        </ul>
                                    );
                                })}
                            </div>

                            {/* {endWaypointId && (
                                <div className="my-2">
                                    <h4 className="font-semibold">Optional stops 🛑</h4>
                                    {filteredWaypoints.map((feature) => {
                                        const { id, name } = feature.properties as { id: number; name: string };
                                        return (
                                            <div key={id} className="flex gap-2 items-center">
                                                <input
                                                    type="checkbox"
                                                    value={id}
                                                    checked={optionalWaypointsIds?.includes(id)}
                                                    onChange={(e) => handleWaypointCheckbox(e, id)}
                                                />
                                                <label>{name}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            )} */}
                        </>
                    )}
                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={async () => {
                                // setIsLoading(true);
                                // await interactions.displayPath(endWaypointId as number);
                                // setIsLoading(false);
                            }}
                            // disabled={isFindPathsBtnDisabled || isLoading}
                            hierarchy="secondary"
                        >
                            {/* {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="spinner"></span>
                                    Finding...
                                </span>
                            ) : (
                                "Find Paths"
                            )} */}
                            Find Paths
                        </Button>
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
                            hierarchy="tertiary"
                        >
                            Delete selected Waypoint
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Details;
