import PortBadge from "../ui/PortBadge";

function Port({ port, vertices }) {
    const vertexA = vertices.find(
        vertex => vertex.id === port.vertices[0]
    );

    const vertexB = vertices.find(
        vertex => vertex.id === port.vertices[1]
    );

    if (!vertexA || !vertexB) {
        return null;
    }

    const centerX =
        (vertexA.x + vertexB.x) / 2;

    const centerY =
        (vertexA.y + vertexB.y) / 2;

    // Direction outward from the hex for each side
    const sideAngles = [
        -60,
        0,
        60,
        120,
        180,
        240
    ];

    const normalAngle =
        sideAngles[port.side];

    const normalRadians =
        normalAngle * Math.PI / 180;

    const normalX =
        Math.cos(normalRadians);

    const normalY =
        Math.sin(normalRadians);

    // Keep the same translation distance
    const portOffset = 60;

    const offsetX =
        normalX * portOffset;

    const offsetY =
        normalY * portOffset;

    const portX =
        centerX + offsetX;

    const portY =
        centerY + offsetY;

    // Dock rotation is perpendicular to the side
    const angle =
        normalAngle + 180;

    const badgeOffset = -25;

    const badgeX =
        portX + normalX * badgeOffset;

    const badgeY =
        portY + normalY * badgeOffset;

    return (
        <>
            <g
                className="port"
                transform={`
                    translate(${portX}, ${portY})
                    rotate(${angle})
                `}
            >
                <rect
                    x="30"
                    y="-60"
                    width="30"
                    height="120"
                    rx="3"
                    fill="#534433"
                    stroke="var(--board-outline)"
                    strokeWidth="5"
                />
            </g>

            <g
                className="port"
                transform={`translate(${badgeX}, ${badgeY})`}
            >
                <PortBadge
                    port={port}
                    size={35}
                />
            </g>
        </>
    );
}

export default Port;