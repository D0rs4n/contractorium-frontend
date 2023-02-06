<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import ReportList from '../../../lib/reportList.svelte';
	import { fade } from 'svelte/transition';
	import MyAlgoConnect from '@randlabs/myalgo-connect';
	import { onMount, onDestroy } from 'svelte';
	import algosdk from 'algosdk';
	import { ContractoriumPlatform } from '../../../beaker/contractoriumplatform_client';
	import { algod_client, wallet } from '../../../stores';
	import { env } from '$env/dynamic/public';
	import { notifications } from '../../../lib/store_bounty';

	export let data: PageData;
	export let form: ActionData;

	let isReportModalOpen = false;
	let loading_txn = false;
	const toggleReportModal = (e: boolean) => {
		isReportModalOpen = e;
	};

	let myAlgoClient: MyAlgoConnect;

	onMount(async () => {
		myAlgoClient = new MyAlgoConnect();
	});

	async function signer(unsignedTxns: Array<algosdk.Transaction>) {
		let res = await myAlgoClient.signTransaction(unsignedTxns.map((txn) => txn.toByte()));
		return res.map((s) => s.blob);
	}

	let stored_wallet: { name: string; address: string } | undefined;
	const unsubscribe = wallet.subscribe((value) => {
		if (value !== undefined) {
			stored_wallet = JSON.parse(value);
		} else {
			stored_wallet = value;
		}
	});

	let contractoriumplatform_client: undefined | ContractoriumPlatform;
	if (stored_wallet?.address) {
		contractoriumplatform_client = new ContractoriumPlatform({
			client: algod_client,
			signer,
			sender: stored_wallet?.address,
			appId: parseInt(env.PUBLIC_APP_ID)
		});
	}
	async function createReport(to: string, description_hash: string) {
		if (
			!contractoriumplatform_client ||
			!stored_wallet?.address ||
			to === undefined ||
			description_hash == undefined
		) {
			return;
		}
		let res;
		try {
			res = await contractoriumplatform_client.create_report(
				{ to, description: description_hash },
				{
					boxes: [
						{ appIndex: parseInt(env.PUBLIC_APP_ID), name: algosdk.decodeAddress(to).publicKey }
					]
				}
			);
		} catch {
			notifications.add(
				'error',
				'Something went wrong executing your request!',
				'Application call failed.'
			);
			return;
		}
		notifications.add('success', 'Successfully created a report!', '');
		setTimeout(() => {
			window.location.reload();
		}, 2000);
		return res;
	}
	async function delete_program() {
		if (!contractoriumplatform_client || stored_wallet?.address === undefined) {
			return;
		}
		let res;
		loading_txn = true;
		try {
			res = await contractoriumplatform_client.delete_program({
				boxes: [
					{
						appIndex: parseInt(env.PUBLIC_APP_ID),
						name: algosdk.decodeAddress(stored_wallet?.address).publicKey
					}
				]
			});
		} catch {
			notifications.add(
				'error',
				'Something went wrong executing your request!',
				'Application call failed.'
			);
			loading_txn = false;
			return;
		}
		notifications.add('success', 'Successfully deleted your bounty program!', '');
		loading_txn = false;
		setTimeout(() => {
			window.location.href = '/';
		}, 2000);
		return res;
	}
	onDestroy(unsubscribe);
</script>
{#if loading_txn}
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
		<span class="text-white font-bold">Processing...</span>
	</div>
</div>
{/if}
{#if form?.success && data.program?.name.toString() !== undefined}
	{#await createReport(data.program?.creator.toString(), form.data?.description)}
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
				<span class="text-white font-bold">Processing report data...</span>
			</div>
		</div>
	{/await}
{:else if form?.success == false}
	{() => {
		notifications.add(
			'error',
			'Something went wrong processing your request!',
			'Please try again later'
		);
		return '';
	}}
{/if}

<div class="md:absolute md:left-0 md:ml-16 md:mt-10 mt-4 flex justify-center">
	<button
		class="text-darkBlue transition-transform hover:scale-105 rounded-lg py-2 px-5 flex justify-center"
		on:click={() => {
			window.location.href = '/';
		}}
		><i class="material-icons">keyboard_backspace</i> back to home
	</button>
</div>
<div
	class="bg-navbarBg mt-8 md:mt-32 mx-4 md:w-3/4 md:mx-auto rounded-lg p-8 text-white md:flex md:flex-col-2 md:justify-between md:content-center drop-shadow-lg"
>
	<div class="md:flex md:flex-col-2 ">
		<div class="flex flex-row md:block">
			<img
				src={data.program?.image.toString()}
				class="w-16 h-16 md:float-right rounded-full"
				alt={'Image name'}
			/>
			<h1 class="text-lg ml-4 text-green-400 break-words flex md:hidden">
				<span>{data.program?.name}</span>
				{#if data.program?.verified}
					<i class="material-icons ml-2 text-verified align-middle justify-center">
						verified_user
					</i>
				{/if}
			</h1>
		</div>
		<div class="mx-2 md:mx-8 md:mt-0 mt-4">
			<h1 class="text-lg ml-4 text-green-400 break-words md:flex hidden">
				<span>{data.program?.name}</span>
				{#if data.program?.verified}
					<i class="material-icons ml-2 text-verified align-middle justify-center">
						verified_user
					</i>
				{/if}
			</h1>
			<p class="max-w-4xl overFlowText">
				{data.program?.description}
			</p>
		</div>
	</div>
	<div class="">
		{#if stored_wallet !== undefined}
			<button
				class="outline-none border border-red-500 bg-red-500 text-white px-3 py-2 w-full rounded-lg flex flex-row mx-auto md:mx-0 md:mt-0 mt-8 transition-transform hover:scale-105"
				on:click={() => toggleReportModal(true)}
			>
				Submit report <i class="material-icons ml-2">bug_report</i>
			</button>
		{/if}
		{#if stored_wallet && stored_wallet?.address == data.program?.creator}
			<button
				class="outline-none border border-red-500 w-full bg-red-500 text-white px-3 py-2 rounded-lg flex flex-row mx-auto md:mx-0 md:mt-4 mt-8 transition-transform hover:scale-105"
				on:click={async () => {
					await delete_program();
				}}
			>
				Delete bounty program <i class="material-icons ml-2">report </i>
			</button>
		{/if}
	</div>
</div>

<div class="mt-16 mx-auto md:w-3/4 pb-10">
	<div class="mt-3">
		<p class="text-white text-4xl text-center mb-10">Reports</p>
		{#if data.resp && data.resp.success && data.resp.data && data.resp.data.length > 0}
			{#each data.resp.data as report}
				<ReportList
					{report}
					wallet_address={stored_wallet?.address}
					program_creator={data.program?.creator.toString()}
				/>
			{/each}
		{:else}
			<div class="text-center text-gray-400">No reports added</div>
		{/if}
	</div>
</div>
{#if isReportModalOpen}
	<div
		class="relative z-10 h-full overflow-hidden"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
		transition:fade={{ duration: 300 }}
	>
		<div class="fixed inset-0 bgCover bg-opacity-75 overflow-y-hidden" />

		<div class="fixed inset-0 z-10 overflow-y-hidden h-auto">
			<div class="flex h-full justify-center text-center items-center md:p-0 overflow-y-hidden">
				<div
					class="relative transform overflow-y-hidden rounded-lg  text-left shadow-xl d:my-8 md:w-full md:max-w-lg"
					transition:fade={{ duration: 300 }}
				>
					<form
						method="POST"
						id="newReportForm"
						action="?/createreport"
						enctype="multipart/form-data"
					>
						<div class="bg-white px-10 md:px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div class="right-5 top-3 absolute">
								<i
									class="material-icons text-red-500 cursor-pointer"
									on:click={() => toggleReportModal(false)}>close</i
								>
							</div>
							<div class="sm:flex sm:items-start">
								<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
										Submit a report to {data.program?.name}
									</h3>
									<div class="mt-2">
										<p class="mb-1">Title</p>
										<input
											type="text"
											required
											class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg"
											placeholder="Title of your report"
											name="name"
										/>
										<br />
										<p class="mb-1 mt-6">Description</p>
										<textarea
											form="newReportForm"
											required
											class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg resize-none md:w-auto w-full"
											placeholder="Description of the bounty program."
											rows="15"
											cols="42"
											name="description"
										/>
									</div>
								</div>
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<button
								type="submit"
								class="inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
								>Submit a report!</button
							>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.bgCover {
		background-color: rgba(0, 0, 0, 0.7);
	}
	.overFlowText {
		word-break: break-word;
		white-space: pre-wrap;
	}
</style>
