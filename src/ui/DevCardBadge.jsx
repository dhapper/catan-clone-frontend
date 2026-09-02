import "./DevCardBadge.css";
import socket from "../services/socket";
import knightIcon from "../assets/icons/other/knight.svg";
import inventorIcon from "../assets/icons/other/inventor.svg";
import monopolyIcon from "../assets/icons/other/monopoly.svg";
import roadIcon from "../assets/icons/other/road.svg";
import victoryPointIcon from "../assets/icons/other/victory-point.svg";

function DevCardBadge({
    card,
    isMyTurn,
    isActionPhase,
    devCardPlayed,
    onDevCardPlay
}) {
    const icons = {
        knight: knightIcon,
        invention: inventorIcon,
        monopoly: monopolyIcon,
        road_building: roadIcon,
        victory_point: victoryPointIcon
    };

    const icon = icons[card.type];

    if (!icon) {
        return null;
    }

    const isDisabled =
        card.type !== "victory_point" &&
        (
            !isMyTurn ||
            !isActionPhase ||
            card.boughtThisTurn ||
            devCardPlayed
        );

    const isPlayable =
        card.type !== "victory_point" &&
        isMyTurn &&
        isActionPhase &&
        !card.boughtThisTurn &&
        !devCardPlayed;

    const handleClick = () => {
        if (
            !isMyTurn ||
            !isActionPhase ||
            card.boughtThisTurn ||
            devCardPlayed ||
            card.type === "victory_point"
        ) {
            return;
        }

        if (card.type === "knight") {
            socket.emit("game:playKnight");
        }

        if (card.type === "road_building") {
            socket.emit("game:playRoadBuilding");
        }

        if (card.type === "monopoly") {
            onDevCardPlay("monopoly");
        }

        if (card.type === "invention") {
            onDevCardPlay("invention");
        }
    };

    return (
        <div
            className={`dev-card-badge ${isDisabled ? "dev-card-disabled" : ""
                } ${isPlayable ? "dev-card-playable" : ""
                }`}
            onClick={handleClick}
        >
            <img
                src={icon}
                alt={card.type}
            />
        </div>
    );
}

export default DevCardBadge;