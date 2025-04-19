import L from 'leaflet';
import { handleDeleteWaypoint, handleSaveWaypoint } from '../logic/waypointActions';

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
    <div style="font-family: sans-serif;">
    	<p style="font-size: 1rem; font-weight: bold;">Save this location as a waypoint?</p>
    	<button id="save-waypoint" style="padding: 4px 8px; border: 1px solid green; border-radius: 4px; cursor:pointer;">Save</button>
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

export const handleDeleteWaypointPopup = (
  id: number,
  lat: number,
  lng: number,
  map: L.Map,
  popupRef: React.RefObject<L.Popup | null>,
  setIsDeletingWaypoint: React.Dispatch<React.SetStateAction<boolean>>,
  handleFetchWaypoints: () => void
) => {
  const popupContent = document.createElement('div');
  popupContent.innerHTML = `
    <div style="font-family: sans-serif;">
    	<p style="font-size: 1rem; font-weight: bold;">Delete this waypoint?</p>
    	<button id="delete-waypoint" style="padding: 4px 8px; border: 1px solid red; border-radius: 4px; cursor:pointer;">Delete</button>
		</div>
`;

  popupContent.querySelector('#delete-waypoint')?.addEventListener('click', () => {
    handleDeleteWaypoint(id, handleFetchWaypoints, popupRef.current);
    setIsDeletingWaypoint(false);
  });

  const popup = L.popup()
    .setLatLng([lat, lng])
    .setContent(popupContent)
    .openOn(map);

  popupRef.current = popup;
};
