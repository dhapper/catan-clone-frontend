import "./App.css";
import { useEffect, useState } from "react";
import { getGame, buildSettlement, buildRoad, buildCity } from "./api/gameApi";
import { SETUP_SUBPHASES, GAME_PHASES, GAMEPLAY_SUBPHASES } from "./constants/GameConstants";
import socket from "./socket";
import Board from "./components/Board";
import Lobby from "./panels/Lobby";
import Players from "./panels/Players";
import Bank from "./panels/Bank";
import Inventory from "./panels/Inventory";
import Actions from "./panels/Actions";
import TradeCreation from "./popup/TradeCreation"
import TradeProposal from "./popup/TradeProposal";
import TradeAcceptor from "./popup/TradeAcceptor";
import Discard from "./popup/Discard";

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
    const [bank, setBank] = useState(null);
    const [buildMode, setBuildMode] = useState(null);
    const [buildAvailability, setBuildAvailability] = useState(null);
    const [currentTrade, setCurrentTrade] = useState(null);
    const [showTradeCreation, setShowTradeCreation] = useState(false);

    const [boardScale, setBoardScale] = useState(1);
    const [boardPan, setBoardPan] = useState({ x: 0, y: 0 });

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
            setBank(data.bank);
            setBuildAvailability(data.buildAvailability);
            setCurrentTrade(data.currentTrade);

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

    // when turn changes
    useEffect(() => {
        setBuildMode(null);
        setShowTradeCreation(false);
    }, [currentPlayerId]);

    async function handleVertexClick(vertexId) {
        console.log("VERTEX CLICKED:", vertexId);

        try {
            if (phase === GAME_PHASES.SETUP) {
                await buildSettlement(vertexId);

                console.log("SETUP SETTLEMENT BUILD REQUEST SUCCEEDED");
            } else if (
                phase === GAME_PHASES.GAMEPLAY &&
                buildMode === "settlement"
            ) {
                await buildSettlement(vertexId);

                console.log("GAMEPLAY SETTLEMENT BUILD REQUEST SUCCEEDED");
            } else if (
                phase === GAME_PHASES.GAMEPLAY &&
                buildMode === "city"
            ) {
                await buildCity(vertexId);

                console.log("CITY BUILD REQUEST SUCCEEDED");
            } else {
                return;
            }

            setBuildMode(null);

            const updatedGame = await getGame();
            setBoard(updatedGame);
        } catch (error) {
            console.error("FAILED TO BUILD:", error);
        }
    }

    async function handleEdgeClick(edgeId) {
        try {
            await buildRoad(edgeId);

            setBuildMode(null);

            const updatedGame = await getGame();
            setBoard(updatedGame);

            const currentPlayer = updatedGame.players.find(
                player => player.id === myPlayerId
            );

            if (currentPlayer) {
                setBuildAvailability({
                    road: currentPlayer.resources.wood >= 1 &&
                        currentPlayer.resources.brick >= 1,
                    settlement: currentPlayer.resources.wood >= 1 &&
                        currentPlayer.resources.brick >= 1 &&
                        currentPlayer.resources.wheat >= 1 &&
                        currentPlayer.resources.sheep >= 1,
                    city: currentPlayer.resources.wheat >= 2 &&
                        currentPlayer.resources.ore >= 3,
                    developmentCard: currentPlayer.resources.ore >= 1 &&
                        currentPlayer.resources.wheat >= 1 &&
                        currentPlayer.resources.sheep >= 1
                });
            }
        } catch (error) {
            console.error("Failed to build road:", error);
        }
    }

    const myPlayer = players.find(
        player => player.id === myPlayerId
    );

    function recenterBoard() {
        setBoardPan({ x: 0, y: 0 });
    }

    function resetBoardZoom() {
        setBoardScale(1);
    }

    if (!board) {
        return <div>Loading game...</div>;
    }

    return (
        <div className="game-layout">

            <div className="game-left">

                {phase === GAME_PHASES.LOBBY && (
                    <Lobby
                        players={players}
                        colors={colors}
                        myPlayerId={myPlayerId}
                        phase={phase}
                    />
                )}

                {(phase === GAME_PHASES.SETUP || phase === GAME_PHASES.GAMEPLAY) && (
                    <Players
                        players={players}
                        myPlayerId={myPlayerId}
                        phase={phase}
                        subphase={subphase}
                        turnOrderRolls={turnOrderRolls}
                    />
                )}

                <Bank bank={bank} />

                {phase === GAME_PHASES.GAMEPLAY && (
                    <Inventory
                        player={players.find(
                            player => player.id === myPlayerId
                        )}
                    />
                )}

                {phase === GAME_PHASES.GAMEPLAY && (
                    <Actions
                        myPlayerId={myPlayerId}
                        currentPlayerId={currentPlayerId}
                        phase={phase}
                        subphase={subphase}
                        diceRoll={diceRoll}
                        buildMode={buildMode}
                        setBuildMode={setBuildMode}
                        player={players.find(
                            player => player.id === myPlayerId
                        )}
                        buildAvailability={buildAvailability}
                        buildableRoads={board.buildableRoads}
                        buildableSettlements={board.buildableSettlements}
                        buildableCities={board.buildableCities}
                        setShowTradeCreation={setShowTradeCreation}
                    />
                )}

            </div>

            {/* <Discard
                player={players.find(
                    player => player.id === myPlayerId
                )}
                discardAmount={3}
            />*/}


            {phase === GAME_PHASES.GAMEPLAY &&
                subphase === GAMEPLAY_SUBPHASES.ACTION &&
                currentTrade && (
                    currentTrade.playerId === myPlayerId ? (
                        <TradeAcceptor
                            player={myPlayer}
                            currentTradeOffer={currentTrade}
                            currentPlayerId={myPlayerId}
                            players={players}
                        />
                    ) : (
                        <TradeProposal
                            player={myPlayer}
                            currentTradeOffer={currentTrade}
                            currentPlayerId={currentTrade.playerId}
                        />
                    )
                )}

            {phase === GAME_PHASES.GAMEPLAY &&
                subphase === GAMEPLAY_SUBPHASES.ACTION &&
                currentPlayerId === myPlayerId &&
                !currentTrade &&
                showTradeCreation && (
                    <TradeCreation
                        player={myPlayer}
                        onCancel={() => setShowTradeCreation(false)}
                    />
                )}

            <div className="game-board">

                <Board
                    board={board}
                    phase={phase}
                    subphase={subphase}
                    currentPlayerId={currentPlayerId}
                    myPlayerId={myPlayerId}
                    buildMode={buildMode}
                    diceRoll={diceRoll}
                    onVertexClick={handleVertexClick}
                    onEdgeClick={handleEdgeClick}
                    boardScale={boardScale}
                    setBoardScale={setBoardScale}
                    boardPan={boardPan}
                    setBoardPan={setBoardPan}
                />
            </div>

            <div className="game-right">

                <div className="panel">
                    <button onClick={recenterBoard}>
                        Recenter Board
                    </button>

                    <button onClick={resetBoardZoom}>
                        Normal Zoom
                    </button>
                </div>

                {/* Game logs will go here */}

                <div className="panel">
                    <h1>Hexland</h1>

                    <p>phase: {phase}</p>
                    <p>subphase: {subphase}</p>
                    <p>Player turn: {currentPlayerId}</p>
                </div>
            </div>

        </div>
    );
}

export default App;