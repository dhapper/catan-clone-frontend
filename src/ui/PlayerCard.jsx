import "./PlayerCard.css";
import vp from "../assets/icons/other/victory-point.svg";
import road from "../assets/icons/other/road.svg";
import knight from "../assets/icons/other/knight.svg";
import hex from "../assets/icons/other/hex.svg";
import card from "../assets/icons/other/card.svg";

function PlayerCard({
    player,
    myPlayerId,
    phase,
    currentPlayerId
}) {
    return (
        <div
            className={`player-card ${player.connected
                ? "connected"
                : "disconnected"
                } ${player.id === currentPlayerId ? "current-turn" : ""}`}
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

                {!player.connected && (
                    <div className="player-status">
                        <i>Disconnected</i>
                    </div>
                )}

                {phase === "gameplay" && (
                    <div className="player-stats">
                        <span>
                            <img
                                className="icon"
                                src={vp}
                                alt="Victory Points"
                            />

                            {
                                player.id === myPlayerId &&
                                    player.secretVictoryPoints > 0
                                    ? `${player.victoryPoints} (${player.victoryPoints + player.secretVictoryPoints})`
                                    : player.victoryPoints
                            }
                        </span>

                        <span>
                            <img
                                className="icon"
                                src={hex}
                                alt="Resources"
                            />

                            {Object.values(player.resources).reduce(
                                (total, amount) => total + amount,
                                0
                            )}
                        </span>

                        <span>
                            <img
                                className="icon"
                                src={card}
                                alt="Development Cards"
                            />

                            {player.devCards.length}
                        </span>

                        <span>
                            <img
                                className={`icon ${player.hasLongestRoad ? "achievement" : ""}`}
                                src={road}
                                alt="Longest Road"
                            />
                            {player.longestRoad}
                        </span>

                        <span>
                            <img
                                className={`icon ${player.hasLargestArmy ? "achievement" : ""}`}
                                src={knight}
                                alt="Largest Army"
                            />
                            {player.knightsPlayed}
                        </span>


                    </div>
                )}
            </div>

            <div className="player-indicators">
                {player.id === myPlayerId && (
                    <div className="player-you">
                        👤︎
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