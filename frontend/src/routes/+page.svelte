<script lang="ts">
    import type { Accounts } from '@randlabs/myalgo-connect'
	import { onDestroy } from 'svelte';
    import { wallet } from "../stores"
    import {connect_wallet, disconnect} from '../lib/myalgo';

    let trigger: Boolean | null;
    let stored_wallet: {name: string, address: string} | undefined;
    const unsubscribe = wallet.subscribe((value) => {
        if(value !== undefined) {
            stored_wallet = JSON.parse(value);
        }
        else {
            stored_wallet = value;
        }
    });
    onDestroy(unsubscribe);
</script>
{#if stored_wallet !== undefined}
    <h1>There is a wallet. {stored_wallet.name}</h1>
    <button on:click={disconnect}>Disconnect</button>
{:else}
    <button on:click={() => trigger = true}>Connect Wallet!</button>
{/if}

{#if trigger}
    {#await connect_wallet()}
    <p>Connecting Wallet...</p>
    {:then _}
        <p>Wallet successfully connected!</p>
    {:catch error}
    <p style="color: red">{error.message}</p>
    {/await}
{/if}