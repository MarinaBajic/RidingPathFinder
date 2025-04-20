import { useMapContext } from "../../context/MapContext";
import Button from "../button/Button";

interface DetailsProps {
    circleRef: React.RefObject<L.Circle | null>;
    radius: number;
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

const Details = ({ circleRef, radius, interactions }: DetailsProps) => {
    const { selectedWaypoint } = useMapContext();

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
                            Radius: {radius}m
                        </label>
                        <input
                            type="range"
                            id="radius"
                            min={100}
                            max={10000}
                            step={100}
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
                    <Button
                        onClick={async () => {
                            interactions.openDeleteWaypointPopup(
                                selectedWaypoint.id,
                                selectedWaypoint.latitude,
                                selectedWaypoint.longitude
                            );
                        }}
                        hierarchy="secondary"
                    >
                        Delete
                    </Button>
                </>
            )}
        </div>
    );
};

export default Details;
