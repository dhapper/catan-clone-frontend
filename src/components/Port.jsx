import PortBadge from "../ui/PortBadge";

function Port({ port, vertices }) {
    const vertexA = vertices.find(
        vertex => vertex.id === port.vertices[0]
    );

    const vertexB = vertices.find(
        vertex => vertex.id === port.vertices[1]
    );

    const centerX =
        (vertexA.x + vertexB.x) / 2;

    const centerY =
        (vertexA.y + vertexB.y) / 2;

    // Edge direction
    const edgeX = vertexB.x - vertexA.x;
    const edgeY = vertexB.y - vertexA.y;

    // Perpendicular direction
    let normalX = -edgeY;
    let normalY = edgeX;

    // Rectangle angle: perpendicular to edge
    const angle =
        Math.atan2(edgeY, edgeX) * (180 / Math.PI) + 90;

    // Make the normal point away from the board center
    const boardCenterX =
        vertices.reduce((sum, vertex) => sum + vertex.x, 0) /
        vertices.length;

    const boardCenterY =
        vertices.reduce((sum, vertex) => sum + vertex.y, 0) /
        vertices.length;

    const toPortX = centerX - boardCenterX;
    const toPortY = centerY - boardCenterY;

    if (
        normalX * toPortX +
        normalY * toPortY < 0
    ) {
        normalX = -normalX;
        normalY = -normalY;
    }

    const normalLength =
        Math.sqrt(
            normalX * normalX +
            normalY * normalY
        );

    const portOffset = 60;

    const offsetX =
        (normalX / normalLength) * portOffset;

    const offsetY =
        (normalY / normalLength) * portOffset;

    return (

        <>

            <g
                className="port"
                transform={`translate(${centerX + offsetX}, ${centerY + offsetY}) rotate(${angle})`}
            >
                <rect
                    x="10"
                    y="-60 "
                    width="50"
                    height="120"
                    rx="3"
                    fill="#534433"
                    stroke="black"
                    strokeWidth="5"
                />
            </g>


            <g
                className="port"
                transform={`translate(${centerX + offsetX}, ${centerY + offsetY})`}
            >
                <PortBadge port={port} />
            </g>

        </>
    );
}

export default Port;