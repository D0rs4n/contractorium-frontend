import type { ABIValue } from 'algosdk';

export class BugBounty {
	creator: ABIValue;
	name: ABIValue;
	description: ABIValue;
	verified: ABIValue;
	image: ABIValue;

	constructor(
		creator: ABIValue,
		name: ABIValue,
		description: ABIValue,
		verified: ABIValue,
		image: ABIValue
	) {
		this.creator = creator;
		this.name = name;
		this.description = description;
		this.verified = verified;
		this.image = image;
	}
}
