<script lang="ts">
	import { disconnect } from '../lib/myalgo';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let visible: boolean = false;
	onMount(() => {
		visible = true;
	});

	export let wallettAddress: string | undefined = undefined;
	export let isConnected: boolean;

</script>

{#if visible}
	<div class="w-full flex items-center justify-center">
		<div
			transition:fly={{ y: -200, duration: 900 }}
			class="items-center bg-white drop-shadow-xl text-black font-semibold rounded-2xl py-3 px-12 mt-6 w-full md:w-1/5 mx-8 md:mx-0"
		>
			{#if isConnected}
				<div>
					<h1 class="text-xl">{wallettAddress}</h1>
				</div>
				<div class="items-center inline-flex">
					<span class="flex w-3 h-3 bg-green-500 rounded-full float-left" />
					<span class="text-xs text-gray-800 ml-2">connected</span>
				</div>
				<button
					on:click={disconnect}
					class="float-right bg-red-500 w-4 h-4 rounded-full text-center absolute right-0 top-0 m-4"
					>x</button
				>
			{:else}
				<div>
					<h1 class="text-xl">Connect wallett</h1>
				</div>
				<div class="items-center inline-flex">
					<span class="flex w-3 h-3 bg-red-500 rounded-full float-left" />
					<span class="text-xs text-gray-800 ml-2">not connected</span>
				</div>
			{/if}
		</div>
	</div>
{/if}
