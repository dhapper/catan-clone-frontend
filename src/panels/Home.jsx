import { useState } from "react";
import socket from "../services/socket";
import "./Home.css";
import "./Panel.css";

function Home({ initialCode, error }) {
    const [code, setCode] = useState(initialCode ?? "");

    function createRoom() {
        socket.emit("room:create");
    }

    function joinRoom() {
        if (!code.trim()) {
            return;
        }

        socket.emit("room:join", {
            code: code.trim().toUpperCase()
        });
    }

    return (
        <div className="home">
            <h1>Hexland</h1>

            <div className="panel home-panel">
                <button onClick={createRoom}>
                    Create Room
                </button>

                <div className="home-join">
                    <input
                        type="text"
                        placeholder="Room code"
                        value={code}
                        maxLength={5}
                        onChange={(event) => setCode(event.target.value.toUpperCase())}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                joinRoom();
                            }
                        }}
                    />

                    <button onClick={joinRoom}>
                        Join Room
                    </button>
                </div>

                {error && (
                    <p className="home-error">{error}</p>
                )}
            </div>
        </div>
    );
}

export default Home;
