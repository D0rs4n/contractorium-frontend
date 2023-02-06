import type { PageLoad } from './$types';
import { fetchReportsForProgram } from '../../../lib/utils';

export const load = (async ({ params }) => {
	return {
        resp: await fetchReportsForProgram(params.address),
        addr: params.address
	};
}) satisfies PageLoad;
