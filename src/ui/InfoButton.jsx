import "./InfoButton.css";
import infoIcon from "../assets/icons/other/info.svg";

function InfoButton({ setShowInfoPanel  }) {

    const handleClick = () => {
        setShowInfoPanel(prev => !prev);
    };

    return (
        <div
            className="info-button"
            onClick={handleClick}
        >
            <img
                src={infoIcon}
                alt="Info"
            />
        </div>
    );
}

export default InfoButton;