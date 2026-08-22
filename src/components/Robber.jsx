import robberIcon from "../assets/icons/other/pawn.svg";

function Robber({
    x,
    y,
    size,
    canPlace,
    visible,
    onClick
}) {

    // if (visible) {
    //     console.log("VISIBLE ROBBER:", {
    //         visible,
    //         x,
    //         y
    //     });
    // }

    return (
        <g>
            {canPlace && (
                <circle
                    className="placeable"
                    cx={x + size * 0.5}
                    cy={y}
                    r={size / 6}
                    fill="white"
                    onClick={onClick}
                />
            )}

            <defs>
                <filter
                    id={`robber-outline-${x}-${y}`}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feMorphology
                        in="SourceAlpha"
                        operator="dilate"
                        radius="3"
                        result="expanded"
                    />

                    <feFlood
                        floodColor="black"
                        result="color"
                    />

                    <feComposite
                        in="color"
                        in2="expanded"
                        operator="in"
                        result="outline"
                    />

                    <feDropShadow
                        dx="2"
                        dy="2"
                        stdDeviation="2"
                        floodColor="black"
                        floodOpacity="0.7"
                    />

                    <feMerge>
                        <feMergeNode in="outline" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {visible && (
                <image
                    href={robberIcon}
                    x={x + size * 0.25}
                    y={y - size * 0.25}
                    width={size * 0.5}
                    height={size * 0.5}
                    preserveAspectRatio="xMidYMid meet"
                    filter={`url(#robber-outline-${x}-${y})`}
                    style={{
                        pointerEvents: "none",
                        userSelect: "none"
                    }}
                />
            )}
        </g>
    );
}

export default Robber;