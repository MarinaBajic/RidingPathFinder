import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import './Details.scss'
import { Waypoint } from "../../types/Waypoint";

interface DetailsProps {
    circleRef: React.RefObject<L.Circle | null>;
    radius: number;
    selectedWaypoint: Waypoint | null;
    highlightedWaypoints: GeoJSON.Feature[];
    interactions: {
        setRadius: (radius: number) => void;
        openDeleteWaypointPopup: (
            id: number,
            latitude: number,
            longitude: number
        ) => void;
        highlightNearbyWaypoints: (id: number) => void;
        displayPath: (endWaypointId: number) => void;
    };
}

const Details = ({ circleRef, radius, selectedWaypoint, highlightedWaypoints, interactions }: DetailsProps) => {
    const [endWaypointId, setEndWaypointId] = useState<number | null>(null);
    const [optionalWaypointsIds, setOptionalWaypointsIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const isFindPathsBtnDisabled = !endWaypointId;

    const handleWaypointCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.checked) {
            setOptionalWaypointsIds((prev: number[]) => [...prev, id]);
        } else {
            setOptionalWaypointsIds((prev: number[]) => prev.filter(wp => wp !== id));
        }
    };

    const filteredWaypoints = highlightedWaypoints.filter(
        (feature) => feature.properties?.id !== endWaypointId
    );

    useEffect(() => {
        setEndWaypointId(null);
        setOptionalWaypointsIds([]);

    }, [selectedWaypoint]);

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
                            Radius: {radius / 1000}km
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
                                                checked={endWaypointId === id}
                                                onChange={() => setEndWaypointId(id)}
                                            />
                                            <label>{name}</label>
                                        </div>
                                    );
                                })}
                            </div>

                            {endWaypointId && (
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
                            )}
                        </>
                    )}
                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={async () => {
                                setIsLoading(true);
                                await interactions.displayPath(endWaypointId as number);
                                setIsLoading(false);
                            }}
                            disabled={isFindPathsBtnDisabled || isLoading}
                            hierarchy="secondary"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="spinner"></span>
                                    Finding...
                                </span>
                            ) : (
                                "Find Paths"
                            )}
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
