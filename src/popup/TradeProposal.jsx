import "./TradeCreation.css";
import "./Popup.css";
import "./Trade.css";
import "../panels/Panel.css";
import ResourceToken from "../ui/ResourceToken";
import socket from "../services/socket";

function TradeProposal({
    player,
    currentTradeOffer,
    currentPlayerId
}) {
    const resources = [
        "wood",
        "brick",
        "wheat",
        "sheep",
        "ore"
    ];

    const hasAccepted =
        currentTradeOffer?.acceptedBy?.includes(player?.id);

    const hasDeclined =
        currentTradeOffer?.declinedBy?.includes(player?.id);

    const canAffordTrade = Object.entries(
        currentTradeOffer?.wanted ?? {}
    ).every(([resource, amount]) => {
        return (player?.resources?.[resource] ?? 0) >= amount;
    });

    function handleAccept() {
        socket.emit("game:acceptTrade");
    }

    function handleDecline() {
        socket.emit("game:declineTrade");
    }

    function renderResources(resourceAmounts) {
        return (
            <div className="postOfferResourceList">
                {resources.map((resource) => {
                    const amount = resourceAmounts?.[resource] ?? 0;

                    if (amount === 0) {
                        return null;
                    }

                    return (
                        <ResourceToken
                            key={resource}
                            resource={resource}
                            amount={amount}
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <div className="popup panel">
            <p>Trade Proposal from {currentPlayerId}</p>

            <p>Wants:</p>

            <div className="trade-resources">
                {renderResources(currentTradeOffer?.wanted)}
            </div>

            <p>Offers:</p>

            <div className="trade-resources">
                {renderResources(currentTradeOffer?.offered)}
            </div>

            {hasAccepted ? (
                <p>Waiting for trade approval</p>
            ) : hasDeclined ? (
                <p>Waiting for trade resolution</p>
            ) : canAffordTrade ? (
                <>
                    <button onClick={handleAccept}>
                        Accept
                    </button>

                    <button onClick={handleDecline}>
                        Decline
                    </button>
                </>
            ) : (
                <>
                    <button disabled>
                        Accept
                    </button>

                    <button onClick={handleDecline}>
                        Decline
                    </button>

                    <p>Unable to meet trade requirements</p>
                </>
            )}
        </div>
    );
}

export default TradeProposal;