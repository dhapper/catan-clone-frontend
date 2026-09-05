import "./Popup.css";
import "../panels/Panel.css";
import "./Info.css";
import knightIcon from "../assets/icons/other/knight.svg";
import inventorIcon from "../assets/icons/other/inventor.svg";
import monopolyIcon from "../assets/icons/other/monopoly.svg";
import roadIcon from "../assets/icons/other/road.svg";
import victoryPointIcon from "../assets/icons/other/victory-point.svg";

function Info({
    setShowInfoPanel,
    robberSafetyNumber,
    bankResourceCount,
    victoryPointsNeeded,
    pieceLimits
}) {

    const DevCardDef = ({ icon, text, pieceLimits }) => {
        return (
            <div className="dev-card-def">
                <img src={icon} />
                <p>{text}</p>
            </div>
        );
    };

    return (
        <div className="popup panel info">
            <p>Settings:</p>
            <div className="settings-def">
                <p>Victory points to win: {victoryPointsNeeded}</p>
                <p>Robber Safety Number: {robberSafetyNumber}</p>
                <p>Total cards per resource: {bankResourceCount}</p>
                <p>Roads: {pieceLimits.road}</p>
                <p>Settlements: {pieceLimits.settlement}</p>
                <p>Cities: {pieceLimits.city}</p>
            </div>

            <p className="title-gap">Development Cards:</p>
            <DevCardDef
                icon={knightIcon}
                text="Knight: Move the robber and steal a resource from a player."
            />
            <DevCardDef
                icon={roadIcon}
                text="Road Building: Build 2 roads for free."
            />
            <DevCardDef
                icon={inventorIcon}
                text="Invention: Take 2 resources of your choice from the bank."
            />
            <DevCardDef
                icon={monopolyIcon}
                text="Monopoly: Choose a resource. All players must give you all of that resource they have."
            />
            <DevCardDef
                icon={victoryPointIcon}
                text="Victory Point: Worth 1 victory point."
            />

            <button onClick={() => setShowInfoPanel(false)}>Close</button>
        </div>
    );
}

export default Info;