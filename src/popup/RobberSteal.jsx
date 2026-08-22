import "./Popup.css";
import "./Trade.css";
import "../panels/Panel.css";
import socket from "../services/socket";

function RobberSteal({
    players = [],
    robberVictims = []
}) {
    function handleSelectPlayer(playerId) {
        console.log("ROBBER STEAL CLICKED:", playerId);

        socket.emit("game:stealResource", {
            victimId: playerId
        });
    }

    const victims = players.filter(
        player => robberVictims.includes(player.id)
    );

    return (
        <div className="popup panel">
            <p>Choose player to steal from:</p>

            <div className="trade-players">
                {victims.map((player) => (
                    <button
                        key={player.id}
                        onClick={() => handleSelectPlayer(player.id)}
                    >
                        {player.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default RobberSteal;