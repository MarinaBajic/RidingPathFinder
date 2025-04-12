import { saveWaypoint } from "../services/waypointService";

export const handleSaveWaypoint = async (
    lat: number,
    lng: number,
    onSuccess: () => void,
    popup?: L.Popup | null
) => {
    const name = prompt("Enter waypoint name:");
    if (!name) return;

    const description = prompt("Enter description:");
    if (!description) return;

    const success = await saveWaypoint(name, description, lat, lng);

    if (success) {
        alert("Waypoint saved!");
        onSuccess();
        popup?.remove();
    } else {
        alert("Failed to save waypoint.");
    }
};
