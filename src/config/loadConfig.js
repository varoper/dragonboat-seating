// src/config.js
// Load team configurations

export async function loadConfig() {
    try {
        const res = await fetch('/config.json');

        // If file doesn't exist or server error
        if (!res.ok) {
            return {};
        }

        const data = await res.json();

        // Ensure it's an object
        return data || {};
    } catch (err) {
        // Network error, invalid JSON, etc.
        return {};
    }
}