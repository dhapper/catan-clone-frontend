import "./PlayerCard.css";

function PlayerCard({ player, myPlayerId }) {
    return (
        <div
            className={`player-card ${
                player.connected
                    ? "connected"
                    : "disconnected"
            }`}
        >
            <div
                className="player-color"
                style={{
                    backgroundColor: player.color
                }}
            />

            <div className="player-info">
                <div className="player-name">
                    {player.name}
                </div>

                <div className="player-status">
                    {player.connected
                        ? "Connected"
                        : "Available"}
                </div>
            </div>

            <div className="player-indicators">
                {player.id === myPlayerId && (
                    <div className="player-you">
                        YOU
                    </div>
                )}

                {player.isHost && (
                    <div className="player-host">
                        ✪
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlayerCard;