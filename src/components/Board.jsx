import { useRef } from "react";
import HexTile from "./HexTile";
import Vertex from "./Vertex";
import Edge from "./Edge";
import Port from "./Port";
import {
    SETUP_SUBPHASES,
    GAMEPLAY_SUBPHASES,
    GAME_PHASES
} from "../constants/GameConstants";

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
    onTileClick,
    boardScale,
    setBoardScale,
    boardPan,
    setBoardPan,
    robberTileId
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
        phase === GAME_PHASES.SETUP &&
        subphase === SETUP_SUBPHASES.PLACING_SETTLEMENT &&
        currentPlayerId === myPlayerId;

    const canPlaceGameplaySettlement =
        buildMode === "settlement" &&
        phase === GAME_PHASES.GAMEPLAY &&
        subphase === GAMEPLAY_SUBPHASES.ACTION &&
        currentPlayerId === myPlayerId;

    const canPlaceCity =
        buildMode === "city" &&
        phase === GAME_PHASES.GAMEPLAY &&
        subphase === GAMEPLAY_SUBPHASES.ACTION &&
        currentPlayerId === myPlayerId;

    const canPlaceRoad =
        (
            phase === GAME_PHASES.SETUP &&
            subphase === SETUP_SUBPHASES.PLACING_ROAD &&
            currentPlayerId === myPlayerId
        ) ||
        (
            phase === GAME_PHASES.GAMEPLAY &&
            subphase === GAMEPLAY_SUBPHASES.ACTION &&
            buildMode === "road" &&
            currentPlayerId === myPlayerId
        );

    const canPlaceRobber =
        phase === GAME_PHASES.GAMEPLAY &&
        subphase === GAMEPLAY_SUBPHASES.ROBBER_PLACEMENT &&
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

        const boardPointX =
            (mouseX - boardPan.x - centerX) / boardScale +
            centerX;

        const boardPointY =
            (mouseY - boardPan.y - centerY) / boardScale +
            centerY;

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

    return (
        <svg
            width={boardWidth}
            height={boardHeight}
            viewBox={`0 0 ${boardWidth} ${boardHeight}`}
            // preserveAspectRatio="xMidYMid meet"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClickCapture={handleClickCapture}
            style={{
                cursor: isDragging.current ? "grabbing" : "grab",
                overflow: "visible"
            }}
        >

            <defs>
                <filter
                    id="island-shadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feDropShadow
                        dx="0"
                        dy="20"
                        stdDeviation="60"
                        floodColor="#c2a66b"
                        floodOpacity="1"
                    />
                </filter>
            </defs>

            <g
                filter="url(#island-shadow)"
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
                        robberTileId={robberTileId}
                        onTileClick={onTileClick}
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