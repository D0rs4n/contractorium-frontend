import { algod_client } from '../stores';
import { ABIType, type ABIValue, encodeAddress } from 'algosdk';
import { env } from '$env/dynamic/public';
import { BugBounty } from './collections';
import type { ABIResult } from 'beaker-ts';

const codec = ABIType.from("(string,string,bool,string)")

export function displayAlgoAddress(address: string): string {
	const firstPart = address.slice(0, 6);
	const lastPart = address.slice(-6);
	return `${firstPart}...${lastPart}`;
}

export function isHealthy(): boolean {
	const health = true;
	algod_client
		.healthCheck()
		.do()
		.then(() => {
			return true;
		})
		.catch(() => {
			return false;
		});
	return health;
}

export async function fetchPrograms(): Promise<BugBounty[]> {
	const res = await algod_client.getApplicationBoxes(parseInt(env.PUBLIC_APP_ID)).do();
	const boxNames = res.boxes.map((box) => box.name);
	const contents: BugBounty[] = [];
	for (const boxName of boxNames) {
		const content_encoded = await algod_client
			.getApplicationBoxByName(parseInt(env.PUBLIC_APP_ID), boxName)
			.do();
		
		const content_decoded: ABIValue = codec.decode(content_encoded.value);
		if(Array.isArray(content_decoded)) {
		contents.push(new BugBounty(encodeAddress(boxName), content_decoded[0], content_decoded[1], content_decoded[2], content_decoded[3]));
		}
	}
	return contents;
}
