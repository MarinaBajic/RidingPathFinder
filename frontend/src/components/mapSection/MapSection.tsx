import { useState } from "react";
import Button from "../button/Button";
import Map from "../map/Map";

const MapSection = () => {
    const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);

    return (
        <div className="full-width bg-(--color-dark) scroll-mt-32 py-16">
            {isAddingWaypoint && (
                <p className="text-center text-white mb-4 animate-pulse">
                    Click on the map to add a waypoint ✨
                </p>
            )}
            <Map isAddingWaypoint={isAddingWaypoint} setIsAddingWaypoint={setIsAddingWaypoint} />
            <Button onClick={() => setIsAddingWaypoint(prev => !prev)}>
                {isAddingWaypoint ? 'Cancel adding Waypoint' : 'Add new Waypoint'}
            </Button>
        </div>
    )
}

export default MapSection