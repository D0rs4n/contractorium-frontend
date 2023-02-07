import type { PageLoad } from './$types';
import { fetchReportsForProgram, fetchOneProgram } from '../../../lib/utils';
import type { Config } from '@sveltejs/adapter-vercel';


export const load = (async ({ params }) => {
	return {
		resp: await fetchReportsForProgram(params.programcrt),
		program: await fetchOneProgram(params.programcrt)
	};
}) satisfies PageLoad;
