import { SEAFARERS_MAPS } from "../constants/GameConstants";
import "./SeafarerSettings.css";
import socket from "../services/socket";

function SeafarerSettings({ config }) {

    function selectMap(mapId) {
        socket.emit("game:setSeafarersMap", {
            map: mapId
        });
    }

    return (
        <div className="panel seafarer-settings">

            <div className="header">
                <p>Seafarer Settings</p>
            </div>

            <div className="seafarer-map-options">

                {Object.entries(SEAFARERS_MAPS).map(([mapId, map]) => (
                    <label
                        key={mapId}
                        className="seafarer-map-option"
                    >
                        <input
                            type="radio"
                            name="seafarers-map"
                            value={mapId}
                            checked={config?.seafarers?.map === mapId}
                            onChange={() => selectMap(mapId)}
                        />

                        <span>{map.name}</span>
                    </label>
                ))}

            </div>

        </div>
    );
}

export default SeafarerSettings;