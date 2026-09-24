import { useState } from "react";
import "./RoomBadge.css";

function RoomBadge({ code, onLeave }) {
    const [copied, setCopied] = useState(false);

    function copyCode() {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }

    return (
        <div className="room-badge">
            <span className="room-badge-label">Room</span>
            <span className="room-badge-code">{code}</span>

            <button onClick={copyCode}>
                {copied ? "Copied!" : "Copy"}
            </button>

            <button onClick={onLeave}>
                Leave
            </button>
        </div>
    );
}

export default RoomBadge;
