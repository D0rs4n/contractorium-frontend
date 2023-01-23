import { algod_client } from '../stores';

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
