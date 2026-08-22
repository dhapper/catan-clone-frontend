import "./Inventory.css";
import ResourceToken from "../ui/ResourceToken";
import PortBadge from "../ui/PortBadge";

function Inventory({ player }) {
    if (!player) {
        return null;
    }

    // console.log("PLAYER PORTS:", player.ports);

    return (
        <div className="panel">
            <p>Inventory</p>

            <div className="inventory-resources">
                <ResourceToken
                    resource="wood"
                    amount={player.resources.wood}
                    hideIfZero
                />

                <ResourceToken
                    resource="brick"
                    amount={player.resources.brick}
                    hideIfZero
                />

                <ResourceToken
                    resource="wheat"
                    amount={player.resources.wheat}
                    hideIfZero
                />

                <ResourceToken
                    resource="sheep"
                    amount={player.resources.sheep}
                    hideIfZero
                />

                <ResourceToken
                    resource="ore"
                    amount={player.resources.ore}
                    hideIfZero
                />
            </div>

            <div className="inventory-ports">
                {player.ports?.map((port) => (
                    <div className="inventory-port" key={port.edgeId}>
                        <svg
                            width="90"
                            height="90"
                            viewBox="-60 -60 120 120"
                        >
                            <g transform="scale(1)">
                                <PortBadge port={port} />
                            </g>
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Inventory;