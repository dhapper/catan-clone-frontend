import { useState } from "react";
import socket from "../socket";
import "./Lobby.css";
import PlayerCard from "../ui/PlayerCard";

function Lobby({ players, colors, myPlayerId, phase }) {
    const [name, setName] = useState("");
    const [newName, setNewName] = useState("");

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
        <div className="lobby">

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
                    </div>
                )}

        </div>
    );
}

export default Lobby;