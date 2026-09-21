import { useState } from "react";
import Board from "../components/Board";
import staticBoard from "../data/staticBoard";

function StaticBoard() {
    const [boardScale, setBoardScale] = useState(2);
    const [boardPan, setBoardPan] = useState({ x: 0, y: 0 });

    return (
        <Board
            board={staticBoard}
            phase="lobby"
            subphase="roll_for_turn_order"
            currentPlayerId={null}
            myPlayerId={null}
            buildMode={null}
            diceRoll={null}
            onVertexClick={() => {}}
            onEdgeClick={() => {}}
            onTileClick={() => {}}
            boardScale={boardScale}
            setBoardScale={setBoardScale}
            boardPan={boardPan}
            setBoardPan={setBoardPan}
            robberTileId={null}
            background={true}
        />
    );
}

export default StaticBoard;