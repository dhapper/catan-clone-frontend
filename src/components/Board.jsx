import { useRef } from "react";
import HexTile from "./HexTile";
import Vertex from "./Vertex";
import Edge from "./Edge";
import Port from "./Port";

function Board({
    board,
    phase,
    subphase,
    currentPlayerId,
    myPlayerId,
    buildMode,
    diceRoll,
    onVertexClick,
    onEdgeClick,
    boardScale,
    setBoardScale,
    boardPan,
    setBoardPan
}) {
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

    const canPlaceSetupSettlement =
        phase === "setup" &&
        subphase === "placing_settlement" &&
        currentPlayerId === myPlayerId;

    const canPlaceGameplaySettlement =
        buildMode === "settlement" &&
        phase === "gameplay" &&
        subphase === "action" &&
        currentPlayerId === myPlayerId;

    const canPlaceCity =
        buildMode === "city" &&
        phase === "gameplay" &&
        subphase === "action" &&
        currentPlayerId === myPlayerId;

    const canPlaceRoad =
        (
            phase === "setup" &&
            subphase === "placing_road" &&
            currentPlayerId === myPlayerId
        ) ||
        (
            phase === "gameplay" &&
            subphase === "action" &&
            buildMode === "road" &&
            currentPlayerId === myPlayerId
        );

    const canPlaceRobber =
        // subphase === "placeRobber" &&
        subphase === "placing_settlement" &&
        currentPlayerId === myPlayerId;

    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const panStart = useRef({ x: 0, y: 0 });
    const didDrag = useRef(false);

    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 3;
    const ZOOM_STEP = 0.1;

    function handleWheel(event) {
        event.preventDefault();

        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();

        // Convert mouse position from screen pixels
        // into SVG/viewBox coordinates.
        const mouseX =
            (event.clientX - rect.left) *
            (boardWidth / rect.width);

        const mouseY =
            (event.clientY - rect.top) *
            (boardHeight / rect.height);

        const centerX = boardWidth / 2;
        const centerY = boardHeight / 2;

        const zoomDirection = event.deltaY < 0 ? 1 : -1;

        const newScale = Math.min(
            MAX_ZOOM,
            Math.max(
                MIN_ZOOM,
                boardScale + zoomDirection * ZOOM_STEP
            )
        );

        if (newScale === boardScale) {
            return;
        }

        // Find the board point currently underneath the mouse.
        const boardPointX =
            (mouseX - boardPan.x - centerX) / boardScale +
            centerX;

        const boardPointY =
            (mouseY - boardPan.y - centerY) / boardScale +
            centerY;

        // Keep that exact board point underneath the mouse
        // after zooming.
        const newPanX =
            mouseX -
            (boardPointX - centerX) * newScale -
            centerX;

        const newPanY =
            mouseY -
            (boardPointY - centerY) * newScale -
            centerY;

        setBoardScale(newScale);

        setBoardPan({
            x: newPanX,
            y: newPanY
        });
    }

    function handleMouseDown(event) {
        if (event.button !== 0) {
            return;
        }

        isDragging.current = true;
        didDrag.current = false;

        dragStart.current = {
            x: event.clientX,
            y: event.clientY
        };

        panStart.current = {
            x: boardPan.x,
            y: boardPan.y
        };
    }

    function handleMouseMove(event) {
        if (!isDragging.current) {
            return;
        }

        const dx = event.clientX - dragStart.current.x;
        const dy = event.clientY - dragStart.current.y;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            didDrag.current = true;
        }

        if (didDrag.current) {
            setBoardPan({
                x: panStart.current.x + dx,
                y: panStart.current.y + dy
            });
        }
    }

    function handleMouseUp() {
        isDragging.current = false;
    }

    function handleClickCapture(event) {
        if (didDrag.current) {
            event.preventDefault();
            event.stopPropagation();

            didDrag.current = false;
        }
    }

    console.log("PORTS:", board.ports);

    return (
        <svg
            width={boardWidth}
            height={boardHeight}
            viewBox={`0 0 ${boardWidth} ${boardHeight}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClickCapture={handleClickCapture}
            style={{
                cursor: isDragging.current
                    ? "grabbing"
                    : "grab"
            }}
        >
            <g
                transform={`
                    translate(${boardPan.x}, ${boardPan.y})
                    translate(${boardWidth / 2}, ${boardHeight / 2})
                    scale(${boardScale})
                    translate(${-boardWidth / 2}, ${-boardHeight / 2})
                    translate(${translateX}, ${translateY})
                `}
            >

                {/* Ports */}
                {board.ports.map((port) => (
                    <Port
                        key={port.edgeId}
                        port={port}
                        vertices={board.vertices}
                    />
                ))}

                {/* Hex tiles */}
                {board.tiles.map((tile) => (
                    <HexTile
                        key={tile.id}
                        tile={tile}
                        size={HEX_SIZE}
                        diceRoll={diceRoll}
                        subphase={subphase}
                        canPlaceRobber={canPlaceRobber}
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
                        buildableRoads={
                            canPlaceRoad
                                ? board.buildableRoads
                                : []
                        }
                        onEdgeClick={onEdgeClick}
                    />
                ))}

                {/* Vertices */}
                {board.vertices.map((vertex) => (
                    <Vertex
                        key={vertex.id}
                        vertex={vertex}
                        radius={HEX_SIZE / 6}
                        players={board.players}
                        buildableSettlements={
                            canPlaceSetupSettlement ||
                                canPlaceGameplaySettlement
                                ? board.buildableSettlements
                                : []
                        }
                        buildableCities={
                            canPlaceCity
                                ? board.buildableCities
                                : []
                        }
                        subphase={subphase}
                        buildMode={buildMode}
                        onVertexClick={onVertexClick}
                    />
                ))}

            </g>
        </svg>
    );
}

export default Board;