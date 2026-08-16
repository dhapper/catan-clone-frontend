import desertBg from "../assets/tileBg/desert.jpg";
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

import Robber from "./Robber";

import { GAMEPLAY_SUBPHASES } from "../constants/GameConstants";

import "./HexTile.css"
// import "./Vertex.css"

const TILE_BACKGROUNDS = {
    desert: desertBg,
    hill: hillBg,
    mountain: mountainBg,
    pasture: pastureBg,
    field: fieldBg,
    forest: forestBg
};

const RESOURCE_ICONS = {
    brick: brickIcon,
    sheep: sheepIcon,
    ore: stoneIcon,
    wheat: wheatIcon,
    wood: woodIcon
};

function HexTile({ tile, size, diceRoll, subphase, canPlaceRobber }) {
    const iconYOffset = -0.6;
    const iconScale = 0.6;

    const tokenYOffset = 0.1;
    const tokenScale = 0.4;
    const tokenFontScale = 0.7;

    const vertices = [];

    for (let i = 0; i < 6; i++) {
        const angle = -90 + i * 60;
        const radians = angle * Math.PI / 180;

        const x =
            tile.x +
            size * Math.cos(radians);

        const y =
            tile.y +
            size * Math.sin(radians);

        vertices.push({ x, y });
    }

    const points = vertices
        .map((vertex) => `${vertex.x},${vertex.y}`)
        .join(" ");

    const backgroundImage = TILE_BACKGROUNDS[tile.type];
    const resourceIcon = RESOURCE_ICONS[tile.resource];

    const diceTotal =
        diceRoll
            ? diceRoll[0] + diceRoll[1]
            : null;

    const bgColor =
        subphase === GAMEPLAY_SUBPHASES.ACTION &&
            diceTotal === tile.numberToken
            ? "rgb(116, 226, 116)"
            : "#e8d5ad";

    return (
        <g>
            <defs>
                <clipPath id={`tile-clip-${tile.id}`}>
                    <polygon points={points} />
                </clipPath>
            </defs>

            <polygon
                points={points}
                fill="lightgray"
                stroke="black"
                stroke-width="10"
            />

            <image
                href={backgroundImage}
                x={tile.x - size}
                y={tile.y - size}
                width={size * 2}
                height={size * 2}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#tile-clip-${tile.id})`}
            />

            {resourceIcon && (
                <image
                    href={resourceIcon}
                    x={tile.x - size * iconScale / 2}
                    y={tile.y + size * iconYOffset}
                    width={size * iconScale}
                    height={size * iconScale}
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                        filter:
                            "brightness(0) invert(1) drop-shadow(0 0 4px rgb(0,0,0))"
                    }}
                />
            )}

            {tile.numberToken !== null && (
                <>
                    <rect
                        x={tile.x - size * tokenScale / 2}
                        y={tile.y + size * tokenYOffset}
                        width={size * tokenScale}
                        height={size * tokenScale}
                        rx={size * tokenScale * 0.12}
                        fill={bgColor}
                        stroke="black"
                        strokeWidth="4"
                    />

                    <text
                        x={tile.x}
                        y={
                            tile.y +
                            size * tokenYOffset +
                            size * tokenScale / 2
                            + (size * tokenScale * 0.05)
                        }
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={
                            tile.numberToken === 6 ||
                                tile.numberToken === 8
                                ? "#d30000"
                                : "black"
                        }
                        fontSize={size * tokenScale * tokenFontScale}
                        fontWeight="bold"
                        style={{
                            pointerEvents: "none",
                            userSelect: "none"
                        }}
                    >
                        {tile.numberToken}
                    </text>
                </>
            )}

            <Robber
                x={tile.x}
                y={tile.y}
                size={size}
                // canPlace={canPlaceRobber}
                canPlace={canPlaceRobber}
            />

        </g>
    );
}

export default HexTile;