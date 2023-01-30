<script lang="ts">
	import type { PageData } from './$types';
	import ReportList from '../../../lib/reportList.svelte';
	import BountyCard from '$lib/bountyCard.svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;
	let isReportModalOpen: boolean = false;

	const toggleReportModal = (e: boolean) => {
		isReportModalOpen = e;
	};
</script>

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
			<p class="max-w-4xl">
				{data.program?.description}
			</p>
		</div>
	</div>
	<div class="">
		<button
			class="outline-none border border-red-500 bg-red-500 text-white px-3 py-2 rounded-lg flex flex-row mx-auto md:mx-0 md:mt-0 mt-8 transition-transform hover:scale-105"
			on:click={() => toggleReportModal(true)}
		>
			Submit report <i class="material-icons ml-2">report </i>
		</button>
	</div>
</div>

<div class="mt-16 mx-auto md:w-3/4 pb-10">
	<div class="mt-3">
		<p class="text-white text-4xl text-center mb-10">Reports</p>
		{#if data.resp && data.resp.success && data.resp.data}
			{#each data.resp.data as report}
				<ReportList {report} />
			{/each}
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
					<form method="POST" id="newBountyForm" action="?/program" enctype="multipart/form-data">
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
										Create new bounty program!
									</h3>
									<div class="mt-2">
										<p class="mb-1">Name</p>
										<input
											type="text"
											required
											class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg"
											placeholder="Name of the bounty program."
											name="name"
										/>
										<p class="text-xs text-red-500 ml-1  absolute">???</p>
										<br />
										<p class="mb-1 mt-6">Description</p>
										<textarea
											form="newBountyForm"
											required
											class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg resize-none md:w-auto w-full"
											placeholder="Description of the bounty program."
											rows="15"
											cols="42"
											name="description"
										/>
										<p class="text-xs text-red-500 ml-1 absolute">???</p>
										<input type="file" required class="mt-6" name="image" />
									</div>
								</div>
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<button
								type="submit"
								class="inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
								>Create new bounty program!</button
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
</style>
