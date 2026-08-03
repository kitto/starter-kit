<script lang="ts">
	import '../app.css'
	import favicon from '$assets/favicon.svg'
	import og from '$assets/og.png'
	import Loader from '$components/loader.svelte'
	import Seo from '$components/seo.svelte'
	// import Cookies from '$components/cookies.svelte'
	// import Analytics from '$components/analytics.svelte'
	// import { Overlay } from 'kitto/svelte'

	let { children } = $props()
</script>

<svelte:head>
	<meta name="version" content={import.meta.env.version} />
	<meta name="build" content={import.meta.env.build} />
	<link rel="icon" href={favicon} />
</svelte:head>

<Seo name="Starter Kit" description="An opinionated SvelteKit starter kit" image={og} locale="en_GB" />
<Loader />

{@render children?.()}

<!-- <Cookies /> -->
<!-- <Analytics id="G-XXXXXXXXXX" /> -->
