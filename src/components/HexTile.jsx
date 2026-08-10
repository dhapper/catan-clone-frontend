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
        <polygon
            points={points}
            fill="lightgray"
            stroke="black"
        />
    );
}

export default HexTile;