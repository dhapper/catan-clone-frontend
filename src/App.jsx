import "./App.css";
import { useEffect, useState } from "react";
import { getGame, buildSettlement, buildRoad, buildCity } from "./api/gameApi";
import { SETUP_SUBPHASES, GAME_PHASES, GAMEPLAY_SUBPHASES } from "./constants/GameConstants";
import socket from "./services/socket";
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
import RobberSteal from "./popup/RobberSteal";
import Monopoly from "./popup/Monopoly";
import Invention from "./popup/Invention";
import { playSound } from "./services/soundManager";

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
    const [discardRequirements, setDiscardRequirements] = useState({});
    const [robberTileId, setRobberTileId] = useState(null);
    const [robberVictims, setRobberVictims] = useState([]);
    const [showMonopoly, setShowMonopoly] = useState(false);
    const [showInvention, setShowInvention] = useState(false);
    const [robberSafetyNumber, setRobberSafetyNumber] = useState(null);
    const [bankResourceCount, setBankResourceCount] = useState(null);
    const [victoryPointsNeeded, setVictoryPointsNeeded] = useState(null);
    const [newBoardLayout, setNewBoardLayout] = useState("");
    const [winner, setWinner] = useState(null);
    const [setupTurnOrder, setSetupTurnOrder] = useState([]);   // roll order

    const [boardScale, setBoardScale] = useState(1);
    const [boardPan, setBoardPan] = useState({ x: 0, y: 0 });

    const myPlayer = players.find(player => player.id === myPlayerId);

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
            setDiscardRequirements(data.discardRequirements ?? {});
            setRobberTileId(data.robberTileId);
            setRobberVictims(data.robberVictims ?? []);
            setRobberSafetyNumber(data.robberSafetyNumber);
            setBankResourceCount(data.bankResourceCount);
            setVictoryPointsNeeded(data.victoryPointsNeeded);
            setNewBoardLayout(data.boardLayout);
            setWinner(data.winner);
            setSetupTurnOrder(data.setupTurnOrder ?? []);

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

        socket.on("game:sound", (soundName) => {
            playSound(soundName);
        });

        return () => {
            socket.off("connect");
            socket.off("game:state");
            socket.off("game:sound");
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

    // for road building dev card, dont completely understand
    useEffect(() => {
        if (
            phase !== GAME_PHASES.GAMEPLAY ||
            subphase !== GAMEPLAY_SUBPHASES.ACTION ||
            currentPlayerId !== myPlayerId
        ) {
            return;
        }

        if (myPlayer?.roadBuildingRemaining > 0) {
            setBuildMode("road");
        }
    }, [
        phase,
        subphase,
        currentPlayerId,
        myPlayerId,
        myPlayer?.roadBuildingRemaining
    ]);

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

            const updatedGame = await getGame();
            setBoard(updatedGame);

            const currentPlayer = updatedGame.players.find(
                player => player.id === myPlayerId
            );

            if (!currentPlayer?.roadBuildingRemaining) {
                setBuildMode(null);
            }

            if (currentPlayer) {
                setBuildAvailability({
                    road:
                        currentPlayer.roadBuildingRemaining > 0 ||
                        (
                            currentPlayer.resources.wood >= 1 &&
                            currentPlayer.resources.brick >= 1
                        ),
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

    function handleTileClick(tileId) {
        if (
            phase !== GAME_PHASES.GAMEPLAY ||
            subphase !== GAMEPLAY_SUBPHASES.ROBBER_PLACEMENT ||
            currentPlayerId !== myPlayerId
        ) {
            return;
        }

        console.log("ROBBER TILE CLICKED:", tileId);

        socket.emit("game:moveRobber", {
            tileId
        });
    }

    function recenterBoard() {
        setBoardPan({ x: 0, y: 0 });
    }

    function resetBoardZoom() {
        setBoardScale(1);
    }

    if (!board) {
        return <div>Loading game...</div>;
    }

    console.log(
        "DISCARD DEBUG:",
        {
            phase,
            subphase,
            myPlayerId,
            discardRequirement: discardRequirements[myPlayerId]
        }
    );

    return (
        <div className="game-layout">

            <div className="game-left">

                {phase != GAME_PHASES.LOBBY &&
                    myPlayer?.isHost && (
                        <button onClick={() => socket.emit("game:reset")}>
                            Back to lobby
                        </button>
                    )}

                {phase === GAME_PHASES.LOBBY && (
                    <Lobby
                        players={players}
                        colors={colors}
                        myPlayerId={myPlayerId}
                        phase={phase}
                        robberSafetyNumber={robberSafetyNumber}
                        bankResourceCount={bankResourceCount}
                        victoryPointsNeeded={victoryPointsNeeded}
                        boardLayout={newBoardLayout}
                    />
                )}

                {(phase === GAME_PHASES.SETUP || phase === GAME_PHASES.GAMEPLAY) && (
                    <Players
                        players={players}
                        myPlayerId={myPlayerId}
                        phase={phase}
                        subphase={subphase}
                        turnOrderRolls={turnOrderRolls}
                        currentPlayerId={currentPlayerId}
                        setupTurnOrder={setupTurnOrder}
                    />
                )}

                <Bank bank={bank} />

                {phase === GAME_PHASES.GAMEPLAY && (
                    <Inventory
                        player={players.find(
                            player => player.id === myPlayerId
                        )}
                        currentPlayerId={currentPlayerId}
                        subphase={subphase}
                        onDevCardPlay={(cardType) => {
                            if (cardType === "monopoly") {
                                setShowMonopoly(true);
                            }

                            if (cardType === "invention") {
                                socket.emit("game:playInvention");
                                setShowInvention(true);
                            }
                        }}
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

            {/* pop ups */}

            {winner && (
                <GameOver
                    winner={winner}
                    players={players}
                />
            )}

            {phase === GAME_PHASES.GAMEPLAY &&
                subphase === GAMEPLAY_SUBPHASES.ACTION &&
                currentPlayerId === myPlayerId &&
                showInvention && (
                    <Invention
                        bank={bank}
                        setShowInvention={setShowInvention}
                    />
                )}

            {phase === GAME_PHASES.GAMEPLAY &&
                subphase === GAMEPLAY_SUBPHASES.ACTION &&
                currentPlayerId === myPlayerId &&
                showMonopoly && (
                    <Monopoly
                        onResourceSelect={(resource) => {
                            console.log("MONOPOLY RESOURCE SELECTED:", resource);
                            setShowMonopoly(false);
                        }}
                    />
                )}

            {phase === GAME_PHASES.GAMEPLAY &&
                subphase === GAMEPLAY_SUBPHASES.DISCARDING &&
                discardRequirements[myPlayerId] && (
                    <Discard
                        player={myPlayer}
                        discardAmount={discardRequirements[myPlayerId]}
                    />
                )}

            {phase === GAME_PHASES.GAMEPLAY &&
                subphase === GAMEPLAY_SUBPHASES.ACTION &&
                currentPlayerId === myPlayerId &&
                robberVictims.length > 1 && (
                    <RobberSteal
                        players={players}
                        robberVictims={robberVictims}
                    />
                )}

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
                    onTileClick={handleTileClick}
                    boardScale={boardScale}
                    setBoardScale={setBoardScale}
                    boardPan={boardPan}
                    setBoardPan={setBoardPan}
                    robberTileId={robberTileId}
                />
            </div>

            {/* <div className="game-right">

                <div className="panel">
                    <button onClick={recenterBoard}>
                        Recenter Board
                    </button>

                    <button onClick={resetBoardZoom}>
                        Normal Zoom
                    </button>
                </div>

                <div className="panel">
                    <h1>Hexland</h1>

                    <p>phase: {phase}</p>
                    <p>subphase: {subphase}</p>
                    <p>Player turn: {currentPlayerId}</p>
                </div>
            </div> */}

        </div>
    );
}

export default App;