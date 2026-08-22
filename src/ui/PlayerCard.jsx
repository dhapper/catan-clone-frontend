import "./PlayerCard.css";

function PlayerCard({
    player,
    myPlayerId,
    phase
}) {
    return (
        <div
            className={`player-card ${player.connected
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

                {phase === "gameplay" && (
                    <div className="player-stats">
                        <span>
                            VP: {
                                player.id === myPlayerId
                                    ? `${player.victoryPoints} (${player.secretVictoryPoints})`
                                    : player.victoryPoints - player.secretVictoryPoints
                            }
                        </span>
                        <span>R: 2</span>
                        <span>DC: 3</span>
                    </div>
                )}
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