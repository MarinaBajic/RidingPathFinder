import { useState } from "react";
import Button from "../button/Button";
import Map from "../map/Map";
import Instructions from "../instructions/Instructions";
import { useWaypoint } from "../../context/WaypointContext";

const MapSection = () => {
    const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
    const [isDeletingWaypoint, setIsDeletingWaypoint] = useState(false);

    const [radius, setRadius] = useState<number>(1000);
    const { selected } = useWaypoint();

    return (
        <div className="full-width bg-(--color-dark) scroll-mt-32 py-16">
            <h2 className="text-center text-3xl font-bold text-white mb-8">Rides and Trails in Serbia</h2>
            <div className="flex gap-4">
                <Map
                    isAddingWaypoint={isAddingWaypoint}
                    setIsAddingWaypoint={setIsAddingWaypoint}
                    isDeletingWaypoint={isDeletingWaypoint}
                    setIsDeletingWaypoint={setIsDeletingWaypoint}
                    radius={radius}
                />
                <div className="flex gap-4 flex-col w-full max-w-[400px] mx-auto">
                    <Instructions />
                    {!selected ? (
                        <div className="h-full rounded-sm shadow-lg bg-white p-4 space-y-4">
                            <h3 className="text-lg font-bold mb-4">Details</h3>
                            <p className="text-sm text-gray-500">Click a waypoint to see details ✨</p>
                        </div>
                    ) : (
                        <div className="h-full rounded-sm shadow-lg bg-white p-4 space-y-4">
                            <h3 className="text-xl font-bold text-gray-800">{selected.name}</h3>
                            <p className="text-sm text-gray-600">{selected.description}</p>
                            <button
                                onClick={() => setIsDeletingWaypoint(prev => !prev)}
                                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>
                {isAddingWaypoint && (
                    <p className="text-center text-white mb-4 animate-pulse">
                        Click on the map to add a waypoint ✨
                    </p>
                )}
                <Button onClick={() => setIsAddingWaypoint(prev => !prev)}>
                    {isAddingWaypoint ? 'Cancel adding Waypoint' : 'Add new Waypoint'}
                </Button>
            </div>
        </div>
    )
}

export default MapSection