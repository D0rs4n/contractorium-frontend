<script lang="ts">
	import { onDestroy } from 'svelte';
	import { connect_wallet, disconnect } from '../lib/myalgo';

	import { wallet } from '../stores';
	import { displayAlgoAddress } from '../lib/utils';

	import 'carbon-components-svelte/css/all.css';

	import TailwindCSS from '../TailwindCSS.svelte';
	import ConnectModal from '../lib/connectModal.svelte';
	import {
		Button,
		ProgressBar,
		ToastNotification,
        Header,
        HeaderNavItem,
        HeaderNav,


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

<!--<main class="w-full h-screen bg-darkGrey">
	{#if stored_wallet !== undefined}
		<ConnectModal isConnected={true} wallettAddress={displayAlgoAddress(stored_wallet.address)} />
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
</main>-->
<Header company="Contractorium" platformName="An asset based bug bounty platform">
	{#if stored_wallet !== undefined}
            <HeaderNav>
            <HeaderNavItem text="Connected as {displayAlgoAddress(stored_wallet.address)}" />
			<Button kind="danger-tertiary" on:click={() => {
                disconnect();
                trigger = false;
            }}>Disconnect!</Button> 
            </HeaderNav>
	{:else}
		<!--<ConnectModal isConnected={false} />-->
		<Button kind="primary" on:click={() => (trigger = true)}>Connect Wallet!</Button>
	{/if}
<HeaderNav>
{#if trigger}
	{#await connect_wallet()}
		<ProgressBar helperText="Connecting to your Wallet.." />
	{:then _}
    <div>
		<ToastNotification
			kind="success"
			title="Success"
			subtitle="Wallet Successfully connected!"
		/>
    </div>
	{:catch error}
        {setTrigger(false)}
	{/await}
{/if}
</HeaderNav>
</Header>
<slot />
