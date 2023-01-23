<script lang="ts">
	import { fetchPrograms } from '../lib/utils';
</script>

{#await fetchPrograms()}
	<p>fetching programs...</p>
{:then programs}
	{#each programs as program}
		<!-- TODO show cards of the programs. -->
	{/each}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
