// @sveltejs/vite-plugin-svelte is aliased to @rsvelte/vite-plugin-svelte (see package.json overrides),
// whose bundled types only declare the @rsvelte module name. Re-export them under the aliased name.
declare module '@sveltejs/vite-plugin-svelte' {
	export * from '@rsvelte/vite-plugin-svelte'
}
