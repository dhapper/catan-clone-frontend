import { useState } from "react";
import "./TradeCreation.css";
import "./Popup.css";
import "../panels/Panel.css";
import ResourceSelector from "../ui/ResourceSelector";

const EMPTY_RESOURCES = {
    wood: 0,
    brick: 0,
    wheat: 0,
    sheep: 0,
    ore: 0
};

function Discard({ player, discardAmount }) {
    const [discardedResources, setDiscardedResources] =
        useState({ ...EMPTY_RESOURCES });

    return (
        <div className="popup panel">
            <p>Discard Resources</p>

            <p>
                You must discard {discardAmount} resource
                {discardAmount === 1 ? "" : "s"}.
            </p>

            <ResourceSelector
                title="Discard:"
                player={player}
                selectedResources={discardedResources}
                onChange={setDiscardedResources}
            />

            <div className="tradeButtons">
                <button>Discard</button>
            </div>
        </div>
    );
}

export default Discard;