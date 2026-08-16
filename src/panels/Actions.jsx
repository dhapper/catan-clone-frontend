import "./Actions.css";
import { GAMEPLAY_SUBPHASES } from "../constants/GameConstants";
import socket from "../socket";
import { STRUCTURES } from "../constants/GameConstants";

function Actions({
    myPlayerId,
    currentPlayerId,
    phase,
    subphase,
    diceRoll,
    buildMode,
    setBuildMode,
    player,
    buildAvailability,
    buildableRoads,
    buildableSettlements,
    buildableCities,
    setShowTradeCreation
}) {
    const isMyTurn = myPlayerId === currentPlayerId;

    const isProductionPhase =
        subphase === GAMEPLAY_SUBPHASES.PRODUCTION;

    const isActionPhase =
        subphase === GAMEPLAY_SUBPHASES.ACTION;

    const canBuildRoad =
        isMyTurn &&
        buildAvailability?.road &&
        buildableRoads?.length > 0;

    const canBuildSettlement =
        isMyTurn &&
        buildAvailability?.settlement &&
        buildableSettlements?.length > 0;

    const canBuildCity =
        isMyTurn &&
        buildAvailability?.city &&
        buildableCities?.length > 0;

    return (
        <div className="panel actions">
            <p>Actions</p>

            {/* <p>
                {isMyTurn
                    ? "Your turn"
                    : "Waiting for your turn"}
            </p> */}

            {/* Production phase */}
            {isProductionPhase && (
                <>
                    {isMyTurn ? (
                        <button
                            onClick={() => {
                                socket.emit("game:rollProductionDice");
                            }}
                        >
                            Roll Dice
                        </button>
                    ) : (
                        <p>
                            Waiting for current player to roll dice...
                        </p>
                    )}
                </>
            )}

            {/* Action phase */}
            {isActionPhase && (
                <>
                    {diceRoll && (
                        <p>
                            Dice Roll: {diceRoll[0]} + {diceRoll[1]}
                        </p>
                    )}

                    {isMyTurn && (
                        <>
                            <button
                                disabled={!canBuildRoad}
                                onClick={() =>
                                    setBuildMode(
                                        buildMode === STRUCTURES.ROAD
                                            ? null
                                            : STRUCTURES.ROAD
                                    )
                                }
                            >
                                Build Road
                            </button>

                            <button
                                disabled={!canBuildSettlement}
                                onClick={() =>
                                    setBuildMode(
                                        buildMode === STRUCTURES.SETTLEMENT
                                            ? null
                                            : STRUCTURES.SETTLEMENT
                                    )
                                }
                            >
                                Build Settlement
                            </button>

                            <button
                                disabled={!canBuildCity}
                                onClick={() =>
                                    setBuildMode(
                                        buildMode === STRUCTURES.CITY
                                            ? null
                                            : STRUCTURES.CITY
                                    )
                                }
                            >
                                Build City
                            </button>

                            <button
                                onClick={() => setShowTradeCreation(true)}
                            >
                                Trade
                            </button>

                            <button disabled={!isMyTurn}>
                                Buy Development Card
                            </button>

                            <button
                                disabled={!isMyTurn}
                                onClick={() => {
                                    socket.emit("game:endTurn");
                                }}
                            >
                                End Turn
                            </button>
                        </>
                    )}

                </>
            )}
        </div>
    );
}

export default Actions;