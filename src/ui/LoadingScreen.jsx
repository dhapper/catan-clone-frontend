import "./TitleScreen.css";
import StaticBoard from "./StaticBoard";

function LoadingScreen() {
    return (
        <div>
            <div className="component">
                <div className="spinner"></div>
                <br />
                <div className="center-main-msg">Loading game...</div>
            </div>

            <div className="background">
                <StaticBoard />
            </div>
        </div>
    );
}

export default LoadingScreen;