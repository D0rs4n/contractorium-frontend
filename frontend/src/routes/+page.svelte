<script lang="ts">
	import MyAlgoConnect from '@randlabs/myalgo-connect';
	import BountyCard from '../lib/bountyCard.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { algod_client, wallet } from '../stores';
	import type { BugBounty } from '../lib/collections';
	import algosdk from 'algosdk';
	import { ContractoriumPlatform } from '../beaker/contractoriumplatform_client';
	import { env } from '$env/dynamic/public';
	import { error } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import { isShowing, trigger_new_bounty } from '../lib/store_bounty';

	export let form: ActionData;
	export let data: PageData;

	let stored_wallet: { name: string; address: string } | undefined;
	let current_bounty: BugBounty;
	function set_trigger_new_bounty(new_state: boolean, program: BugBounty): string {
		trigger_new_bounty.set(new_state);
		current_bounty = program;
		return '';
	}
	const unsubscribe = wallet.subscribe((value) => {
		if (value !== undefined) {
			stored_wallet = JSON.parse(value);
		} else {
			stored_wallet = value;
		}
	});
	onDestroy(unsubscribe);

	let myAlgoClient: MyAlgoConnect;
	
	onMount(async () => {
		myAlgoClient = new MyAlgoConnect();
	});

	async function signer(unsignedTxns: Array<algosdk.Transaction>) {
		let res = await myAlgoClient.signTransaction(unsignedTxns.map((txn) => txn.toByte()));
		return res.map((s) => s.blob);
	}

	let contractoriumplatform_client: undefined | ContractoriumPlatform;
	if (stored_wallet?.address) {
		contractoriumplatform_client = new ContractoriumPlatform({
			client: algod_client,
			signer,
			sender: stored_wallet?.address,
			appId: parseInt(env.PUBLIC_APP_ID)
		});
	}
	async function addBounty(name: string, description: string, image: string) {
		if (!contractoriumplatform_client || !stored_wallet?.address) {
			throw error(503, 'Temporarily unavailable.');
		}
		let res;
		try {
			res = await contractoriumplatform_client.create_bounty_program(
				{
					name,
					description,
					image
				},
				{
					boxes: [
						{
							appIndex: parseInt(env.PUBLIC_APP_ID),
							name: algosdk.decodeAddress(stored_wallet?.address).publicKey
						}
					]
				}
			);
		} catch (error_msg) {
			console.log('error_msg');
		}
		return res;
	}

	async function editBounty(name: string, description: string, image: string) {
		if (!contractoriumplatform_client || !stored_wallet?.address) {
			throw error(503, 'Temporarily unavailable.');
		}
		let res;
		try {
			res = await contractoriumplatform_client.edit_program(
				{
					name,
					description,
					image
				},
				{
					boxes: [
						{
							appIndex: parseInt(env.PUBLIC_APP_ID),
							name: algosdk.decodeAddress(stored_wallet?.address).publicKey
						}
					]
				}
			);
		} catch (error_msg) {
			throw error(500, 'Something went wrong processign your application call!');
		}
		return res;
	}
	function toggleIsShowing(e: boolean) {
		isShowing.set(e);
	}
</script>

{#if stored_wallet !== undefined && $trigger_new_bounty}
	<div class="md:absolute md:right-0 md:mr-16 md:mt-10 mt-4 flex justify-center">
		<button
			class="text-darkBlue transition-transform hover:scale-105 rounded-lg py-2 px-5 flex justify-center"
			on:click={() => {
				toggleIsShowing(true);
			}}
			>Add new Bounty Program
		</button>
	</div>
{:else if stored_wallet !== undefined && !$trigger_new_bounty}
	<div class="md:absolute md:right-0 md:mr-16 md:mt-10 mt-4 flex justify-center">
		<button
			class="text-darkBlue transition-transform hover:scale-105 rounded-lg py-2 px-5 flex justify-center"
			on:click={() => {
				toggleIsShowing(true);
			}}
			>Modify your added Bounty Program  <i class="material-icons ml-2 ">create</i>
		</button>
	</div>
{/if}
{#if form?.success}
	{#await form.edit ? editBounty(form.data.name, form.data.description, form.data.image) : addBounty(form.data.name, form.data.description, form.data.image)}
		<div class="md:ml-10">
			<div>
				<svg
					aria-hidden="true"
					class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
				<span class="text-white font-bold">Processing Bounty data...</span>
			</div>
		</div>
	{:then val}
		{window.location.reload()}
	{:catch err}
		<h1>{err}</h1>
		<!-- Frontend Dev -->
	{/await}
{/if}

<div class="flex mt-16 md:mt-28 pb-10">
	<div class="mx-auto">
		{#if data.programs.length === 0}
			<div class="text-white text-center">No Bounties to show, yet.</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.programs as program}
					{#if program.creator == stored_wallet?.address}
						{set_trigger_new_bounty(false, program)}
						<BountyCard program={program} own_program={true} />
					{:else}
					<BountyCard program={program} own_program={false} />
					{/if}
					
				{/each}
			</div>
		{/if}
	</div>
</div>
