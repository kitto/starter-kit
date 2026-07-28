import adapter from '@sveltejs/adapter-auto'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { kitto } from 'kitto/vite'

export default defineConfig({
	plugins: [
		kitto({
			breakpoints: {
				mobile: 640,
				tablet: 1024,
				laptop: 1280,
				desktop: 1440
			},
			fluid: { vmax: 1600 }
		}),
		sveltekit({
			adapter: adapter(),
			alias: {
				$assets: './src/assets',
				$components: './src/components',
				$library: './src/library'
			},
			vitePlugin: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				// Resolved per-file in JS — rsvelte's native compiler can't accept function options.
				dynamicCompileOptions: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : { runes: true }
			}
		})
	]
})
