<script lang="ts">
    import type { ABIValue } from "algosdk";
	import { onMount } from "svelte";
    import type { BugBounty } from './collections';
    import { displayAlgoAddress } from "./utils"; 

    export let program: BugBounty;

</script>
 <!--TODO verify cucc -->
<div class="bg-navbarBg rounded-3xl md:mx-0 mx-4 py-12 px-10 text-white drop-shadow-lg max-w-lg transition-transform ease-in-out  hover:scale-105 duration-300 hover:drop-shadow-red hover:cursor-pointer" >
    <div class="relative mb-4">
      <img src={program.image.toString()} class="w-16 h-16 float-right" alt={program.name.toString()}/>
      <h1 class="text-xl font-medium text-green-400">{program.name.toString()}</h1>
      <p class="text-md text-gray-300 max-w-md">{program.description.toString()}</p>
    </div>
    <div class="absolute bottom-0 right-0 mr-6 mb-4">
        <p class=" text-sm font-medium">Created by: <span class="font-bold text-darkBlue">{displayAlgoAddress(program.creator.toString())}</span></p>
    </div>
</div>