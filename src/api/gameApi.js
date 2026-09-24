const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

function roomUrl(roomCode) {
    return `${API_URL}/rooms/${encodeURIComponent(roomCode)}`;
}

export async function getGame(roomCode) {
    const response = await fetch(`${roomUrl(roomCode)}/game`);

    if (!response.ok) {
        throw new Error("Failed to fetch game");
    }

    return response.json();
}

export async function buildSettlement(roomCode, vertexId) {
    const response = await fetch(
        `${roomUrl(roomCode)}/game/build/settlement`,
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
        throw new Error(
            error.error || "Failed to build settlement"
        );
    }

    return response.json();
}

export async function resetGame(roomCode) {
    const response = await fetch(
        `${roomUrl(roomCode)}/game/reset`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.error || "Failed to build reset game"
        );
    }

    return response.json();
}

export async function buildRoad(roomCode, edgeId) {
    const response = await fetch(
        `${roomUrl(roomCode)}/game/build/road`,
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
        throw new Error(
            error.error || "Failed to build road"
        );
    }

    return response.json();
}

export async function buildCity(roomCode, vertexId) {
    const response = await fetch(
        `${roomUrl(roomCode)}/game/build/city`,
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
        throw new Error(
            error.error || "Failed to build city"
        );
    }

    return response.json();
}