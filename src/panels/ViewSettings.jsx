// import "./TurnLog.css";

function ViewSettings({ recenterBoard, resetBoardZoom }) {


    return (
        <div className="panel">

            <div className="header">
                <p>View</p>
            </div>

            <button onClick={recenterBoard}>
                Recenter Board
            </button>

            <button onClick={resetBoardZoom}>
                Reset Zoom
            </button>
        </div>
    );
}

export default ViewSettings;