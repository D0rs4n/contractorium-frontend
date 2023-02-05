import { writable } from 'svelte/store';
import type { BugBounty } from './collections';

export const isShowing = writable<boolean>(false); // createBountyModal visibility

export const trigger_new_bounty = writable<boolean>(true); // true if add new bounty, else
export const current_bounty = writable<BugBounty>();

// Form data
interface newBountyValue {
	name: string;
	description: string;
	image: string;
	verified: string;
	creator: string;
}

export const newBountyValue = writable<newBountyValue>({
	name: '',
	description: '',
	image: '',
	verified: '', // Don't use
	creator: ''
});
//END

export const trigger = writable<boolean>(true); // trigger new bounty fetch

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
