import socket from "../services/socket";
import { GAMEPLAY_SUBPHASES } from "../constants/GameConstants";
import './RollComponent.css';

const RollComponent = ({
    myPlayerId,
    isMyTurn,
    currentPlayer,
    diceRoll,
    subphase
}) => {

    const isProductionPhase = subphase === GAMEPLAY_SUBPHASES.PRODUCTION;

    const Dice = ({ value }) => {
        return (
            <div className="dice">
                {value}
            </div>
        );
    };

    return (


        <div className="roll-component">

            {/* Production phase */}
            {isProductionPhase && (
                <>
                    {isMyTurn ? (
                        <button
                            onClick={() => {
                                socket.emit("game:rollProductionDice");
                            }}
                        >
                            Roll Dice
                        </button>
                    ) : (
                        <p>
                            Waiting for {currentPlayer.name} to roll...
                        </p>
                    )}
                </>
            )}

            {diceRoll && (
                <div className="dice-roll-result">
                    <Dice value={diceRoll[0]} />
                    <Dice value={diceRoll[1]} />
                </div>
            )}

            {subphase === GAMEPLAY_SUBPHASES.DISCARDING && (
                <p>Waiting for players to discard...</p>
            )}

            {subphase === GAMEPLAY_SUBPHASES.ROBBER_PLACEMENT && (
                isMyTurn ? (
                    <p>Place the robber</p>
                ) : (
                    <p>Waiting for {currentPlayer.name} to place robber...</p>
                )
            )}
        </div>
    );
};

export default RollComponent;