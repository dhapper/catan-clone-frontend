import { useState } from "react";
import "./Popup.css";
import "../panels/Panel.css";
import "../ui/ResourceSelector.css";
import ResourceSelector from "../ui/ResourceSelector";
import socket from "../services/socket";

const EMPTY_RESOURCES = {
    wood: 0,
    brick: 0,
    wheat: 0,
    sheep: 0,
    ore: 0
};

const INVENTION_AMOUNT = 2;

function Invention({ bank, setShowInvention }) {
    const [selectedResources, setSelectedResources] =
        useState({ ...EMPTY_RESOURCES });

    const selectedAmount =
        Object.values(selectedResources).reduce(
            (total, amount) => total + amount,
            0
        );

    const maxSelected =
        selectedAmount >= INVENTION_AMOUNT;

    const canConfirm =
        selectedAmount === INVENTION_AMOUNT;

    function handleConfirm() {
        if (!canConfirm) {
            return;
        }

        socket.emit("game:resolveInvention", {
            resources: selectedResources
        });

        setShowInvention(false);
    }

    return (
        <div className="popup panel">
            <p>Invention</p>

            <p>
                Choose {INVENTION_AMOUNT} resources to receive from the bank.
            </p>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >

                <ResourceSelector
                    title="Choose:"
                    resources={bank}
                    selectedResources={selectedResources}
                    onChange={setSelectedResources}
                    disableIncrease={maxSelected}
                />

            </div>

            <button
                onClick={handleConfirm}
                disabled={!canConfirm}
            >
                Confirm
            </button>
        </div>
    );
}

export default Invention;