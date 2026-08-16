import "./ResourceToken.css";

import hillBg from "../assets/tileBg/hill.jpg";
import mountainBg from "../assets/tileBg/mountain.jpg";
import pastureBg from "../assets/tileBg/pasture.jpg";
import fieldBg from "../assets/tileBg/field.jpg";
import forestBg from "../assets/tileBg/forest.jpg";

import brickIcon from "../assets/icons/transparent_res/brick-pile.svg";
import sheepIcon from "../assets/icons/transparent_res/sheep.svg";
import stoneIcon from "../assets/icons/transparent_res/stone-pile.svg";
import wheatIcon from "../assets/icons/transparent_res/wheat.svg";
import woodIcon from "../assets/icons/transparent_res/wood-pile.svg";

const RESOURCE_ICONS = {
    brick: brickIcon,
    sheep: sheepIcon,
    ore: stoneIcon,
    wheat: wheatIcon,
    wood: woodIcon
};

const RESOURCE_BACKGROUNDS = {
    brick: hillBg,
    ore: mountainBg,
    wheat: fieldBg,
    sheep: pastureBg,
    wood: forestBg
};

function ResourceToken({
    resource,
    amount,
    hideIfZero = false,
    hideAmount = false
}) {
    if (hideIfZero && amount === 0) {
        return null;
    }

    const icon = RESOURCE_ICONS[resource];
    const background = RESOURCE_BACKGROUNDS[resource];

    const isEmpty =
        amount === 0 &&
        !hideAmount;

    return (
        <div
            className={`resource-token ${isEmpty ? "resource-token-empty" : ""
                }`}
            style={{
                backgroundImage: `url(${background})`
            }}
        >
            <img src={icon} alt={resource} />

            {!hideAmount && (
                <span
                    className={`resource-token-badge ${isEmpty ? "resource-token-badge-empty" : ""
                        }`}
                >
                    {amount}
                </span>
            )}
        </div>
    );
}

export default ResourceToken;