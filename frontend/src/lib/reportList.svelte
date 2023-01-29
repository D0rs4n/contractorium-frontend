<script lang="ts">
	import type { BugBountyReport } from './collections';
	import { displayAlgoAddress } from './utils';
	export let report: BugBountyReport;
	let isOpen: boolean = false;
	let divStyle: string;

	$: divStyle = isOpen
		? 'border-x border-t border-darkBlue rounded-t-lg'
		: 'border rounded-lg border-navbarBg';
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
		<p class="text-gray-200 text-md">{report.description}</p>

		<div class="mt-4">
			<button
				class="outline-none border text-md py-1 px-4 rounded-md border-green-500 bg-green-500 text-white transition-transform hover:scale-105"
			>
				Pay
			</button>
			<button
				class="outline-none border text-md py-1 px-4 rounded-md border-red-500 bg-red-500 text-white transition-transform hover:scale-105"
			>
				Close
			</button>
		</div>
	</div>
{/if}
