<script lang="ts">
	import { onDestroy } from 'svelte';
	import { connect_wallet, disconnect } from '../lib/myalgo';

	import { wallet } from '../stores';
	import { displayAlgoAddress } from '../lib/utils';

	import 'carbon-components-svelte/css/all.css';
	import {
		Button,
		Tile,
		ProgressBar,
		Grid,
		Row,
		Theme,
		ToastNotification
	} from 'carbon-components-svelte';

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

<Theme bind:theme />
<Grid>
	{#if stored_wallet !== undefined}
		<Row
			><Tile>{displayAlgoAddress(stored_wallet.address)}</Tile>
			<Button kind="danger-tertiary" on:click={disconnect}>Disconnect!</Button></Row
		>
	{:else}
		<Button kind="primary" on:click={() => (trigger = true)}>Connect Wallet!</Button>
	{/if}
</Grid>
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
