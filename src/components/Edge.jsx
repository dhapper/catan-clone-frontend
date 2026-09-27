import "./Edge.css";
import "./ClickableCircle.css";

function Edge({
    edge,
    vertices,
    radius,
    players,
    buildableRoads,
    buildableShips,
    movableShips,
    shipMoveDestinations,
    selectedShipEdge,
    onEdgeClick
}) {
    const vertexA = vertices.find(
        vertex => vertex.id === edge.vertices[0]
    );

    const vertexB = vertices.find(
        vertex => vertex.id === edge.vertices[1]
    );

    const centerX = (vertexA.x + vertexB.x) / 2;
    const centerY = (vertexA.y + vertexB.y) / 2;

    const isBuildable =
        buildableRoads?.includes(edge.id);

    const isShipBuildable =
        buildableShips?.includes(edge.id);

    const isMovableShip =
        movableShips?.includes(edge.id);

    const isShipMoveDestination =
        shipMoveDestinations?.includes(edge.id);

    let fill = "var(--neutral-piece)";

    if (edge.road) {
        const owner = players.find(
            player => player.id === edge.road.playerId
        );

        fill = owner?.color ?? "var(--neutral-piece)";
    }

    if (edge.ship) {
        const owner = players.find(
            player => player.id === edge.ship.playerId
        );

        fill = owner?.color ?? "var(--neutral-piece)";
    }

    // show nothing by default
    const hasRoad = !!edge.road;
    const hasShip = !!edge.ship;

    // console.log(
    //     "EDGE:",
    //     edge.id,
    //     "hasShip:",
    //     hasShip,
    //     "isMovableShip:",
    //     isMovableShip,
    //     "movableShips:",
    //     movableShips
    // );

    const edgeClass =
        isBuildable ||
            isShipBuildable ||
            isMovableShip ||
            isShipMoveDestination
            ? "clickable-circle"
            : hasRoad || hasShip
                ? "edge-existing"
                : "clickable-circle-inactive";
    // if (!isBuildable && !hasRoad) {
    //     return null;
    // }

    // road shape math
    const angle = Math.atan2(
        vertexB.y - vertexA.y,
        vertexB.x - vertexA.x
    ) * 180 / Math.PI;

    const roadTrim = 30;

    const fullRoadLength = Math.sqrt(
        Math.pow(vertexB.x - vertexA.x, 2) +
        Math.pow(vertexB.y - vertexA.y, 2)
    );

    const roadLength = fullRoadLength - roadTrim * 2;

    const radiusTrim = 4;
    radius = radius - radiusTrim;

    if (hasRoad) {
        return (
            <rect
                className="road"
                x={centerX - roadLength / 2}
                y={centerY - radius / 2 + radiusTrim / 2}
                width={roadLength}
                height={radius}
                rx={radius / 3}
                fill={fill}
                transform={`rotate(${angle} ${centerX} ${centerY})`}
            />
        );
    }

    if (
        selectedShipEdge === edge.id &&
        shipMoveDestinations?.length > 0
    ) {
        return null;
    }

    if (hasShip) {
        if (isMovableShip) {
            return (
                <circle
                    className="edge clickable-circle"
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    style={{
                        "--hover-radius": radius * 1.2
                    }}
                    fill="white"
                    onClick={() => onEdgeClick(edge.id)}
                />
            );
        }

        const shipTip = roadLength / 2;
        const shipWidth = radius / 2;

        return (
            <path
                className="ship"
                d={`
                M ${-shipTip} 0
                L ${-shipTip + radius} ${-shipWidth}
                L ${shipTip - radius} ${-shipWidth}
                L ${shipTip} 0
                L ${shipTip - radius} ${shipWidth}
                L ${-shipTip + radius} ${shipWidth}
                Z
            `}
                fill={fill}
                transform={`translate(${centerX} ${centerY}) rotate(${angle})`}
            />
        );
    }

    // if (!isBuildable) {
    //     return null;
    // }

    return (
        <circle
            className={`edge ${edgeClass}`}
            cx={centerX}
            cy={centerY}
            r={radius}
            style={{ "--hover-radius": radius * 1.2 }}
            fill={fill}
            // onClick={() => {
            //     onEdgeClick(edge.id);
            // }}
            onClick={
                isBuildable ||
                    isShipBuildable ||
                    isShipMoveDestination
                    ? () => onEdgeClick(edge.id)
                    : undefined
            }
        />
    );
}

export default Edge;