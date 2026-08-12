import { useEffect, useState } from "react";
import Board from "./components/Board";
import { getGame, buildSettlement, buildRoad } from "./api/gameApi";
import socket from "./socket";
import Lobby from "./panels/Lobby";
import Setup from "./panels/Setup";
import PlayerActions from "./panels/PlayerActions";
import { SETUP_SUBPHASES, GAME_PHASES, GAMEPLAY_SUBPHASES } from "./constants/GameConstants";

function App() {
    const [board, setBoard] = useState(null);
    const [colors, setColors] = useState([]);
    const [phase, setPhase] = useState(null);
    const [subphase, setSubphase] = useState(null);
    const [turnOrderRolls, setTurnOrderRolls] = useState({});
    const [players, setPlayers] = useState([]);
    const [currentPlayerId, setCurrentPlayerId] = useState(null);
    const [myPlayerId, setMyPlayerId] = useState(null);
    const [diceRoll, setDiceRoll] = useState(null);

    useEffect(() => {
        console.log("Setting up players:update listener");

        socket.on("connect", () => {
            console.log("Connected to server:", socket.id);
        });

        socket.on("game:state", (data) => {
            console.log("Game state update:", data);

            setColors(data.colors);
            setPhase(data.phase);
            setSubphase(data.subphase);
            setTurnOrderRolls(data.turnOrderRolls);
            setPlayers(data.players);
            setCurrentPlayerId(data.currentPlayerId);
            setDiceRoll(data.diceRoll);

            getGame()
                .then((data) => {
                    setBoard(data);
                })
                .catch((error) => {
                    console.error("Failed to refresh game:", error);
                });
        });

        socket.on("player:claimed", ({ player }) => {
            setMyPlayerId(player.id);
        });

        return () => {
            socket.off("connect");
            socket.off("game:state");
        };
    }, []);

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
            <p>phase: {phase}</p>
            <p>subphase: {subphase}</p>
            <p>Player turn: {currentPlayerId}</p>

            {/* // should be left of screen */}

            {phase === GAME_PHASES.LOBBY && (
                <Lobby
                    players={players}
                    colors={colors}
                    myPlayerId={myPlayerId}
                    phase={phase}
                />
            )}

            {phase === GAME_PHASES.SETUP && (
                <Setup
                    players={players}
                    myPlayerId={myPlayerId}
                    phase={phase}
                    subphase={subphase}
                    turnOrderRolls={turnOrderRolls}
                />
            )}

            {phase === GAME_PHASES.GAMEPLAY && (
                <PlayerActions
                    players={players}
                    myPlayerId={myPlayerId}
                    currentPlayerId={currentPlayerId}
                    phase={phase}
                    subphase={subphase}
                    diceRoll={diceRoll}
                />
            )}

            {/* // should be centered on screen (not moved or affected byt other components and also lowest layer in z-index) */}

            <Board
                board={board}
                phase={phase}
                subphase={subphase}
                currentPlayerId={currentPlayerId}
                myPlayerId={myPlayerId}
                onVertexClick={handleVertexClick}
                onEdgeClick={handleEdgeClick}
            />

            {/* // will be right of screen, in the future for game logs */}

        </div>
    );
}

export default App;