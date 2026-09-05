import "./Bank.css";
import ResourceToken from "../ui/ResourceToken";

function Bank({ bank }) {
    if (!bank) {
        return null;
    }

    return (
        <div className="panel">

            <div className="header">
                <p>Bank</p>
            </div>

            <div className="bank-resources">
                <ResourceToken
                    resource="wood"
                    amount={bank.wood}
                />

                <ResourceToken
                    resource="brick"
                    amount={bank.brick}
                />

                <ResourceToken
                    resource="wheat"
                    amount={bank.wheat}
                />

                <ResourceToken
                    resource="sheep"
                    amount={bank.sheep}
                />

                <ResourceToken
                    resource="ore"
                    amount={bank.ore}
                />
            </div>
        </div>
    );
}

export default Bank;