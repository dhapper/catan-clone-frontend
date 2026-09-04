import { useState } from "react";
import "./TradeCreation.css";
import "./Popup.css";
import "../panels/Panel.css";
import ResourceSelector from "../ui/ResourceSelector";
import socket from "../services/socket";

const EMPTY_RESOURCES = {
    wood: 0,
    brick: 0,
    wheat: 0,
    sheep: 0,
    ore: 0
};

function TradeCreation({ player, onCancel }) {
    const [offeredResources, setOfferedResources] =
        useState({ ...EMPTY_RESOURCES });

    const [wantedResources, setWantedResources] =
        useState({ ...EMPTY_RESOURCES });

    function clearResources() {
        setOfferedResources({ ...EMPTY_RESOURCES });
        setWantedResources({ ...EMPTY_RESOURCES });
    }

    function handleBankTrade() {
        socket.emit("game:bankTrade", {
            offered: offeredResources,
            wanted: wantedResources
        });

        clearResources();
    }

    function handlePlayerTrade() {
        socket.emit("game:createTrade", {
            offered: offeredResources,
            wanted: wantedResources
        });

        clearResources();
    }

    return (
        <div className="popup panel">
            <p>Trade Creation</p>

            <div className="tradeUI">

                {/* offered resources */}
                <ResourceSelector
                    title="Offer:"
                    player={player}
                    selectedResources={offeredResources}
                    onChange={setOfferedResources}
                />

                {/* wanted resources */}
                <ResourceSelector
                    title="Want:"
                    player={player}
                    selectedResources={wantedResources}
                    onChange={setWantedResources}
                    reversed={true}
                    infiniteRes={true}
                />

            </div>

            <div className="tradeButtons">
                <button onClick={handlePlayerTrade}>
                    Offer Player Trade
                </button>
                <button onClick={handleBankTrade}>
                    Bank Trade
                </button>
                <button onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default TradeCreation;