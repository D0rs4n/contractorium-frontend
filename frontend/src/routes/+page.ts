import type { PageLoad } from './$types';
import { fetchPrograms } from '../lib/utils';
export const load = (async () => {
	const data = await fetchPrograms();
	return {
		programs: data
	};
}) satisfies PageLoad;
