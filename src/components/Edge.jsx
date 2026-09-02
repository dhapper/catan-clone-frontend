import "./Edge.css";
import { playSound } from "../services/soundManager";

function Edge({ edge, vertices, radius, players, buildableRoads, onEdgeClick }) {
    const vertexA = vertices.find(
        vertex => vertex.id === edge.vertices[0]
    );

    const vertexB = vertices.find(
        vertex => vertex.id === edge.vertices[1]
    );

    const centerX = (vertexA.x + vertexB.x) / 2;
    const centerY = (vertexA.y + vertexB.y) / 2;

    const isBuildable =
        buildableRoads.includes(edge.id);

    let fill = "white";

    if (edge.road) {
        const owner = players.find(
            player => player.id === edge.road.playerId
        );

        fill = owner?.color ?? "white";
    }

    // show nothing by default
    const hasRoad = !!edge.road;
    if (!isBuildable && !hasRoad) {
        return null;
    }

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

    if (!isBuildable) {
        return null;
    }

    return (
        <circle
            className="edge"
            cx={centerX}
            cy={centerY}
            r={radius}
            style={{ "--hover-radius": radius * 1.2 }}
            fill={fill}
            onClick={() => {
                onEdgeClick(edge.id);
            }}
        />
    );
}

export default Edge;