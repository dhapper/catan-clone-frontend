const API_URL = "http://localhost:3000/api";

export async function getGame() {
    const response = await fetch(`${API_URL}/game`);

    if (!response.ok) {
        throw new Error("Failed to fetch game");
    }

    return response.json();
}

export async function buildSettlement(vertexId) {
    const response = await fetch(
        `${API_URL}/game/build/settlement`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                vertexId
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to build settlement");
    }

    return response.json();
}

export async function buildRoad(edgeId) {
    const response = await fetch(
        `${API_URL}/game/build/road`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                edgeId
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to build road");
    }

    return response.json();
}