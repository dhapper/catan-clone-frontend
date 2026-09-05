import "./TurnTimerDisplay.css";
import { useEffect, useState } from "react";

function TurnTimerDisplay({ turnEndsAt }) {
    const [secondsLeft, setSecondsLeft] = useState(null);

    useEffect(() => {
        if (!turnEndsAt) {
            setSecondsLeft(null);
            return;
        }

        const tick = () => {
            setSecondsLeft(Math.max(0, Math.round((turnEndsAt - Date.now()) / 1000)));
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [turnEndsAt]);

    if (secondsLeft === null) {
        return null;
    }

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");

    return (
        <div className="turn-timer">
            <p>{minutes}:{seconds}</p>
        </div>
    );
}

export default TurnTimerDisplay;