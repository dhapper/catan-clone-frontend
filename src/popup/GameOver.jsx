import "./Popup.css";
import "../panels/Panel.css";

function GameOver({ winner, players }) {
    const winnerPlayer = players.find(
        player => player.id === winner
    );

    return (
        <div className="popup panel">
            <h2>Game Over</h2>
            <p>{winnerPlayer?.name} has won!</p>
        </div>
    );
}

export default GameOver;