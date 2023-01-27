<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { connect_wallet, disconnect } from '../lib/myalgo';
	import { wallet } from '../stores';
	import { displayAlgoAddress, isHealthy } from '../lib/utils';
	import { Buffer } from 'buffer';
	import TailwindCSS from '../TailwindCSS.svelte';
	import ConnectModal from '../lib/connectModal.svelte';
	import { error } from '@sveltejs/kit';
	import BountyCard from '$lib/bountyCard.svelte';

	let health = true;
	let trigger: boolean | null;
	export let stored_wallet: { name: string; address: string } | undefined;
	const unsubscribe = wallet.subscribe((value) => {
		if (value !== undefined) {
			stored_wallet = JSON.parse(value);
		} else {
			stored_wallet = value;
		}
	});
	const setTrigger = (val: boolean) => {
		trigger = val;
	};
	onMount(async () => {
		health = await isHealthy();
		window.Buffer = Buffer;
	});
	onDestroy(unsubscribe);
</script>

<TailwindCSS />
{#if health}
	<main class="w-full min-h-screen bg-darkGrey font-lato">
		<div
			class="w-full bg-navbarBg md:px-8 py-5 px-4 drop-shadow-lg rounded-b-lg md:flex md:justify-between"
		>
			<div class="flex flex-col items-center md:flex-row">
				<div class="">
					<span class="font-bold uppercase text-darkBlue text-2xl">Contractorium</span>
					<div class="text-xs text-gray-400 ml-1">An asset based bug bounty platform</div>
				</div>
				<div class="flex items-center mt-4 md:mt-0">
					{#if stored_wallet !== undefined}
						<ConnectModal
							connectStatus={'connected'}
							walletAddress={displayAlgoAddress(stored_wallet.address)}
						/>
					{:else if !trigger}
						<button on:click={() => (trigger = true)}>
							<ConnectModal connectStatus={'not connected'} />
						</button>
					{/if}
					{#if trigger}
						{#await connect_wallet()}
							<ConnectModal connectStatus={'connecting'} />
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
			<div class="flex">
				{#if stored_wallet !== undefined}
					<button
						on:click={() => {
							disconnect();
							setTrigger(false);
						}}
						class="text-white border-2 text-md border-red-400 transition-transform hover:scale-105 rounded-lg py-2 mx-auto md:mx-0 mt-4 md:mt-0 md:py-0 px-5 align-middle "
						>disconnect</button
					>
				{/if}
			</div>
		</div>
		<slot />
	</main>
{:else}
	<center
		><h2>
			Something went wrong when connecting to the Algorand network, please come back later!
		</h2></center
	>
{/if}
