<script lang="ts">
	import { onDestroy } from 'svelte';
	import { connect_wallet, disconnect } from '../lib/myalgo';

	import { wallet } from '../stores';
	import { displayAlgoAddress } from '../lib/utils';

	import 'carbon-components-svelte/css/all.css';

	import TailwindCSS from '../TailwindCSS.svelte';
	import ConnectModal from '../lib/connectModal.svelte';
	import {
		ProgressBar,
		ToastNotification,
		Button
	} from 'carbon-components-svelte';
	import { error } from '@sveltejs/kit';

	let trigger: boolean | null;
	let stored_wallet: { name: string; address: string } | undefined;
	const unsubscribe = wallet.subscribe((value) => {
		if (value !== undefined) {
			stored_wallet = JSON.parse(value);
		} else {
			stored_wallet = value;
		}
	});
    const setTrigger = (val: boolean) => {
        trigger = val;
    } 


	onDestroy(unsubscribe);
</script>

<TailwindCSS />

<main class="w-full h-screen bg-darkGrey">
	<div class="w-full bg-navbarBg md:px-8 py-5 px-4 drop-shadow-lg rounded-b-lg md:flex md:justify-between">
		<div class="flex flex-col items-center md:flex-row">
			<div class="">
				<span class="font-bold uppercase text-darkBlue text-2xl">Contractorium</span>
				<div class="text-xs text-gray-400 ml-1">An asset based bug bounty platform</div>
			</div>
			<div class="flex items-center mt-4 md:mt-0">
				{#if stored_wallet !== undefined}
					<ConnectModal connectStatus={"connected"} wallettAddress={displayAlgoAddress(stored_wallet.address)} />
				{:else if !trigger}
					<button on:click={() => (trigger = true)}>
						<ConnectModal connectStatus={"not connected"}/>
					</button>
				{/if}
				{#if trigger}
					{#await connect_wallet() }
						<ConnectModal connectStatus={"connecting"} />
					{:then _}
						<!--<ToastNotification
							kind="success"
							title="Success"
							subtitle="Wallet Successfully connected!"
							caption={new Date().toLocaleString()}
						/>-->
					{:catch error}
						{setTrigger(false)}
					{/await}
				{/if}
			</div>

		</div>
		<div class="">
			{#if stored_wallet !== undefined}
				<button on:click={() => {disconnect(); setTrigger(false)}} class="text-white mt-2">disconnect</button>
			{/if}
		</div>
	</div>
	<slot />
</main>
