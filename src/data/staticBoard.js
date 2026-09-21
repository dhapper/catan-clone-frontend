const HEX_SIZE = 120;

const ROW_SIZES = [6, 7, 6, 7, 6];

const TILE_DATA = [

    // ["pasture", "wheat", 9],
    // ["field", "brick", 4],
    // ["forest", "wood", 10],
    // ["mountain", "sheep", 3],s
    // ["hill", "sheep", 5],
    // ["hill", "sheep", 5],

    ["forest", "wheat", 4],
    ["mountain", "wood", 10],
    ["hill", "brick", 11],
    ["field", "wheat", 6],
    ["pasture", "ore", 8],
    ["forest", "wheat", 4],

    ["hill", "brick", 11],
    ["field", "wheat", 6],
    ["pasture", "ore", 8],
    ["forest", "wheat", 4],
    ["mountain", "wood", 10],
    ["hill", "brick", 11],
    ["field", "wheat", 6],

    ["forest", "wheat", 4],
    ["mountain", "wood", 10],
    ["hill", "brick", 11],
    ["field", "wheat", 6],
    ["pasture", "ore", 8],
    ["forest", "wheat", 4],

    ["field", "wheat", 6],
    ["pasture", "ore", 8],
    ["forest", "wheat", 4],
    ["mountain", "wood", 10],
    ["hill", "brick", 11],
    ["field", "wheat", 6],
    ["mountain", "wood", 10],

    ["hill", "brick", 11],
    ["field", "wheat", 6],
    ["pasture", "ore", 8],
    ["forest", "wheat", 4],
    ["mountain", "wood", 10],
    ["hill", "brick", 11],
];

function createBoard() {
    const tiles = [];
    const vertices = [];
    const edges = [];

    const vertexLookup = new Map();
    const edgeLookup = new Map();

    let tileId = 0;
    let vertexId = 0;
    let edgeId = 0;

    const maxRowSize = Math.max(...ROW_SIZES);

    function getVertex(x, y) {
        const key = `${x.toFixed(6)},${y.toFixed(6)}`;

        if (vertexLookup.has(key)) {
            return vertexLookup.get(key);
        }

        const vertex = {
            id: `v${vertexId++}`,
            x,
            y,
            adjacentTiles: [],
            adjacentVertices: [],
            adjacentEdges: [],
            building: null,
        };

        vertices.push(vertex);
        vertexLookup.set(key, vertex);

        return vertex;
    }

    function getEdge(vertexA, vertexB) {
        const key = [vertexA.id, vertexB.id].sort().join("-");

        if (edgeLookup.has(key)) {
            return edgeLookup.get(key);
        }

        const edge = {
            id: `e${edgeId++}`,
            vertices: [vertexA.id, vertexB.id],
            adjacentTiles: [],
            road: null,
        };

        edges.push(edge);
        edgeLookup.set(key, edge);

        vertexA.adjacentVertices.push(vertexB.id);
        vertexB.adjacentVertices.push(vertexA.id);

        vertexA.adjacentEdges.push(edge.id);
        vertexB.adjacentEdges.push(edge.id);

        return edge;
    }

    for (let row = 0; row < ROW_SIZES.length; row++) {
        const numberOfTiles = ROW_SIZES[row];

        const horizontalSpacing = Math.sqrt(3) * HEX_SIZE;
        const rowWidth = (numberOfTiles - 1) * horizontalSpacing;
        const maxRowWidth = (maxRowSize - 1) * horizontalSpacing;
        const rowShift = (maxRowWidth - rowWidth) / 2;

        for (let column = 0; column < numberOfTiles; column++) {
            const x = rowShift + column * horizontalSpacing;
            const y = row * (1.5 * HEX_SIZE);

            const [type, resource, numberToken] = TILE_DATA[tileId];

            const tile = {
                id: `t${tileId}`,
                row,
                column,
                x,
                y,
                type,
                resource,
                numberToken,
                vertices: [],
                edges: [],
            };

            for (let i = 0; i < 6; i++) {
                const angle = -90 + i * 60;
                const radians = angle * Math.PI / 180;

                const vertexX = x + HEX_SIZE * Math.cos(radians);
                const vertexY = y + HEX_SIZE * Math.sin(radians);

                const vertex = getVertex(vertexX, vertexY);

                tile.vertices.push(vertex.id);
                vertex.adjacentTiles.push(tile.id);
            }

            for (let i = 0; i < 6; i++) {
                const vertexA = vertices.find(v => v.id === tile.vertices[i]);
                const vertexB = vertices.find(
                    v => v.id === tile.vertices[(i + 1) % 6]
                );

                const edge = getEdge(vertexA, vertexB);

                tile.edges.push(edge.id);
                edge.adjacentTiles.push(tile.id);
            }

            tiles.push(tile);
            tileId++;
        }
    }

    return {
        rowSizes: ROW_SIZES,
        hexSize: HEX_SIZE,

        phase: "lobby",
        subphase: "roll_for_turn_order",

        players: [],
        currentPlayerId: null,

        buildableRoads: [],
        buildableSettlements: [],
        buildableCities: [],

        tiles,
        vertices,
        edges,

        ports: [],
    };
}

const staticBoard = createBoard();

export default staticBoard;