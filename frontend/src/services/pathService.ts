import { API_BASE, GEOSERVER_BASE } from "./mapService";


export const fetchPathInfo = async (id: number) => {
    const res = await fetch(`${API_BASE}/paths/${id}`);
    if (res.status === 404) {
        throw new Error("Failed to fetch path data");
    }
    return await res.json();
};

export const fetchPaths = async () => {
    // const url = `${API_BASE}/paths`;
    const url = `${GEOSERVER_BASE}/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Apath_segment&outputFormat=application%2Fjson`;
    const res = await fetch(url);
    return await res.json();
}