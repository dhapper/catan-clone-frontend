import "./Setup.css";
import socket from "../socket";
import PlayerCard from "../ui/PlayerCard";
import { GAME_PHASES } from "../constants/GameConstants";

function Setup({
    players,
    myPlayerId,
    phase,
    subphase,
    turnOrderRolls
}) {
    const sortedPlayers = [...players].sort((a, b) => {
        const aRolls = turnOrderRolls[a.id];
        const bRolls = turnOrderRolls[b.id];

        const aHasRolled = Array.isArray(aRolls);
        const bHasRolled = Array.isArray(bRolls);

        // Players who have rolled go above players who haven't.
        if (aHasRolled !== bHasRolled) {
            return aHasRolled ? -1 : 1;
        }

        // Neither player has rolled yet.
        if (!aHasRolled) {
            return (
                Number(a.id.slice(1)) -
                Number(b.id.slice(1))
            );
        }

        const aTotal = aRolls[0] + aRolls[1];
        const bTotal = bRolls[0] + bRolls[1];

        // Higher roll total goes first.
        if (aTotal !== bTotal) {
            return bTotal - aTotal;
        }

        // Tie-breaker: join order.
        return (
            Number(a.id.slice(1)) -
            Number(b.id.slice(1))
        );
    });

    return (
        <div className="setup">
            <div className="setup-player-list">
                {sortedPlayers.map(player => (
                    <div
                        className="setup-player-row"
                        key={player.id}
                    >
                        <PlayerCard
                            player={player}
                            myPlayerId={myPlayerId}
                        />

                        {phase === GAME_PHASES.SETUP && (
                            <div className="turn-order-rolls">
                                {(turnOrderRolls[player.id] || []).map(
                                    (roll, index) => (
                                        <div
                                            className="turn-order-roll"
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
            <p>*Ties are decided by join order</p>
        </div>
    );
}

export default Setup;