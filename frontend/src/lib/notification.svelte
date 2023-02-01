<script lang="ts">
	import NotificationCard from './notificationCard.svelte';
	import { notifications } from './store_bounty';
</script>

<div class="absolute z-50 w-full">
	{#each $notifications as notification}
		<NotificationCard {notification} />
	{/each}
</div>
