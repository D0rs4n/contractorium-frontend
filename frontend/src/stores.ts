import { writable } from 'svelte/store';
import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { building } from '$app/environment';

import algosdk from 'algosdk';

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
	if (browser) {
		localStorage.setItem('wallet', JSON.stringify(value));
	}
});
if (!building) {
	if (!env.PUBLIC_ALGOD_PORT || !env.PUBLIC_ALGOD_SERVER || !env.PUBLIC_ALGOD_TOKEN) {
		throw error(500, {
			message:
				"Could not connect to the Algorand network, we're working on it. Please come back later."
		});
	}
}
export let algod_client: algosdk.Algodv2;

if (!building) {
	algod_client = new algosdk.Algodv2(
		env.PUBLIC_ALGOD_TOKEN,
		env.PUBLIC_ALGOD_SERVER,
		env.PUBLIC_ALGOD_PORT
	);
}
