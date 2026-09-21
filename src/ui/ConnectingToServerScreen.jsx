import "./TitleScreen.css";
import StaticBoard from "./StaticBoard";

function ConnectingToServerScreen() {
    return (
        <div>
            <div className="component">
                <div className="spinner"></div>
                <br />
                <div className="center-main-msg">Connecting to server...</div>
                <br />
                The server may take a few minutes to start.
            </div>

            <div className="background">
                <StaticBoard />
            </div>
        </div>
    );
}

export default ConnectingToServerScreen;