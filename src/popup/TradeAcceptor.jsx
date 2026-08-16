import "./TradeCreation.css";
import "./Popup.css";
import "./Trade.css";
import "../panels/Panel.css";
import ResourceToken from "../ui/ResourceToken";
import socket from "../socket";

function TradeAcceptor({
    player,
    currentTradeOffer,
    currentPlayerId,
    players = []
}) {
    const resources = [
        "wood",
        "brick",
        "wheat",
        "sheep",
        "ore"
    ];

    const acceptedPlayerIds =
        currentTradeOffer?.acceptedBy ?? [];

    const declinedPlayerIds =
        currentTradeOffer?.declinedBy ?? [];

    const otherPlayers = players.filter(
        player => player.id !== currentPlayerId
    );

    function handleCancelTrade() {
        socket.emit("game:cancelTrade");
    }

    function handleSelectPlayer(playerId) {
        console.log("RESOLVE TRADE CLICKED:", playerId);

        socket.emit("game:resolveTrade", {
            playerId
        });
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

            <p>Choose a player to trade with:</p>

            <div className="trade-players">
                {otherPlayers.map((otherPlayer) => {
                    const hasAccepted =
                        acceptedPlayerIds.includes(otherPlayer.id);

                    return (
                        <button
                            key={otherPlayer.id}
                            disabled={!hasAccepted}
                            onClick={() => handleSelectPlayer(otherPlayer.id)}
                        >
                            {otherPlayer.name}
                            {hasAccepted && " (Accepted)"}
                            {declinedPlayerIds.includes(otherPlayer.id) && " (Declined)"}
                        </button>
                    );
                })}
            </div>

            <button onClick={handleCancelTrade}>
                Cancel Trade
            </button>
        </div>
    );
}

export default TradeAcceptor;