<script lang="ts">
	import { onDestroy } from 'svelte';
	import { connect_wallet, disconnect } from '../lib/myalgo';

	import { wallet } from '../stores';
	import { displayAlgoAddress } from '../lib/utils';

	import 'carbon-components-svelte/css/all.css';
	import {
		Button,
		ProgressBar,
		Theme,
		ToastNotification,
        Header,
        HeaderNavItem,
        HeaderNav,


	} from 'carbon-components-svelte';
	import { error } from '@sveltejs/kit';

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
    const setTrigger = (val: boolean) => {
        trigger = val;
    } 

	onDestroy(unsubscribe);
</script>
<Header company="Contractorium" platformName="An asset based bug bounty platform">
<Theme bind:theme />
	{#if stored_wallet !== undefined}
            <HeaderNav>
            <HeaderNavItem text="Connected as {displayAlgoAddress(stored_wallet.address)}" />
			<Button kind="danger-tertiary" on:click={() => {
                disconnect();
                trigger = false;
            }}>Disconnect!</Button> 
            </HeaderNav>
	{:else}
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
