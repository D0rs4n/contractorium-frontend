import type { ABIValue } from 'algosdk';
import DOMPurify from 'isomorphic-dompurify';

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
		this.creator = DOMPurify.sanitize(creator as string);
		this.name = DOMPurify.sanitize(name as string);
		this.description = DOMPurify.sanitize(description as string);
		this.verified = verified
		this.image = DOMPurify.sanitize(image as string);
	}
}
