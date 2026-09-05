import "./Actions.css";
import { GAMEPLAY_SUBPHASES } from "../constants/GameConstants";
import socket from "../services/socket";
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
    setShowTradeCreation,
    pieces
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
            <div className="header">
                <p>Actions</p>
            </div>

            <div className="action-buttons">

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
                    Road x{pieces.road}
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
                    Settlement x{pieces.settlement}
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
                    City x{pieces.city}
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
                    Card
                </button>

                <button
                    disabled={isRoadBuildingDevCardActive}
                    onClick={() => {
                        socket.emit("game:endTurn");
                    }}
                >
                    End Turn
                </button>

            </div>
        </div>
    );
}

export default Actions;