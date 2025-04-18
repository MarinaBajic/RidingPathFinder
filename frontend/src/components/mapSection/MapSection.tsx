import { useState } from "react";
import Button from "../button/Button";
import Map from "../map/Map";
import Instructions from "../instructions/Instructions";

const MapSection = () => {
    const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
    const [radius, setRadius] = useState<number>(1000);

    return (
        <div className="full-width bg-(--color-dark) scroll-mt-32 py-16">
            <h2 className="text-center text-3xl font-bold text-white mb-8">Rides and Trails in Serbia</h2>
            <div className="flex gap-4">
                <Map
                    isAddingWaypoint={isAddingWaypoint}
                    setIsAddingWaypoint={setIsAddingWaypoint}
                    radius={radius}
                />
                <Instructions />
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