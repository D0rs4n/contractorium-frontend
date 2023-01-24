<script lang="ts">
	import { fetchPrograms } from '../lib/utils';
</script>

{#await fetchPrograms()}
	<!-- TODO Loading animation of some sort-->
{:then programs}
        {#each programs as program}
            <!-- TODO Cards -->
        {/each}




{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
