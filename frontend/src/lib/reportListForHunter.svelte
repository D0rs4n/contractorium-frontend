<script lang="ts">
	import { displayAlgoAddress } from './utils';
	import type { BugBountyReport } from './collections';
	export let report: BugBountyReport;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="bg-navbarBg mt-4 p-4 mx-4 max-w-3xl md:mx-auto drop-shadow-lg text-white flex justify-between align-middle content-center hover:border-darkBlue cursor-pointer border rounded-lg border-navbarBg"
	on:click={() => (window.location.href = '/program/' + report.program)}
>
	<p class="text-lg">{report.name}</p>
	<p class="text-md font-medium">
		Created by: <span class="font-bold text-darkBlue"
			>{displayAlgoAddress(report.creator.toString())}</span
		>
	</p>
</div>
