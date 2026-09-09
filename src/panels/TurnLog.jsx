import "./TurnLog.css";
import { useEffect, useRef } from "react";

function TurnLog({ turnLog }) {
    const logRef = useRef(null);

    useEffect(() => {
        if (!logRef.current) {
            return;
        }

        logRef.current.scrollTo({
            top: logRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [turnLog]);

    if (!turnLog) {
        return null;
    }

    return (
        <div className="panel turn-log">
            <div className="header">
                <p>Turn Log</p>
            </div>

            <div
                className="turn-log-content"
                ref={logRef}
            >
                {turnLog.map((entry, index) => (
                    <div
                        className={`turn-log-entry ${
                            index === turnLog.length - 1 ? "current" : ""
                        } ${
                            entry.messages.length === 0 ? "no-content" : ""
                        }`}
                        style={{ backgroundColor: entry.color }}
                        key={entry.turn}
                    >
                        <div className="entry-header">
                            <div className="turn">
                                Turn {entry.turn}
                            </div>

                            <div className="roll">
                                Roll: {entry.roll ?? "-"}
                            </div>
                        </div>

                        {entry.messages.map((message, index) => (
                            <p
                                className={
                                    index === entry.messages.length - 1
                                        ? "last-entry"
                                        : ""
                                }
                                key={index}
                            >
                                {message.message}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TurnLog;