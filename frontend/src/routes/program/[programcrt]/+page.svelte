<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div
	class="bg-navbarBg mt-16 md:mt-24 mx-4 md:w-3/4 md:mx-auto rounded-lg p-8 text-white md:flex md:flex-col-2 md:justify-between md:content-center"
>
	<div class="md:flex md:flex-col-2 ">
		<div class="flex flex-row md:block">
			<img
				src={'https://cdn.discordapp.com/attachments/375333831496040458/1067530611776049182/732221.png'}
				class="w-16 h-16 md:float-right rounded-full"
				alt={'Image name'}
			/>
			<p class="text-lg text-green-400 md:hidden block ml-4">
				Name of the bounty program in Mobile version
			</p>
		</div>
		<div class="mx-2 md:mx-8 md:mt-0 mt-4">
			<p class="text-lg text-green-400 hidden md:block">Name of the bounty program</p>
			<p class="max-w-4xl">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum tortor a sem<br />
				faucibus, id malesuada nulla aliquet. Sed id semper enim, non tincidunt nulla. Morbi bibendum
				tellus vel elit viverra auctor. Aliquam frin<br />gilla, nisl at euismod congue, libero
				libero luctus nulla, vel pharetra metus metus id en<br />im. Curabitur vel aliquet nisi. Nam
				congue quam vel velit ullamcorper, id vesti<br />bulum velit tempor. Nullam non lectus
				euismod, posuere velit vel, fringilla nulla.
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

{#each data.data as report}
	{report.name}
{/each}
