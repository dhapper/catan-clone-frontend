import { useState } from "react";
import socket from "../services/socket";
import "./Lobby.css";
import "./Panel.css";
import PlayerCard from "../ui/PlayerCard";

function Lobby({
    players,
    colors,
    myPlayerId,
    phase,
    robberSafetyNumber,
    bankResourceCount,
    victoryPointsNeeded,
    pieceLimits,
    boardLayout
}) {
    const [name, setName] = useState("");
    const [newName, setNewName] = useState("");

    const [newRobberSafetyNumber, setNewRobberSafetyNumber] = useState("");
    const [newBankResourceCount, setNewBankResourceCount] = useState("");
    const [newVictoryPointsNeeded, setNewVictoryPointsNeeded] = useState("");
    const [newBoardLayout, setNewBoardLayout] = useState("");
    const [newRoadLimit, setNewRoadLimit] = useState("");
    const [newSettlementLimit, setNewSettlementLimit] = useState("");
    const [newCityLimit, setNewCityLimit] = useState("");

    function createPlayer() {
        if (!name.trim()) {
            return;
        }

        socket.emit("player:create", {
            name: name.trim()
        });

        setName("");
    }

    function claimPlayer(playerId) {
        socket.emit("player:claim", playerId);
    }

    function renamePlayer() {
        if (!newName.trim() || !myPlayerId) {
            return;
        }

        socket.emit("player:rename", {
            name: newName.trim()
        });

        setNewName("");
    }

    return (
        <div className="panel lobby">
            <div className="header">
                <p>Lobby</p>
            </div>

            <div className="player-list">
                {players.map(player => (
                    <div key={player.id}>
                        <PlayerCard
                            player={player}
                            myPlayerId={myPlayerId}
                        />

                        {!player.connected && !myPlayerId && (
                            <button onClick={() => claimPlayer(player.id)}>
                                Play as {player.name}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {!myPlayerId && (
                <>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />

                    <button onClick={createPlayer}>
                        Create Player
                    </button>
                </>
            )}

            {myPlayerId && (
                <div className="profile-controls">
                    <input
                        type="text"
                        placeholder="New username"
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                    />

                    <button onClick={renamePlayer}>
                        Rename
                    </button>

                    <div className="color-controls">
                        <div className="color-options">
                            {colors.map(color => {
                                const isTaken = players.some(
                                    player => player.color === color
                                );

                                return (
                                    <div
                                        key={color}
                                        className={`color-option ${isTaken ? "taken" : ""}`}
                                        style={{
                                            backgroundColor: color
                                        }}
                                        onClick={() => {
                                            if (!isTaken) {
                                                socket.emit(
                                                    "player:changeColor",
                                                    color
                                                );
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {phase === "lobby" &&
                players.find(player => player.id === myPlayerId)?.isHost && (
                    <div className="host-controls">
                        <button onClick={() => socket.emit("game:start")}>
                            Play
                        </button>

                        <div className="host-controls-extra">
                            <label>
                                Robber Safety Number: {robberSafetyNumber}
                                <input
                                    type="number"
                                    min="1"
                                    value={newRobberSafetyNumber}
                                    onChange={(event) => {
                                        setNewRobberSafetyNumber(event.target.value);
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const value = Number(newRobberSafetyNumber);

                                        if (value > 0) {
                                            socket.emit(
                                                "game:setRobberSafetyNumber",
                                                value
                                            );
                                            setNewRobberSafetyNumber("");
                                        }
                                    }}
                                >
                                    Submit
                                </button>
                            </label>

                            <label>
                                Bank Resource Count: {bankResourceCount}
                                <input
                                    type="number"
                                    min="1"
                                    value={newBankResourceCount}
                                    onChange={(event) => {
                                        setNewBankResourceCount(event.target.value);
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const value = Number(newBankResourceCount);

                                        if (value > 0) {
                                            socket.emit(
                                                "game:setBankResourceCount",
                                                value
                                            );
                                            setNewBankResourceCount("");
                                        }
                                    }}
                                >
                                    Submit
                                </button>
                            </label>

                            <label>
                                Victory Points Needed: {victoryPointsNeeded}
                                <input
                                    type="number"
                                    min="1"
                                    value={newVictoryPointsNeeded}
                                    onChange={(event) => {
                                        setNewVictoryPointsNeeded(event.target.value);
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const value = Number(newVictoryPointsNeeded);

                                        if (value > 0) {
                                            socket.emit(
                                                "game:setVictoryPointsNeeded",
                                                value
                                            );
                                            setNewVictoryPointsNeeded("");
                                        }
                                    }}
                                >
                                    Submit
                                </button>
                            </label>

                            <label>
                                Board Layout: {boardLayout?.join(",")}
                                <input
                                    type="text"
                                    value={newBoardLayout}
                                    onChange={(event) => {
                                        setNewBoardLayout(event.target.value);
                                    }}
                                    placeholder="3,4,5,4,3"
                                />
                                <button
                                    onClick={() => {
                                        if (newBoardLayout.trim()) {
                                            socket.emit(
                                                "game:setBoardLayout",
                                                newBoardLayout
                                            );
                                            setNewBoardLayout("");
                                        }
                                    }}
                                >
                                    Submit
                                </button>
                            </label>

                            <label>
                                Road Pieces: {pieceLimits?.road}
                                <input
                                    type="number"
                                    min="1"
                                    value={newRoadLimit}
                                    onChange={(event) => {
                                        setNewRoadLimit(event.target.value);
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const value = Number(newRoadLimit);

                                        if (value > 0) {
                                            socket.emit("game:setPieceLimit", {
                                                piece: "road",
                                                value
                                            });
                                            setNewRoadLimit("");
                                        }
                                    }}
                                >
                                    Submit
                                </button>
                            </label>

                            <label>
                                Settlement Pieces: {pieceLimits?.settlement}
                                <input
                                    type="number"
                                    min="1"
                                    value={newSettlementLimit}
                                    onChange={(event) => {
                                        setNewSettlementLimit(event.target.value);
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const value = Number(newSettlementLimit);

                                        if (value > 0) {
                                            socket.emit("game:setPieceLimit", {
                                                piece: "settlement",
                                                value
                                            });
                                            setNewSettlementLimit("");
                                        }
                                    }}
                                >
                                    Submit
                                </button>
                            </label>

                            <label>
                                City Pieces: {pieceLimits?.city}
                                <input
                                    type="number"
                                    min="1"
                                    value={newCityLimit}
                                    onChange={(event) => {
                                        setNewCityLimit(event.target.value);
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const value = Number(newCityLimit);

                                        if (value > 0) {
                                            socket.emit("game:setPieceLimit", {
                                                piece: "city",
                                                value
                                            });
                                            setNewCityLimit("");
                                        }
                                    }}
                                >
                                    Submit
                                </button>
                            </label>

                            <button
                                onClick={() =>
                                    socket.emit("game:regenerateBoard")
                                }
                            >
                                Reroll Board
                            </button>
                        </div>
                    </div>
                )}

            {phase === "lobby" &&
                !players.find(player => player.id === myPlayerId)?.isHost && (
                    <div className="game-settings">
                        <p>Robber Safety Number: {robberSafetyNumber}</p>
                        <p>Bank Resource Count: {bankResourceCount}</p>
                        <p>Victory Points Needed: {victoryPointsNeeded}</p>
                        <p>Roads: {pieceLimits.road}</p>
                        <p>Settlements: {pieceLimits.settlement}</p>
                        <p>Cities: {pieceLimits.city}</p>
                    </div>
                )}



        </div>
    );
}

export default Lobby;