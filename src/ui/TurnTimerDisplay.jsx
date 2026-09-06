import "./TurnTimerDisplay.css";
import { useEffect, useState } from "react";
import socket from "../services/socket";

function TurnTimerDisplay({ turnEndsAt, timerPaused, timerRemainingMs }) {
    const [secondsLeft, setSecondsLeft] = useState(null);

    useEffect(() => {
        if (timerPaused) {
            return;
        }

        if (!turnEndsAt) {
            return;
        }

        const tick = () => {
            setSecondsLeft(Math.max(0, Math.round((turnEndsAt - Date.now()) / 1000)));
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [turnEndsAt, timerPaused, timerRemainingMs]);

    if (!timerPaused && !turnEndsAt) {
        return null;
    }

    if (secondsLeft === null && !timerPaused) {
        return null;
    }

    const displayedSeconds = timerPaused
        ? Math.max(0, Math.round(timerRemainingMs / 1000))
        : secondsLeft;
    const minutes = String(Math.floor(displayedSeconds / 60)).padStart(2, "0");
    const seconds = String(displayedSeconds % 60).padStart(2, "0");

    return (
        <div className="turn-timer">
            <p>{minutes}:{seconds}</p>
            <button onClick={() => socket.emit("game:toggleTimer")}>
                {timerPaused ? "Resume" : "Pause"}
            </button>
        </div>
    );
}

export default TurnTimerDisplay;