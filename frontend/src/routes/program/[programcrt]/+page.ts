import type { PageLoad } from './$types';
import { fetchReportsForProgram } from '../../../lib/utils';
export const load = (async ({ params }) => {
	return {
		data: await fetchReportsForProgram(params.programcrt)
	};
}) satisfies PageLoad;
