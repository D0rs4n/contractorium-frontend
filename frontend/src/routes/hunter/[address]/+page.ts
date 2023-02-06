import type { PageLoad } from './$types';
import { fetchReportsForAddress } from '../../../lib/utils';

export const load = (async ({ params }) => {
	return {
		resp: await fetchReportsForAddress(params.address),
		addr: params.address
	};
}) satisfies PageLoad;
