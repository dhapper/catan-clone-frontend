import "./SpecialVictoryPointBadge.css";
import KnightIcon from "../assets/icons/other/knight.svg";
import RoadIcon from "../assets/icons/other/road.svg";

function SpecialVictoryPointBadge({ type }) {
    const icons = {
        largest_army: KnightIcon,
        longest_road: RoadIcon
    };

    const icon = icons[type];

    if (!icon) {
        return null;
    }

    return (
        <div className="special-victory-badge">
            <img
                src={icon}
                alt={type}
            />
        </div>
    );
}

export default SpecialVictoryPointBadge;