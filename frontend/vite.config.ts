import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import inject from '@rollup/plugin-inject';

const config: UserConfig = {
	plugins: [inject({ Buffer: ['buffer', 'Buffer'] }), sveltekit()]
};

export default config;
