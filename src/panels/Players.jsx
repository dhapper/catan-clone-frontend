import "./Players.css";
import socket from "../services/socket";
import PlayerCard from "../ui/PlayerCard";
import { GAME_PHASES } from "../constants/GameConstants";
import "./Panel.css";

function Players({
    players,
    myPlayerId,
    phase,
    subphase,
    turnOrderRolls,
    currentPlayerId,
    setupTurnOrder
}) {

    const sortedPlayers = [...players].sort((a, b) => {
        if (phase === GAME_PHASES.SETUP) {
            const aRolls = turnOrderRolls[a.id];
            const bRolls = turnOrderRolls[b.id];

            const aHasRolled = Array.isArray(aRolls);
            const bHasRolled = Array.isArray(bRolls);

            if (aHasRolled !== bHasRolled) {
                return aHasRolled ? -1 : 1;
            }

            if (!aHasRolled) {
                return (
                    Number(a.id.slice(1)) -
                    Number(b.id.slice(1))
                );
            }

            const aTotal = aRolls[0] + aRolls[1];
            const bTotal = bRolls[0] + bRolls[1];

            if (aTotal !== bTotal) {
                return bTotal - aTotal;
            }

            return (
                Number(a.id.slice(1)) -
                Number(b.id.slice(1))
            );
        }

        const aIndex = setupTurnOrder.indexOf(a.id);
        const bIndex = setupTurnOrder.indexOf(b.id);

        return aIndex - bIndex;
    });

    function claimPlayer(playerId) {
        socket.emit("player:claim", playerId);
    }

    return (
        <div className="panel players">

            <div className="header">
                <p>Players</p>
            </div>

            <div className="player-list">
                {sortedPlayers.map(player => (
                    <div
                        className="player-row"
                        key={player.id}
                    >
                        <PlayerCard
                            player={player}
                            myPlayerId={myPlayerId}
                            phase={phase}
                            currentPlayerId={currentPlayerId}
                        />

                        {phase === GAME_PHASES.SETUP && (
                            <div className="turn-order-rolls">
                                {(turnOrderRolls[player.id] || []).map(
                                    (roll, index) => (
                                        <div
                                            className="dice"
                                            key={index}
                                        >
                                            {roll}
                                        </div>
                                    )
                                )}

                                {player.id === myPlayerId &&
                                    !turnOrderRolls[player.id] && (
                                        <button
                                            onClick={() => {
                                                socket.emit(
                                                    "game:rollForTurnOrder"
                                                );
                                            }}
                                        >
                                            Roll
                                        </button>
                                    )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {sortedPlayers.some(player => !player.connected) && !myPlayerId && (
                <div className="player-list">
                    {sortedPlayers.map(player => (
                        !player.connected && (
                            <button
                                key={player.id}
                                onClick={() => claimPlayer(player.id)}
                            >
                                Play as {player.name}
                            </button>
                        )
                    ))}
                </div>
            )}

            {phase === GAME_PHASES.SETUP && (
                <p>*Ties are decided by join order</p>
            )}

        </div>
    );
}

export default Players;