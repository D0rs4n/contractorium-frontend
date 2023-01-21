import MyAlgoConnect from '@randlabs/myalgo-connect';
import { wallet } from '../stores';

export async function connect_wallet() {
	const myAlgo = new MyAlgoConnect();
	const accounts = await myAlgo.connect({
		shouldSelectOneAccount: false,
		openManager: true
	});
	wallet.set(JSON.stringify({ address: accounts[0].address, name: accounts[0].name }));
}

export function disconnect() {
	wallet.set(undefined);
}
