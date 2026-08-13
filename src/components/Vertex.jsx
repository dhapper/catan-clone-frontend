import "./Vertex.css";
import { SETUP_SUBPHASES } from "../constants/GameConstants";

function Vertex({
    vertex,
    radius,
    players,
    buildableSettlements,
    buildableCities,
    subphase,
    buildMode,
    onVertexClick
}) {
    let fill = "white";

    const isSetupSettlementPhase =
        subphase === SETUP_SUBPHASES.PLACING_SETTLEMENT;

    const isSettlementBuildable =
        (
            isSetupSettlementPhase ||
            buildMode === "settlement"
        ) &&
        buildableSettlements.includes(vertex.id);

    const isCityBuildable =
        buildMode === "city" &&
        buildableCities.includes(vertex.id);

    // Show valid city upgrades as white.
    if (isCityBuildable) {
        fill = "white";
    } else if (vertex.building) {
        const owner = players.find(
            player => player.id === vertex.building.playerId
        );

        fill = owner?.color ?? "white";
    }

    const isBuildable =
        isSettlementBuildable ||
        isCityBuildable;

    // Nothing to display here.
    if (!vertex.building && !isBuildable) {
        return null;
    }

    const buildingType = vertex.building?.type;

    return (
        <g
            className={isBuildable ? "vertex-buildable" : "vertex-existing"}
            onClick={() => {
                if (isBuildable) {
                    onVertexClick(vertex.id);
                }
            }}
        >
            <circle
                className="vertex"
                cx={vertex.x}
                cy={vertex.y}
                r={radius}
                style={{
                    "--hover-radius": radius * 1.2
                }}
                fill={fill}
            />

            {buildingType === "city" && (
                <text
                    x={vertex.x}
                    y={vertex.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="city-star"
                >
                    ★
                </text>
            )}
        </g>
    );
}

export default Vertex;