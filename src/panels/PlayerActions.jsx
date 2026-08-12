import socket from "../socket";
import { GAME_PHASES, GAMEPLAY_SUBPHASES } from "../Constants/GameConstants";

function PlayerActions({
    players,
    myPlayerId,
    currentPlayerId,
    phase,
    subphase,
    diceRoll
}) {
    const isMyTurn = myPlayerId === currentPlayerId;

    const currentPlayer = players.find(
        player => player.id === currentPlayerId
    );

    return (
        <div className="player-actions">
            {phase === GAME_PHASES.GAMEPLAY &&
                subphase === GAMEPLAY_SUBPHASES.PRODUCTION && (
                    <>
                        {isMyTurn ? (
                            <button
                                onClick={() => {
                                    socket.emit(
                                        "game:rollProductionDice"
                                    );
                                }}
                            >
                                Roll Dice
                            </button>
                        ) : (
                            <div>
                                Waiting for {currentPlayer?.name} to roll...
                            </div>
                        )}
                    </>
                )}

            {phase === GAME_PHASES.GAMEPLAY &&
                subphase === GAMEPLAY_SUBPHASES.ACTION &&
                diceRoll && (
                    <div>
                        <div>
                            Rolled: {diceRoll[0]} + {diceRoll[1]}
                        </div>

                        {isMyTurn && (
                            <button
                                onClick={() => {
                                    socket.emit("game:endTurn");
                                }}
                            >
                                End Turn
                            </button>
                        )}
                    </div>
                )}
        </div>
    );
}

export default PlayerActions;