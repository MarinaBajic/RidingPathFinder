import { createContext, useContext, useState } from "react";
import { Waypoint } from "../types/Waypoint";


const MapContext = createContext<{
    selectedWaypoint: Waypoint | null;
    setSelectedWaypoint: (w: Waypoint | null) => void;
} | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);

    return (
        <MapContext.Provider value={{ selectedWaypoint, setSelectedWaypoint }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMapContext = () => {
    const ctx = useContext(MapContext);
    if (!ctx) throw new Error("useMapContext must be used inside WaypointProvider");
    return ctx;
};
