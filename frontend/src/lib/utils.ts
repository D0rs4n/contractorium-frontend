export function displayAlgoAddress(address: string): string {
	const firstPart = address.slice(0, 6);
	const lastPart = address.slice(-6);
	return `${firstPart}...${lastPart}`;
}
