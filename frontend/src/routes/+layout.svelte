<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { connect_wallet, disconnect } from '../lib/myalgo';
	import { wallet } from '../stores';
	import { jsEscape, isHealthy } from '../lib/utils';
	import { Buffer } from 'buffer';
	import ConnectModal from '../lib/connectModal.svelte';
	import BountyModal from '../lib/bountyModal.svelte';
	import '../app.css';
	import Notification from '$lib/notification.svelte';

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

<Notification />
<BountyModal />
{#if health}
	<main class="w-full min-h-screen bg-darkGrey font-lato">
		<div
			class="w-full bg-navbarBg md:px-8 py-5 px-4 drop-shadow-lg rounded-b-lg md:flex md:justify-between"
		>
			<div class="flex flex-col items-center md:flex-row">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="cursor-pointer" on:click={() => (window.location.href = '/')}>
					<span class="font-bold uppercase text-darkBlue text-2xl">Contractorium</span>
					<div class="text-xs text-gray-400 ml-1">
						An asset based bug bounty platform <br /> powered by
						<a href="https://algonode.io/" class="underline hover:text-gray-400">Algonode.io</a>
					</div>
				</div>
				<div class="flex items-center mt-4 md:mt-0">
					{#if stored_wallet !== undefined}
						<ConnectModal
							connectStatus={'connected'}
							walletAddress={jsEscape(stored_wallet.address)}
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
						{:catch}
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
						class="text-white border-2 text-md border-red-400 transition-transform hover:scale-105 rounded-lg py-2 mx-auto md:mx-0 mt-4 md:mt-0 md:py-0 px-5"
						>disconnect <i class="material-icons ml-1 float-right">exit_to_app</i></button
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
