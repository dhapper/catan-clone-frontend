import "./IconButton.css";

function IconButton({ icon, alt, onClick }) {
    return (
        <div
            className="icon-button"
            onClick={onClick}
        >
            <img
                src={icon}
                alt={alt}
            />
        </div>
    );
}

export default IconButton;