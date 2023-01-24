import { algod_client } from '../stores';
import { env } from '$env/dynamic/public';

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

export async function fetchPrograms(): Promise<string[][]> {
	const res = await algod_client.getApplicationBoxes(parseInt(env.PUBLIC_APP_ID)).do();
	const boxNames = res.boxes.map((box) => box.name);
	const contents = [];
	for (const boxName of boxNames) {
		const content = await algod_client
			.getApplicationBoxByName(parseInt(env.PUBLIC_APP_ID), boxName)
			.do();
		const content_parsed = new TextDecoder()
			.decode(content.value)
			.replace("\u0000\u0005\u0000'\u0000\u0000 ", '')
			.split('\u0000C');
		contents.push(content_parsed);
	}
	return contents;
}
