import { algod_client } from '../stores';
import { ABIType, type ABIValue, encodeAddress } from 'algosdk';
import { env } from '$env/dynamic/public';
import { BugBounty } from './collections';
import { error } from '@sveltejs/kit';

const codec = ABIType.from('(string,string,bool,string)');

export function displayAlgoAddress(address: string): string {
	const firstPart = address.slice(0, 6);
	const lastPart = address.slice(-6);
	return `${firstPart}...${lastPart}`;
}

export async function isHealthy(): Promise<boolean> {
	const health = true;
	try {
		await algod_client.healthCheck().do();
	} catch (error_msg) {
		return false;
	}
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
		if (Array.isArray(content_decoded)) {
			contents.push(
				new BugBounty(
					encodeAddress(boxName),
					content_decoded[0],
					content_decoded[1],
					content_decoded[2],
					content_decoded[3]
				)
			);
		}
	}
	return contents;
}
export async function fetchReportsForProgram(creator_address: string) {
	const resp = await algod_client.accountInformation(env.PUBLIC_APP_ADDRESS).do();
	const assets = resp.assets;
	const reports = [];
	for (const asset of assets) {
		if (asset['is-frozen']) {
			continue;
		}
		const resp_asset = await algod_client.getAssetByID(asset['asset-id']).do();
		if (resp_asset.params.freeze == creator_address) {
			const asset_url = Buffer.from(resp_asset.params['url-b64'], 'base64').toString();
			// TODO: fetch data from url, perhaps IPFS, and load in the data.
		}
	}
}
