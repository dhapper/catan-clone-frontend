import "./Actions.css";
import { GAMEPLAY_SUBPHASES } from "../constants/GameConstants";
import socket from "../services/socket";
import { STRUCTURES } from "../constants/GameConstants";
import { playSound } from "../services/soundManager";

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

    const isRoadBuildingDevCardActive =
        isMyTurn &&
        isActionPhase &&
        player?.roadBuildingRemaining > 0;

    const canBuildRoad =
        isMyTurn &&
        buildAvailability?.road &&
        buildableRoads?.length > 0 &&
        !isRoadBuildingDevCardActive;

    const canBuildSettlement =
        isMyTurn &&
        buildAvailability?.settlement &&
        buildableSettlements?.length > 0 &&
        !isRoadBuildingDevCardActive;

    const canBuildCity =
        isMyTurn &&
        buildAvailability?.city &&
        buildableCities?.length > 0 &&
        !isRoadBuildingDevCardActive;

    const canBuyDevCard =
        isMyTurn &&
        buildAvailability?.developmentCard &&
        !isRoadBuildingDevCardActive;

    return (
        <div className="panel actions">
            <p>Actions</p>


            {/* Production phase */}
            {isProductionPhase && (
                <>
                    {isMyTurn ? (
                        <button
                            onClick={() => {
                                socket.emit("game:rollProductionDice");
                                playSound("diceRoll");
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

            {subphase === GAMEPLAY_SUBPHASES.DISCARDING && (
                <>
                    {diceRoll && (
                        <p>
                            Dice Roll: {diceRoll[0]} + {diceRoll[1]}
                        </p>
                    )}

                    <p>Waiting for players to discard...</p>
                </>
            )}

            {/* Action phase */}
            {isActionPhase && (
                <>
                    {diceRoll && (

                            <div className="dice-roll">
                                <p>Dice Roll: </p>
                                <div className="dice">
                                    {diceRoll[0]}
                                </div>
                                <div className="dice">
                                    {diceRoll[1]}
                                </div>
                            </div>
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
                                disabled={isRoadBuildingDevCardActive}
                                onClick={() => setShowTradeCreation(true)}
                            >
                                Trade
                            </button>

                            <button
                                disabled={!canBuyDevCard}
                                onClick={() => {
                                    socket.emit("game:buyDevCard");
                                }}
                            >
                                Buy Development Card
                            </button>

                            <button
                                disabled={isRoadBuildingDevCardActive}
                                onClick={() => {
                                    socket.emit("game:endTurn");
                                    playSound("pickupDice");
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