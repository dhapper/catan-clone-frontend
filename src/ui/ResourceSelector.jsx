import ResourceToken from "./ResourceToken";
import "./ResourceSelector.css";

function ResourceSelector({
    title,
    player,
    selectedResources,
    onChange,
    reversed = false,
    infiniteRes = false
}) {
    function changeAmount(resource, change) {
        const currentAmount =
            selectedResources?.[resource] ?? 0;

        const playerAmount =
            player?.resources?.[resource] ?? 0;

        let newAmount = currentAmount + change;

        if (newAmount < 0) {
            newAmount = 0;
        }

        if (!infiniteRes && newAmount > playerAmount) {
            newAmount = playerAmount;
        }

        onChange({
            ...selectedResources,
            [resource]: newAmount
        });
    }

    function renderResourceSection(resource) {
        const playerAmount =
            player?.resources?.[resource] ?? 0;

        const selectedAmount =
            selectedResources?.[resource] ?? 0;

        const playerToken = (
            <ResourceToken
                resource={resource}
                amount={
                    infiniteRes
                        ? playerAmount
                        : playerAmount - selectedAmount
                }
                hideAmount={infiniteRes}
            />
        );

        const selectedToken = (
            <ResourceToken
                resource={resource}
                amount={selectedAmount}
            />
        );

        const quantityButtons = (
            <div className="quantityButtons">
                <button
                    onClick={() => changeAmount(resource, 1)}
                    disabled={
                        !infiniteRes &&
                        selectedAmount >= playerAmount
                    }
                >
                    +
                </button>

                <button
                    onClick={() => changeAmount(resource, -1)}
                    disabled={selectedAmount <= 0}
                >
                    -
                </button>
            </div>
        );

        return (
            <div className="resourceSection" key={resource}>

                {reversed && selectedToken}

                {reversed && quantityButtons}

                {!reversed && playerToken}

                {!reversed && quantityButtons}

                {!reversed && selectedToken}

                {reversed && playerToken}

            </div>
        );
    }

    return (
        <div className="resourceSectionGroup">
            <p>{title}</p>

            {renderResourceSection("wood")}
            {renderResourceSection("brick")}
            {renderResourceSection("wheat")}
            {renderResourceSection("sheep")}
            {renderResourceSection("ore")}
        </div>
    );
}

export default ResourceSelector;