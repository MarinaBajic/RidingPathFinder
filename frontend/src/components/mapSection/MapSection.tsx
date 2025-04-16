import { useState } from "react";
import Button from "../button/Button";
import Map from "../map/Map";

const MapSection = () => {
    const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
    const [radius, setRadius] = useState<number>(1000);

    const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(Number(e.target.value));
        console.log(radius);
    };

    return (
        <div className="full-width bg-(--color-dark) scroll-mt-32 py-16">
            <div className="text-center mb-4">
                <label htmlFor="radius" className="text-white mr-2">Radius (meters): </label>
                <input
                    type="number"
                    id="radius"
                    value={radius}
                    onChange={handleRadiusChange}
                    className="p-2 rounded-md text-white"
                    min="100"
                    max="10000"
                />
            </div>
            {isAddingWaypoint && (
                <p className="text-center text-white mb-4 animate-pulse">
                    Click on the map to add a waypoint ✨
                </p>
            )}
            <Map
                isAddingWaypoint={isAddingWaypoint}
                setIsAddingWaypoint={setIsAddingWaypoint}
                radius={radius}
            />
            <Button onClick={() => setIsAddingWaypoint(prev => !prev)}>
                {isAddingWaypoint ? 'Cancel adding Waypoint' : 'Add new Waypoint'}
            </Button>
        </div>
    )
}

export default MapSection