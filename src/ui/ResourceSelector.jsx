import ResourceToken from "./ResourceToken";
import "./ResourceSelector.css";

function ResourceSelector({
    title,
    player,
    selectedResources,
    onChange,
    reversed = false,
    infiniteRes = false,
    resources = null,
    disableIncrease = false
}) {
    const availableResources =
        resources ?? player?.resources ?? {};

    function changeAmount(resource, change) {
        const currentAmount =
            selectedResources?.[resource] ?? 0;

        const availableAmount =
            availableResources?.[resource] ?? 0;

        let newAmount = currentAmount + change;

        if (newAmount < 0) {
            newAmount = 0;
        }

        if (!infiniteRes && newAmount > availableAmount) {
            newAmount = availableAmount;
        }

        onChange({
            ...selectedResources,
            [resource]: newAmount
        });
    }

    function renderResourceSection(resource) {
        const availableAmount =
            availableResources?.[resource] ?? 0;

        const selectedAmount =
            selectedResources?.[resource] ?? 0;

        const resourceToken = (
            <ResourceToken
                resource={resource}
                amount={
                    infiniteRes
                        ? availableAmount
                        : availableAmount - selectedAmount
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
                        disableIncrease ||
                        (
                            !infiniteRes &&
                            selectedAmount >= availableAmount
                        )
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

                {!reversed && resourceToken}
                {!reversed && quantityButtons}
                {!reversed && selectedToken}

                {reversed && resourceToken}

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