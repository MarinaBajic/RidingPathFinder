import { API_BASE } from "./mapService";


export const fetchPathInfo = async (id: number) => {
    const res = await fetch(`${API_BASE}/paths/${id}`);
    if (res.status === 404) {
        throw new Error("Failed to fetch path data");
    }
    return await res.json();
};

export const fetchPaths = async () => {
    const url = `${API_BASE}/paths`;
    const res = await fetch(url);
    return await res.json();
}