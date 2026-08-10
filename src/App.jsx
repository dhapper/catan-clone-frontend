import { useEffect, useState } from "react";
import Board from "./components/Board";
import { getGame, buildSettlement, buildRoad } from "./api/gameApi";

function App() {
    const [board, setBoard] = useState(null);

    useEffect(() => {
        getGame()
            .then((data) => {
                setBoard(data);
            })
            .catch((error) => {
                console.error("Failed to load game:", error);
            });
    }, []);

    async function handleVertexClick(vertexId) {
        try {
            await buildSettlement(vertexId);

            const updatedGame = await getGame();
            setBoard(updatedGame);
        } catch (error) {
            console.error("Failed to build settlement:", error);
        }
    }

    async function handleEdgeClick(edgeId) {
        try {
            await buildRoad(edgeId);

            const updatedGame = await getGame();
            setBoard(updatedGame);
        } catch (error) {
            console.error("Failed to build road:", error);
        }
    }

    if (!board) {
        return <div>Loading game...</div>;
    }

    return (
        <div>
            <h1>Hexland</h1>
            <p>phase: {board.phase}</p>
            <p>subphase: {board.subphase}</p>
            <p>Player turn: {board.currentPlayerId}</p>
            <Board
                board={board}
                onVertexClick={handleVertexClick}
                onEdgeClick={handleEdgeClick}
            />
        </div>
    );
}

export default App;