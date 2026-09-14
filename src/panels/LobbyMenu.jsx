import { useEffect, useState } from "react";
import "./LobbyMenu.css";
import "../popup/Popup.css";
import socket from "../services/socket";

function LobbyMenu({}) {
    const [lobbyCode, setLobbyCode] = useState("");
    const [error, setError] = useState("");

    const joinLobby = () => {
        const code = lobbyCode.trim().toUpperCase();

        if (!code) {
            return;
        }

        setError("");
        socket.emit("lobby:join", code);
    };

    useEffect(() => {
        const handleJoinError = () => {
            setError(
                `Room '${lobbyCode.trim().toUpperCase()}' doesn't exist.`
            );
        };

        const handleCreateError = ({ error }) => {
            setError(error);
        };

        socket.on("lobby:join:error", handleJoinError);
        socket.on("lobby:create:error", handleCreateError);

        return () => {
            socket.off("lobby:join:error", handleJoinError);
            socket.off("lobby:create:error", handleCreateError);
        };
    }, [lobbyCode]);

    return (
        <div className="panel popup lobby-menu">

            <div className="header">
                <p>Lobby Menu</p>
            </div>

            <button
                className="create"
                onClick={() => {
                    setError("");
                    socket.emit("lobby:create");
                }}
            >
                Create Lobby
            </button>

            <div className="join">
                <input
                    type="text"
                    placeholder="Lobby code"
                    value={lobbyCode}
                    onChange={(e) => setLobbyCode(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            joinLobby();
                        }
                    }}
                />

                <button onClick={joinLobby}>
                    Join Lobby
                </button>
            </div>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

        </div>
    );
}

export default LobbyMenu;