import pirateIcon from "../assets/icons/other/pirate.svg";
import "./ClickableCircle.css";

function Pirate({
    x,
    y,
    size,
    canPlace,
    visible,
    onClick,
    tileType
}) {

    const isNew = document.documentElement.dataset.theme === "new";
    const isMountain = tileType === "mountain";
    const isWhite = isNew || isMountain;

    const iconX = x - size/2;
    const iconY = y - size/2;

    const circleSize = size/3;
    const circleX = x;
    const circleY = y;

    return (
        <g>
            <circle
                className={
                    canPlace
                        ? "clickable-circle"
                        : "clickable-circle-inactive"
                }
                cx={circleX}
                cy={circleY}
                r={circleSize}
                style={{
                    "--hover-radius": circleSize * 1.2
                }}
                fill="white"
                onClick={canPlace ? onClick : undefined}
            />

            {visible && (
                <image
                    href={pirateIcon}
                    x={iconX}
                    y={iconY}
                    width={size}
                    height={size}
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                        pointerEvents: "none",
                        userSelect: "none",
                        filter: isWhite
                            ? "brightness(0) invert(1) drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.7))"
                            : "drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.7))"
                    }}
                />
            )}
        </g>
    );
}

export default Pirate;