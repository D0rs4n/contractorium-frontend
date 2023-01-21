import { writable } from 'svelte/store';
import { browser } from '$app/environment';
let stored_wallet;
if (browser) {
	const value = localStorage.getItem('wallet');
	if (value) {
		try {
			stored_wallet = JSON.parse(value);
		} catch (error) {
			stored_wallet = undefined;
		}
	}
}
export const wallet = writable(stored_wallet);
wallet.subscribe((value) => {
	console.log(value);
	if (browser) {
		localStorage.setItem('wallet', JSON.stringify(value));
	}
});
