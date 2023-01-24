<script lang="ts">
	import { fetchPrograms } from '../lib/utils';
    import { BugBounty } from '../lib/collections';
    import BountyCard from '../lib/bountyCard.svelte';
</script>


<div class="flex mt-16 md:mt-28 pb-10">
    <div class="mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {#await fetchPrograms()}
                <div class="bg-navbarBg rounded-3xl md:mx-0 mx-4 py-12 px-10 text-white drop-shadow-lg max-w-lg transition-transform ease-in-out  hover:scale-105 duration-300 hover:drop-shadow-red hover:cursor-pointer" >
                    <div class="relative mb-4">
                    <h1 class="text-xl font-medium text-green-400 bg-darkGrey rounded-xl animate-pulse"><br /></h1>
                    <p class="text-md text-gray-300 max-w-md bg-darkGrey rounded-xl mt-4 h-16 animate-pulse"><br/></p>
                    </div>
                </div>
            {:then programs}
                    {#each programs as program}
                        <BountyCard program={program}/>
                    {/each}
            {:catch error}
                <p style="color: red">{error.message}</p>
            {/await}
        </div>
    </div>
</div>