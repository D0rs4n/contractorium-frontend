<script lang="ts">
	import MyAlgoConnect, { type SignedTx } from '@randlabs/myalgo-connect';
	import algosdk from 'algosdk';
	import { onMount } from 'svelte';
	import { algod_client } from '../stores';
	import type { BugBountyReport } from './collections';
	import { displayAlgoAddress } from './utils';
	import { env } from '$env/dynamic/public';
	import { PUBLIC_APP_ADDRESS } from '$env/static/public';
	import { notifications } from './store_bounty';

	export let report: BugBountyReport;
	export let wallet_address: string | undefined
	export let program_creator: string | undefined

	let isOpen: boolean = false;
	let divStyle: string;

	$: divStyle = isOpen
		? 'border-x border-t border-darkBlue rounded-t-lg'
		: 'border rounded-lg border-navbarBg';


	let myAlgoClient: MyAlgoConnect;
	
	onMount(async () => {
		myAlgoClient = new MyAlgoConnect();
	});

	async function freeze_report(from: string, freezeTarget: string, assetID: number) {
		const params = await algod_client.getTransactionParams().do();
		let enc = new TextEncoder()
		const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject( { from, note: enc.encode("Report closed"), assetIndex: assetID, freezeTarget,freezeState: true, suggestedParams: params } )
		let rawSigned = await myAlgoClient.signTransaction(txn.toByte());
		let ftx = (await algod_client.sendRawTransaction(rawSigned.blob).do());
		console.log(ftx)
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="bg-navbarBg mt-4 p-4 mx-4 max-w-3xl md:mx-auto drop-shadow-lg text-white flex justify-between align-middle content-center hover:border-darkBlue cursor-pointer {divStyle}"
	on:click={() => (isOpen = !isOpen)}
>
	<p class="text-lg">{report.name}</p>
	<p class="text-md font-medium">
		Created by: <span class="font-bold text-darkBlue">{displayAlgoAddress(report.creator.toString())}</span>
	</p>
</div>
{#if isOpen}
	<div
		class="z-10 max-w-3xl mx-4 md:mx-auto p-4 rounded-b-lg border-b border-l border-r border-darkBlue bg-lightNavBar"
	>
		<div class="whitespace-pre">
		<p class="text-gray-200 text-md">{report.description}</p>
		</div>
		{#if wallet_address !== undefined}
		<div class="mt-4">
			{#if wallet_address == program_creator}
			<button
				class="outline-none border text-md py-1 px-4 rounded-md border-green-500 bg-green-500 text-white transition-transform hover:scale-105"
			>
				Pay
			</button>
			{/if}
			{#if wallet_address !== undefined && wallet_address == report.creator}
			<button class="outline-none border text-md py-1 px-4 rounded-md border-red-500 bg-red-500 text-white transition-transform hover:scale-105" on:click={async () => {
				if (wallet_address !== undefined) {
					await freeze_report(wallet_address, env.PUBLIC_APP_ADDRESS, parseInt(report.asset_id.toString()))
				}
				else {
					notifications.add("error", "Error, something went wrong.","");
				}
			}}>
				Close
			</button>
			{/if}
		</div>
		{/if}
	</div>
{/if}
