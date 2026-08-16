import "./PortBadge.css";
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

function PortBadge({ port }) {
    const iconSize = 50;
    const portRadius = 50;

    return (
        <>
            <circle
                className="port-background"
                r={portRadius}
            />

            {port.resource === "any" ? (
                <text
                    className="port-any"
                    x="0"
                    y={-portRadius * 0.2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                    userSelect="none"
                >
                    ?
                </text>
            ) : (
                RESOURCE_ICONS[port.resource] && (
                    <image
                        href={RESOURCE_ICONS[port.resource]}
                        x={-iconSize / 2}
                        y={-iconSize / 2 - portRadius * 0.3}
                        width={iconSize}
                        height={iconSize}
                        preserveAspectRatio="xMidYMid meet"
                        style={{
                            pointerEvents: "none",
                            userSelect: "none"
                        }}
                    />
                )
            )}

            <text
                className="port-offer"
                x="0"
                y={portRadius * 0.6}
                textAnchor="middle"
                dominantBaseline="middle"
                pointerEvents="none"
                userSelect="none"
            >
                {port.offer}
            </text>
        </>
    );
}

export default PortBadge;