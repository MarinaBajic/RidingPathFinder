import L from 'leaflet';
import { handleSaveWaypoint } from '../logic/waypointActions';

export const handleSaveWaypointPopup = (
    lat: number,
    lng: number,
    map: L.Map,
    popupRef: React.RefObject<L.Popup | null>,
    setIsAddingWaypoint: React.Dispatch<React.SetStateAction<boolean>>,
    handleFetchWaypoints: () => void
) => {
    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
    <div>
      <p>Save this location as a waypoint?</p>
      <button id="save-waypoint" style="cursor:pointer;">Save</button>
    </div>
  `;

    popupContent.querySelector('#save-waypoint')?.addEventListener('click', () => {
        handleSaveWaypoint(lat, lng, handleFetchWaypoints, popupRef.current);
        setIsAddingWaypoint(false);
    });

    const popup = L.popup()
        .setLatLng([lat, lng])
        .setContent(popupContent)
        .openOn(map);

    popupRef.current = popup;
};
