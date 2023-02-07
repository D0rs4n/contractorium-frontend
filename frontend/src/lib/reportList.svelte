<script lang="ts">
	import MyAlgoConnect from '@randlabs/myalgo-connect';
	import algosdk, { type TransactionWithSigner, AtomicTransactionComposer } from 'algosdk';
	import { onMount } from 'svelte';
	import { algod_client } from '../stores';
	import type { BugBountyReport } from './collections';
	import { displayAlgoAddress } from './utils';
	import { env } from '$env/dynamic/public';
	import { notifications } from './store_bounty';
	import { ContractoriumPlatform } from '../beaker/contractoriumplatform_client';
	import { fade } from 'svelte/transition';

	export let report: BugBountyReport;
	export let wallet_address: string | undefined;
	export let program_creator: string | undefined;

	let isOpen = false;
	let divStyle: string;
	let loading_txn = false;
	$: divStyle = isOpen
		? 'border-x border-t border-darkBlue rounded-t-lg'
		: 'border rounded-lg border-navbarBg';

	let myAlgoClient: MyAlgoConnect;

	onMount(async () => {
		myAlgoClient = new MyAlgoConnect();
	});

	async function signer(unsignedTxns: Array<algosdk.Transaction>) {
		let res = await myAlgoClient.signTransaction(unsignedTxns.map((txn) => txn.toByte()));
		return res.map((s) => s.blob);
	}
	let contractoriumplatform_client: undefined | ContractoriumPlatform;
	if (wallet_address && env.PUBLIC_APP_ID) {
		contractoriumplatform_client = new ContractoriumPlatform({
			client: algod_client,
			signer,
			sender: wallet_address,
			appId: parseInt(env.PUBLIC_APP_ID)
		});
	}
	let isPayModalOpen = false;
	let algoInputForReport: number;
	let noteForReport: string;

	const togglePayModal = (e: boolean) => {
		isPayModalOpen = e;
	};

	async function close_report(assetID: number) {
		loading_txn = true;
		try {
			await contractoriumplatform_client?.delete_report({
				appForeignAssets: [assetID]
			});
		} catch {
			notifications.add('error', 'Something went wrong, please try again later!', '');
			loading_txn = false;
			return;
		}
		notifications.add('success', 'Successfully closed report!', '');
		setTimeout(() => {
			window.location.reload();
		}, 2000);
	}

	async function close_and_pay_report(
		asset_index: number,
		bounty_program_creator_address: string,
		report_creator_address: string,
		amount_of_algos: number,
		note: string
	) {
		if (contractoriumplatform_client === undefined) {
			notifications.add('error', 'Something went wrong when initializing app bridge!', '');
			return;
		}
		loading_txn = true;
		// First Opt-in to asset.
		if (wallet_address === undefined || wallet_address == null) {
			return;
		}
		const params = await algod_client.getTransactionParams().do();

		const payment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
			suggestedParams: await algod_client.getTransactionParams().do(),
			amount: algosdk.algosToMicroalgos(amount_of_algos),
			from: wallet_address,
			to: algosdk.getApplicationAddress(contractoriumplatform_client.appId)
		});
		const tws: TransactionWithSigner = { txn: payment, signer };
		const atc = new AtomicTransactionComposer();
		let methodToCall = new algosdk.ABIMethod({
			name: 'close_and_pay_report',
			desc: '',
			args: [
				{ type: 'pay', name: 'payment', desc: '' },
				{ type: 'string', name: 'bounty_note', desc: '' }
			],
			returns: { type: 'void', desc: '' }
		});
		atc.addMethodCall({
			appID: contractoriumplatform_client.appId,
			method: methodToCall,
			methodArgs: [tws, note],
			sender: wallet_address,
			suggestedParams: params,
			signer,
			boxes: [
				{
					appIndex: parseInt(env.PUBLIC_APP_ID),
					name: algosdk.decodeAddress(wallet_address).publicKey
				}
			],
			appForeignAssets: [asset_index],
			appAccounts: [bounty_program_creator_address, report_creator_address]
		});
		try {
			await atc.execute(algod_client, 2);
		} catch {
			notifications.add('error', 'Something went wrong, please try again later!', '');
			loading_txn = false;
			return;
		}
		notifications.add('success', 'Successfully paid report!', 'Happy hacking!');
		setTimeout(() => {
			window.location.reload();
		}, 2000);
		return;
	}
</script>

{#if isPayModalOpen}
	<div
		class="relative z-10 h-full overflow-hidden"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
		transition:fade={{ duration: 300 }}
	>
		<div class="fixed inset-0 bgCover bg-opacity-75 overflow-y-hidden">
			<div class="fixed inset-0 z-10 overflow-y-hidden h-auto">
				<div class="flex h-full justify-center text-center items-center md:p-0 overflow-y-hidden">
					<div
						class="relative transform overflow-y-hidden rounded-lg  text-left shadow-xl d:my-8 md:w-full md:max-w-lg"
						transition:fade={{ duration: 300 }}
					>
						<form
							enctype="multipart/form-data"
							on:submit|preventDefault={async () => {
								if (program_creator === undefined) {
									return;
								}
								togglePayModal(false);
								await close_and_pay_report(
									parseInt(report.asset_id.toString()),
									program_creator,
									report.creator.toString(),
									algoInputForReport,
									noteForReport
								);
							}}
						>
							<div class="bg-white px-10 md:px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class="right-5 top-3 absolute">
									<i
										class="material-icons text-red-500 cursor-pointer"
										on:click={() => {
											togglePayModal(false);
										}}>close</i
									>
								</div>
								<div class="sm:flex sm:items-start">
									<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
											Pay hunter
										</h3>
										<div class="mt-2">
											<p class="mb-1">Number of Algos</p>
											<input
												type="number"
												step=".01"
												required
												class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg"
												placeholder="1"
												name="name"
												bind:value={algoInputForReport}
											/>
										</div>
										<p class="mb-1">Note</p>
										<input
											type="text"
											required
											class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg"
											placeholder="Nice catch!"
											bind:value={noteForReport}
											name="name"
										/>
									</div>
								</div>
							</div>
							<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									type="submit"
									class="inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
									>Pay report</button
								>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	id={report.asset_id.toString()}
	class="bg-navbarBg mt-4 p-4 mx-4 max-w-3xl md:mx-auto drop-shadow-lg text-white flex justify-between align-middle content-center hover:border-darkBlue cursor-pointer {divStyle}"
	on:click={() => (isOpen = !isOpen)}
>
	<div class="overFlowText">
	<p class="text-lg">{report.name}</p>
	</div>
	<p class="text-md font-medium">
		Created by: <span class="font-bold text-darkBlue"
			>{displayAlgoAddress(report.creator.toString())}</span
		>
	</p>
</div>
{#if isOpen}
	<div
		class="z-10 max-w-3xl mx-4 md:mx-auto p-4 rounded-b-lg border-b border-l border-r border-darkBlue bg-lightNavBar"
	>
		<div class="overFlowText">
			<p class="text-gray-200 text-md">{report.description}</p>
		</div>
		{#if wallet_address !== undefined}
			<div class="mt-4">
				{#if wallet_address == program_creator && loading_txn == false}
					<button
						class="outline-none border text-md py-1 px-4 rounded-md border-green-500 bg-green-500 text-white transition-transform hover:scale-105"
						on:click={async () => {
							togglePayModal(true);
						}}
					>
						Pay
					</button>
				{/if}
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
							<span class="text-white font-bold">Processing request..</span> <br />
						</div>
					</div>
				{/if}
				{#if wallet_address !== undefined && (wallet_address === report.creator || wallet_address === report.program)}
					{#if !loading_txn}
						<button
							class="outline-none border text-md py-1 px-4 rounded-md border-red-500 bg-red-500 text-white transition-transform hover:scale-105"
							on:click={async () => {
								if (wallet_address !== undefined) {
									await close_report(parseInt(report.asset_id.toString()));
								} else {
									notifications.add('error', 'Error, something went wrong.', '');
								}
							}}
						>
							Close
						</button>
					{/if}
				{/if}
			</div>
		{/if}
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
