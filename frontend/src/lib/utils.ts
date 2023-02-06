import { algod_client } from '../stores';
import { ABIType, type ABIValue, encodeAddress, decodeAddress } from 'algosdk';
import { env } from '$env/dynamic/public';
import { BugBounty, BugBountyReport } from './collections';
import { error } from '@sveltejs/kit';

const IPFSGateway = 'https://ipfs.algonode.xyz/ipfs/';

export function jsEscape(str: string) {
	return String(str).replace(/[^\w. ]/gi, function (c) {
		return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
	});
}

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
	} catch {
		return false;
	}
	return health;
}

export async function fetchOneProgram(program: string): Promise<BugBounty | undefined> {
	let content_encoded;
	if (!env.PUBLIC_APP_ID) {
		throw error(404, 'Program could not be found, due to internal issues, please come back later!');
	}
	try {
		content_encoded = await algod_client
			.getApplicationBoxByName(parseInt(env.PUBLIC_APP_ID), decodeAddress(program).publicKey)
			.do();
	} catch {
		throw error(404, 'Program could not be found!');
	}
	if (content_encoded) {
		const content_decoded: ABIValue = codec.decode(content_encoded.value);
		if (Array.isArray(content_decoded)) {
			let resp;
			try {
				resp = await fetch(IPFSGateway + jsEscape(content_decoded[1].toString()));
			} catch {
				throw error(
					404,
					'Program could not be found, due to internal issues, please come back later!'
				);
			}
			if (!resp.ok) {
				throw error(404, 'Program could not be found!');
			}
			const description = (await resp.json())['data']['description'];
			return new BugBounty(
				program,
				content_decoded[0],
				description,
				content_decoded[2],
				IPFSGateway + jsEscape(content_decoded[3] as string)
			);
		}
	}
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
					'',
					content_decoded[2],
					IPFSGateway + jsEscape(content_decoded[3] as string)
				)
			);
		}
	}
	return contents;
}
export async function fetchReportsForProgram(
	creator_address: string
): Promise<{ success: boolean; data: BugBountyReport[] | null } | undefined> {
	const resp = await algod_client.accountInformation(env.PUBLIC_APP_ADDRESS).do();
	const assets = resp.assets;
	if (assets.length == 0) {
		return { success: false, data: [] };
	}
	const reports = [];
	for (const asset of assets) {
		if (asset['is-frozen']) {
			continue;
		}
		const resp_asset = await algod_client.getAssetByID(asset['asset-id']).do();
		if (resp_asset.params.reserve == creator_address) {
			const asset_url = Buffer.from(resp_asset.params['url-b64'], 'base64')
				.toString()
				.split('.')[1];
			const escaped_url = IPFSGateway + jsEscape(asset_url);
			const resp = await fetch(escaped_url);
			let json;
			try {
				json = await resp.json();
			} catch {
				return { success: false, data: null };
			}
			reports.push(
				new BugBountyReport(
					resp_asset.index,
					resp_asset.params.freeze,
					resp_asset.params.reserve,
					json.data['name'],
					json.data['description']
				)
			);
		}
	}
	return { success: true, data: reports };
}

export async function fetchReportsForAddress(
	creator_address: string
): Promise<{ success: boolean; data: BugBountyReport[] | null } | undefined> {
	const resp = await algod_client.accountInformation(env.PUBLIC_APP_ADDRESS).do();
	const assets = resp.assets;
	if (assets.length == 0) {
		return { success: false, data: [] };
	}
	const reports = [];
	for (const asset of assets) {
		if (asset['is-frozen']) {
			continue;
		}
		const resp_asset = await algod_client.getAssetByID(asset['asset-id']).do();
		if (resp_asset.params.freeze == creator_address) {
			const asset_url = Buffer.from(resp_asset.params['url-b64'], 'base64')
				.toString()
				.split('.')[1];
			const escaped_url = IPFSGateway + jsEscape(asset_url);
			const resp = await fetch(escaped_url);
			let json;
			try {
				json = await resp.json();
			} catch {
				return { success: false, data: null };
			}
			reports.push(
				new BugBountyReport(
					resp_asset.index,
					resp_asset.params.freeze,
					resp_asset.params.reserve,
					json.data['name'],
					json.data['description']
				)
			);
		}
	}
	return { success: true, data: reports };
}
