import "./Vertex.css";
import { SETUP_SUBPHASES } from "../constants/GameConstants";

function Vertex({
    vertex,
    radius,
    players,
    buildableSettlements,
    subphase,
    onVertexClick
}) {
    let fill = "white";

    if (vertex.building) {
        const owner = players.find(
            player => player.id === vertex.building.playerId
        );

        fill = owner?.color ?? "white";
    }

    const isSettlementPhase =
        subphase === SETUP_SUBPHASES.PLACING_SETTLEMENT;

    const isBuildable =
        isSettlementPhase &&
        buildableSettlements.includes(vertex.id);

    // Show existing buildings and valid settlement placement spots.
    if (!vertex.building && !isBuildable) {
        return null;
    }

    return (
        <circle
            className="vertex"
            cx={vertex.x}
            cy={vertex.y}
            r={radius}
            style={{ "--hover-radius": radius * 1.2 }}
            fill={fill}
            onClick={() => {
                if (isBuildable) {
                    onVertexClick(vertex.id);
                }
            }}
        />
    );
}

export default Vertex;