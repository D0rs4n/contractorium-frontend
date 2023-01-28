import type { PageLoad } from './$types';
import { fetchPrograms } from '../lib/utils';
export const load = (async () => {
	const data = await fetchPrograms();
	console.log(data)
	return {
		programs: data
	};
}) satisfies PageLoad;
