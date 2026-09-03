import "./Popup.css";
import "../panels/Panel.css";
import "./GameOver.css";

function GameOver({ winner, players }) {
    const winnerPlayer = players.find(
        player => player.id === winner
    );

    const rankedPlayers = [...players]
        .map(player => ({
            ...player,
            totalVictoryPoints:
                player.victoryPoints +
                (player.secretVictoryPoints ?? 0)
        }))
        .sort((a, b) => b.totalVictoryPoints - a.totalVictoryPoints)
        .map((player, index, players) => ({
            ...player,
            rank:
                players.findIndex(
                    p =>
                        p.totalVictoryPoints ===
                        player.totalVictoryPoints
                ) + 1
        }));

    return (
        <div className="popup panel game-over">
            <h2>Game Over</h2>

            <p>{winnerPlayer?.name} has won!</p>

            <div className="game-over-leaderboard">
                <div className="leaderboard-row leaderboard-header">
                    <span>Rank</span>
                    <span>Name</span>
                    <span>Points</span>
                </div>

                {rankedPlayers.map(player => (
                    <div
                        className="leaderboard-row"
                        key={player.id}
                    >
                        <span>{player.rank}</span>
                        <span>{player.name}</span>
                        <span>{player.totalVictoryPoints}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameOver;