import TitleCard from "../ui/TitleCard";
import LobbyMenu from "../panels/LobbyMenu";
import "./TitleScreen.css";
import StaticBoard from "./StaticBoard";

function TitleScreen() {
    return (
        <div>
            <div className="component">
                <TitleCard />
                <LobbyMenu />
            </div>

            <div className="background">
                <StaticBoard />
            </div>
        </div>
    );
}

export default TitleScreen;