import "./Vertex.css";
import { SETUP_SUBPHASES } from "../constants/GameConstants";
import { playSound } from "../services/soundManager";

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

    function getContrastColor(color) {
        if (color.startsWith("#")) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            const brightness =
                (r * 299 + g * 587 + b * 114) / 1000;

            return brightness > 128 ? "black" : "white";
        }

        const lightColors = [
            "yellow",
            "skyblue"
        ];

        return lightColors.includes(color)
            ? "black"
            : "white";
    }

    const starColor = getContrastColor(fill);

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
                r={buildingType === "city" ? radius * 1.4 : radius}
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
                    fill={starColor}
                >
                    ★
                </text>
            )}
        </g>
    );
}

export default Vertex;