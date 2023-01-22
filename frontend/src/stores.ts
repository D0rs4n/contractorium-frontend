import { writable, readable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public'
import algosdk from "algosdk";

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


export const algod_client: Readable<algosdk.Algodv2 | undefined> = readable(new algosdk.Algodv2(env.PUBLIC_ALGOD_TOKEN, env.PUBLIC_ALGOD_SERVER, env.PUBLIC_ALGOD_PORT));
