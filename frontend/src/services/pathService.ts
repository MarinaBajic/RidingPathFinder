import { API_BASE } from "./mapService";


export const fetchPaths = async () => {
    const url = `${API_BASE}/paths`;
    const res = await fetch(url);
    return await res.json();
}