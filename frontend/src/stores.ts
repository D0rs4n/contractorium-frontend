import { writable } from "svelte/store";
import { browser } from '$app/environment';
let stored_wallet;
if (browser) {
    const value = localStorage.getItem("wallet");
    if (value) {
        stored_wallet = JSON.parse(value);
    }
}
export const wallet = writable(stored_wallet);
wallet.subscribe((value) => {
    console.log(value)
    if (browser) {
        localStorage.setItem("wallet", JSON.stringify(value));
    }
});
