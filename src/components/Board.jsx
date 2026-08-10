import HexTile from "./HexTile";
import Vertex from "./Vertex";
import Edge from "./Edge";

function Board({ board, onVertexClick, onEdgeClick }) {
    const HEX_SIZE = board.hexSize;

    const minX = Math.min(...board.tiles.map(tile => tile.x));
    const maxX = Math.max(...board.tiles.map(tile => tile.x));
    const minY = Math.min(...board.tiles.map(tile => tile.y));
    const maxY = Math.max(...board.tiles.map(tile => tile.y));

    const padding = HEX_SIZE * 1.5;

    const boardWidth = maxX - minX + padding * 2;
    const boardHeight = maxY - minY + padding * 2;

    const translateX = padding - minX;
    const translateY = padding - minY;

    return (
        <svg
            width={boardWidth}
            height={boardHeight}
        >
            <g transform={`translate(${translateX}, ${translateY})`}>

                {/* Hex tiles */}
                {board.tiles.map((tile) => (
                    <HexTile
                        key={tile.id}
                        tile={tile}
                        size={HEX_SIZE}
                    />
                ))}

                {/* Edge buttons */}
                {board.edges.map((edge) => (
                    <Edge
                        key={edge.id}
                        edge={edge}
                        radius={HEX_SIZE / 6}
                        vertices={board.vertices}
                        players={board.players}
                        buildableRoads={board.buildableRoads}
                        subphase={board.subphase}
                        onEdgeClick={onEdgeClick}
                    />
                ))}

                {/* Vertices */}
                {board.vertices.map((vertex) => (
                    <Vertex
                        key={vertex.id}
                        vertex={vertex}
                        radius={HEX_SIZE / 5}
                        players={board.players}
                        buildableSettlements={board.buildableSettlements}
                        subphase={board.subphase}
                        onVertexClick={onVertexClick}
                    />
                ))}

            </g>
        </svg>
    );
}

export default Board;