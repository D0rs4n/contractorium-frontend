import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';

const config: UserConfig = {
	plugins: [sveltekit(), commonjs(), inject({ Buffer: ['buffer', 'Buffer'] })]
};

export default config;
