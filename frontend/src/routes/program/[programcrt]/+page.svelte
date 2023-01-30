<script lang="ts">
	import type { PageData } from './$types';
	import ReportList from '../../../lib/reportList.svelte';
	import BountyCard from '$lib/bountyCard.svelte';
	export let data: PageData;
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
			<p class="text-lg text-green-400 md:hidden block ml-4">
				{data.program?.name}
			</p>
		</div>
		<div class="mx-2 md:mx-8 md:mt-0 mt-4">
			<p class="text-lg text-green-400 hidden md:block">{data.program?.name}</p>
			<p class="max-w-4xl">
				{data.program?.description}
			</p>
		</div>
	</div>
	<div class="">
		<button
			class="outline-none border border-red-500 bg-red-500 text-white px-3 py-2 rounded-lg flex flex-row mx-auto md:mx-0 md:mt-0 mt-8 transition-transform hover:scale-105"
			on:click={() => alert('You submitted a report!')}
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
