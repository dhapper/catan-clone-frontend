import "./Popup.css";
import "../panels/Panel.css";
import "./Monopoly.css";
import socket from "../services/socket";
import ResourceToken from "../ui/ResourceToken";

function Monopoly({ onResourceSelect }) {

    function handleResourceClick(resource) {
        socket.emit("game:playMonopoly", {
            resource
        });

        if (onResourceSelect) {
            onResourceSelect(resource);
        }
    }

    return (
        <div className="popup panel">
            <p>Monopoly</p>
            <p>Choose which resource to monopolize:</p>

            <div className="resource-tokens">

                <ResourceToken
                    resource="wood"
                    hideAmount
                    onClick={() => handleResourceClick("wood")}
                    hoverable
                />

                <ResourceToken
                    resource="brick"
                    hideAmount
                    onClick={() => handleResourceClick("brick")}
                    hoverable
                />

                <ResourceToken
                    resource="wheat"
                    hideAmount
                    onClick={() => handleResourceClick("wheat")}
                    hoverable
                />

                <ResourceToken
                    resource="sheep"
                    hideAmount
                    onClick={() => handleResourceClick("sheep")}
                    hoverable
                />

                <ResourceToken
                    resource="ore"
                    hideAmount
                    onClick={() => handleResourceClick("ore")}
                    hoverable
                />

            </div>
        </div>
    );
}

export default Monopoly;