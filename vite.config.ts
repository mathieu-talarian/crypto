// @ts-nocheck
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/bench_crypto/',
	plugins: [tsconfigPaths(), svelte()],
});
