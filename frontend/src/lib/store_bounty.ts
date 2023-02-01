import { writable } from 'svelte/store';

export const isShowing = writable<boolean>(false); // createBountyModal visibility

// Form data
interface newBountyValue {
	name: string;
	description: string;
	image: string;
}

export const newBountyValue = writable<newBountyValue>({
	name: '',
	description: '',
	image: ''
});
//END

export const trigger_new_bounty = writable<boolean>(true); // true if add new bounty, else

export const trigger = writable<boolean>(false); // trigger new bounty fetch

//Notifications

export interface Notification {
	type: string;
	title: string;
	desc: string;
}

function createNotifications() {
	const { subscribe, update } = writable<Notification[]>([]);

	return {
		subscribe,
		add: (type: string, title: string, desc: string) => {
			update((p) => [...p, { type, title, desc }]);
		}
	};
}

export const notifications = createNotifications();
