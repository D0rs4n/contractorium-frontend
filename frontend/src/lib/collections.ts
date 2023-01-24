import type { ABIValue } from "algosdk";

export class BugBounty {
    name: ABIValue;
    description: ABIValue;
    verified: ABIValue;
    image: ABIValue;

    constructor(name: ABIValue, description: ABIValue, verified: ABIValue, image: ABIValue) {
        this.name = name;
        this.description = description
        this.verified = verified
        this.image = image
    }
}