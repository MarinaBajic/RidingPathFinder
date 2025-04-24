import React from "react";
import { useMapContext } from "../../context/MapContext";
import Button from "../button/Button";

interface DetailsProps {
    circleRef: React.RefObject<L.Circle | null>;
    radius: number;
    highlightedWaypoints: GeoJSON.Feature[];
    endWaypointState: {
        endWaypoint: number | null;
        setEndWaypoint: (id: number) => void;
    }
    optionalWaypointsState: {
        optionalWaypoints: number[] | null;
        setOptionalWaypoints: (ids: number[] | ((prev: number[]) => number[])) => void;
    }
    interactions: {
        setRadius: (radius: number) => void;
        openDeleteWaypointPopup: (
            id: number,
            latitude: number,
            longitude: number
        ) => void;
        highlightNearbyWaypoints: (id: number) => void;
    };
}

const Details = ({ circleRef, radius, highlightedWaypoints, endWaypointState, optionalWaypointsState, interactions }: DetailsProps) => {
    const { selectedWaypoint } = useMapContext();

    const isFindPathsDisabled = !endWaypointState.endWaypoint;

    const handleWaypointCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.checked) {
            optionalWaypointsState.setOptionalWaypoints((prev: number[]) => [...prev, id]);
        } else {
            optionalWaypointsState.setOptionalWaypoints((prev: number[]) => prev.filter(wp => wp !== id));
        }
    };

    const filteredWaypoints = highlightedWaypoints.filter(
        (feature) => feature.properties?.id !== endWaypointState.endWaypoint
    );

    return (
        <div className="h-full rounded-sm shadow-lg bg-white p-4 space-y-4">
            <h3 className="text-lg font-bold mb-4">
                {!selectedWaypoint ? "Details" : selectedWaypoint.name}
            </h3>
            <p className="text-sm text-gray-500">
                {!selectedWaypoint
                    ? "Click on a marker to see details ✨"
                    : selectedWaypoint.description}
            </p>
            {selectedWaypoint && (
                <>
                    <div className="space-y-2">
                        <label
                            htmlFor="radius"
                            className="text-sm font-semibold"
                        >
                            Radius: {radius/1000}km
                        </label>
                        <input
                            type="range"
                            id="radius"
                            min={1000}
                            max={100000}
                            step={1000}
                            value={radius}
                            onChange={(e) => {
                                const newRadius = Number(e.target.value);
                                interactions.setRadius(newRadius);
                                interactions.highlightNearbyWaypoints(selectedWaypoint.id);
                                circleRef.current?.setRadius(newRadius);
                            }}
                            className="w-full accent-green-700"
                        />
                    </div>

                    {highlightedWaypoints.length > 0 && (
                        <>
                            <div className="my-2">
                                <h4 className="font-semibold">Choose end waypoint 🚩</h4>
                                {highlightedWaypoints.map((feature) => {
                                    const { id, name } = feature.properties as { id: number; name: string };
                                    return (
                                        <div key={id} className="flex gap-2 items-center">
                                            <input
                                                type="radio"
                                                name="endWaypoint"
                                                value={id}
                                                checked={endWaypointState.endWaypoint === id}
                                                onChange={() => endWaypointState.setEndWaypoint(id)}
                                            />
                                            <label>{name}</label>
                                        </div>
                                    );
                                })}
                            </div>

                            {endWaypointState.endWaypoint && (
                                <div className="my-2">
                                    <h4 className="font-semibold">Optional stops 🛑</h4>
                                    {filteredWaypoints.map((feature) => {
                                        const { id, name } = feature.properties as { id: number; name: string };
                                        return (
                                            <div key={id} className="flex gap-2 items-center">
                                                <input
                                                    type="checkbox"
                                                    value={id}
                                                    checked={optionalWaypointsState.optionalWaypoints?.includes(id)}
                                                    onChange={(e) => handleWaypointCheckbox(e, id)}
                                                />
                                                <label>{name}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={() => {
                                // Logic to find paths goes here
                                // TODO
                                console.log("Finding paths...");
                            }}
                            disabled={isFindPathsDisabled}
                            hierarchy="secondary"
                        >
                            Find Paths
                        </Button>
                        <Button
                            onClick={async () => {
                                interactions.openDeleteWaypointPopup(
                                    selectedWaypoint.id,
                                    selectedWaypoint.latitude,
                                    selectedWaypoint.longitude
                                );
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
