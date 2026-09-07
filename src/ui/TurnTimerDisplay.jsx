import "./TurnTimerDisplay.css";
import { useEffect, useState } from "react";
import socket from "../services/socket";
import playIcon from "../assets/icons/other/play.svg"
import pauseIcon from "../assets/icons/other/pause.svg"
import IconButton from "./IconButton";

function TurnTimerDisplay({ turnEndsAt, timerPaused, timerRemainingMs, isHost }) {
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
            <p className={`clock ${minutes === "00" ? "clock-warning" : ""}`}>
                {minutes}:{seconds}
            </p>
            {isHost && (
                <IconButton
                    icon={timerPaused ? playIcon : pauseIcon}
                    alt={timerPaused ? "Resume" : "Pause"}
                    onClick={() => socket.emit("game:toggleTimer")}
                />
            )}
        </div>
    );
}

export default TurnTimerDisplay;