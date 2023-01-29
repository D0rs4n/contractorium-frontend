<script lang="ts">
	import type { BugBounty } from './collections';
	import { displayAlgoAddress } from './utils';

	export let program: BugBounty;
	export let own_program: boolean;
</script>

<!--TODO verify cucc -->
<div
	class="bg-navbarBg rounded-3xl md:mx-4 mx-8 py-6 px-10 text-white drop-shadow-lg max-w-md transition-transform ease-in-out hover:scale-105 duration-300 hover:drop-shadow-red hover:cursor-pointer "
	on:click={() => (window.location.href = '/program/' + program.creator.toString())}
>
	<div class="">
		<img
			src={program.image.toString()}
			class="w-16 h-16 float-right rounded-full"
			alt={program.name.toString()}
		/>
		<h1 class="text-xl font-medium text-green-400 break-words flex">
			<span>{program.name.toString()}</span>
			{#if program.verified}
				<i class="material-icons ml-2 text-verified align-middle justify-center"> verified_user </i>
			{/if}
		</h1>
	</div>
	<br />
	<div class="mt-6 text-right right-0 bottom-0">
		<p class=" text-sm font-medium w-full">
			Created by: <span class="font-bold text-darkBlue"
				>{displayAlgoAddress(program.creator.toString())}</span
			>
			{#if own_program}
				(You)
			{/if}
		</p>
	</div>
</div>
