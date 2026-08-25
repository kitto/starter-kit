import adapter from '@sveltejs/adapter-auto'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { kitto } from 'kitto/vite'
import { Features } from 'lightningcss'

export default defineConfig({
	css: {
		lightningcss: {
			exclude: Features.LightDark
		}
	},
	plugins: [
		kitto({
			breakpoints: {
				mobile: 640,
				tablet: 1024,
				laptop: 1280,
				desktop: 1440
			},
			fluid: { vmax: 1600 },
			targets: 'baseline'
		}),
		sveltekit({
			adapter: adapter(),
			alias: {
				$assets: './src/assets',
				$components: './src/components',
				$library: './src/library'
			},
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			}
		})
	]
})
