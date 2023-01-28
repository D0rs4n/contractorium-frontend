import { writable } from 'svelte/store';

export const isShowing = writable<boolean>(false); // createBountyModal visibility


// Form data
interface newBountyValue {
    name: string;
    description: string;
    image: string;
}

export const newBountyValue = writable<newBountyValue>({
    name: "",
    description: "",
    image: ""
})
//END


export const trigger_new_bounty = writable<boolean>(true); // true if add new bounty, else 

export const trigger = writable<boolean>(false); // trigger new bounty fetch