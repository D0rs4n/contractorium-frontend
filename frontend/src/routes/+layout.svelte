<script lang="ts">
	import { onDestroy } from 'svelte';
	import { connect_wallet } from '../lib/myalgo';

	import { wallet } from '../stores';
	import { displayAlgoAddress } from '../lib/utils';

	import 'carbon-components-svelte/css/all.css';
	import { Button, ProgressBar, ToastNotification } from 'carbon-components-svelte';

	import TailwindCSS from '../TailwindCSS.svelte';
	import ConnectModal from '../lib/connectModal.svelte';

	let trigger: boolean | null;
	let stored_wallet: { name: string; address: string } | undefined;
	let theme = 'g80';
	const unsubscribe = wallet.subscribe((value) => {
		if (value !== undefined) {
			stored_wallet = JSON.parse(value);
		} else {
			stored_wallet = value;
		}
	});

	onDestroy(unsubscribe);
</script>

<TailwindCSS />

<main class="w-full h-screen bg-darkGrey">
	{#if stored_wallet !== undefined}
		<ConnectModal isConnected={true} wallettAddress={displayAlgoAddress(stored_wallet.address)} />
	{:else}
		<ConnectModal isConnected={false} />
		<Button kind="primary" on:click={() => (trigger = true)}>Connect Wallet!</Button>
	{/if}

	{#if trigger}
		{#await connect_wallet()}
			<ProgressBar helperText="Connecting to Wallet!" />
		{:then _}
			<ToastNotification
				kind="success"
				title="Success"
				subtitle="Wallet Successfully connected!"
				caption={new Date().toLocaleString()}
			/>
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{/if}
	<slot />
</main>
