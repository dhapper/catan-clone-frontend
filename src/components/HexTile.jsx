function HexTile({ tile, size }) {
    const vertices = [];

    for (let i = 0; i < 6; i++) {
        const angle = -90 + i * 60;
        const radians = angle * Math.PI / 180;

        const x =
            tile.x +
            size * Math.cos(radians);

        const y =
            tile.y +
            size * Math.sin(radians);

        vertices.push({ x, y });
    }

    const points = vertices
        .map((vertex) => `${vertex.x},${vertex.y}`)
        .join(" ");

    return (
        <g>
            <polygon
                points={points}
                fill="lightgray"
                stroke="black"
            />

            <text
                x={tile.x}
                y={tile.y - 10}
                textAnchor="middle"
            >
                {tile.type}
            </text>

            <text
                x={tile.x}
                y={tile.y + 10}
                textAnchor="middle"
            >
                {tile.resource}
            </text>

            {tile.numberToken !== null && (
                <text
                    x={tile.x}
                    y={tile.y + 30}
                    textAnchor="middle"
                >
                    {tile.numberToken}
                </text>
            )}
        </g>
    );
}

export default HexTile;