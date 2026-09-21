import "./ViewSettings.css";

function ViewSettings({ recenterBoard, resetBoardZoom, theme, setTheme }) {

    function toggleTheme() {
        const newTheme = theme === "new"
            ? "classic"
            : "new";

        document.documentElement.dataset.theme = newTheme;
        setTheme(newTheme);
    }

    return (
        <div className="panel">

            <div className="header">
                <p>View</p>
            </div>

            <button onClick={recenterBoard}>
                Recenter Board
            </button>

            <button onClick={resetBoardZoom}>
                Reset Zoom
            </button>

            <div className="theme-toggle">
                <span>Experimental Theme</span>

                <button
                    className={`toggle ${theme === "new" ? "active" : ""}`}
                    onClick={toggleTheme}
                    aria-label="Toggle experiment theme"
                >
                    <span className="toggle-knob" />
                </button>
            </div>
        </div>
    );
}

export default ViewSettings;