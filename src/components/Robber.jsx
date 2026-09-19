import robberIcon from "../assets/icons/other/thief.svg";
import "./ClickableCircle.css";

function Robber({
    x,
    y,
    size,
    canPlace,
    visible,
    onClick
}) {

    const isNew = document.documentElement.dataset.theme === "new";

    return (
        <g>
            <circle
                className={
                    canPlace
                        ? "clickable-circle"
                        : "clickable-circle-inactive"
                }
                cx={x + size * 0.5}
                cy={y}
                r={size / 6}
                style={{
                    "--hover-radius": size / 6 * 1.2
                }}
                fill="white"
                onClick={canPlace ? onClick : undefined}
            />

            {visible && (
                <image
                    href={robberIcon}
                    x={x + size * 0.25}
                    y={y - size * 0.25}
                    width={size * 0.5}
                    height={size * 0.5}
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                        pointerEvents: "none",
                        userSelect: "none",
                        filter: isNew
                            ? "brightness(0) invert(1) drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.7))"
                            : "drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.7))"
                    }}
                />
            )}
        </g>
    );
}

export default Robber;