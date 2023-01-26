import type { PageLoad } from './$types';
import { fetchPrograms } from '../lib/utils';
export const load = (async () => {
  return {
    programs: await fetchPrograms()
  };
}) satisfies PageLoad;