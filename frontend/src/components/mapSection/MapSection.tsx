import { useState } from "react";
import Button from "../button/Button";
import Map from "../map/Map";

const MapSection = () => {
    const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);

    return (
        <div className="full-width bg-(--color-dark) scroll-mt-32 py-16">
			<Map isAddingWaypoint={isAddingWaypoint} setIsAddingWaypoint={setIsAddingWaypoint} />
			<Button onClick={() => setIsAddingWaypoint(true)}>Add new Waypoint</Button>
		</div>
    )
}

export default MapSection