import type { PageLoad } from './$types';
import { fetchReportsForProgram, fetchOneProgram } from '../../../lib/utils';

export const load = (async ({ params }) => {
	return {
		resp: await fetchReportsForProgram(params.programcrt),
		program: await fetchOneProgram(params.programcrt),
		address: params.programcrt,
	};
}) satisfies PageLoad;
