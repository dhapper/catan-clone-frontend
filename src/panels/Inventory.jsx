import "./Inventory.css";
import ResourceToken from "../ui/ResourceToken";

function Inventory({ player }) {
    if (!player) {
        return null;
    }

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
        </div>
    );
}

export default Inventory;