<script lang="ts">
	import ReportListForHunter from '../../../lib/reportListForHunter.svelte';
	import type { PageData } from './$types';
	import { displayAlgoAddress } from '../../../lib/utils';
	export let data: PageData;
</script>

{#if data.resp && data.resp.success && data.resp.data && data.resp.data.length > 0}
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
		class="bg-navbarBg mt-8 md:mt-32 mx-4 md:max-w-3xl md:mx-auto rounded-lg p-8 text-white md:justify-between md:content-center drop-shadow-lg"
	>
		<div class="">
			<h1 class="text-lg ml-4 text-green-400 break-words text-center ">
				<span>{displayAlgoAddress(data.addr)}</span>
			</h1>
		</div>
	</div>

	{#each data.resp.data as report}
		<ReportListForHunter {report} />
	{/each}
{:else}
	<div class="text-center text-gray-400 mt-32">Hunter hasn't posted a report</div>
{/if}
