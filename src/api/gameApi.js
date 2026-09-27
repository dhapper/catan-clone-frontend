const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export async function getGame(lobbyCode) {
    const response = await fetch(`${API_URL}/game/${lobbyCode}`);

    if (!response.ok) {
        throw new Error("Failed to fetch game");
    }

    return response.json();
}

export async function buildSettlement(lobbyCode, vertexId) {
    const response = await fetch(
        `${API_URL}/game/${lobbyCode}/build/settlement`,
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

export async function resetGame(lobbyCode) {
    const response = await fetch(
        `${API_URL}/game/${lobbyCode}/reset`,
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

export async function buildRoad(lobbyCode, edgeId) {
    const response = await fetch(
        `${API_URL}/game/${lobbyCode}/build/road`,
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

export async function buildShip(lobbyCode, edgeId) {
    const response = await fetch(
        `${API_URL}/game/${lobbyCode}/build/ship`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ edgeId })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to build ship");
    }

    return response.json();
}

export async function buildCity(lobbyCode, vertexId) {
    const response = await fetch(
        `${API_URL}/game/${lobbyCode}/build/city`,
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