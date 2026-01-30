
/**
 * Fetches the route from start to end using OSRM public API.
 * @param {Object} start - {lat, lng}
 * @param {Object} end - {lat, lng}
 * @returns {Promise<Object>} - OSRM route object or null
 */
export const fetchRoute = async (start, end) => {
    if (!start || !end) return null;

    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes.length > 0) {
            return data.routes[0];
        }
    } catch (error) {
        console.error("OSRM Fetch Error:", error);
    }
    return null;
};

/**
 * Geocodes a query string using Nominatim.
 * @param {string} query 
 * @returns {Promise<Object[]>}
 */
export const searchLocation = async (query) => {
    if (!query) return [];
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Nominatim Search Error:", error);
        return [];
    }
};
