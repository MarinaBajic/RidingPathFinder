import { createContext, useContext, useState } from "react";
import { Waypoint } from "../types/Waypoint";


const WaypointContext = createContext<{
    selected: Waypoint | null;
    setSelected: (w: Waypoint | null) => void;
} | null>(null);

export const WaypointProvider = ({ children }: { children: React.ReactNode }) => {
    const [selected, setSelected] = useState<Waypoint | null>(null);

    return (
        <WaypointContext.Provider value={{ selected, setSelected }}>
            {children}
        </WaypointContext.Provider>
    );
};

export const useWaypoint = () => {
    const ctx = useContext(WaypointContext);
    if (!ctx) throw new Error("useWaypoint must be used inside WaypointProvider");
    return ctx;
};
