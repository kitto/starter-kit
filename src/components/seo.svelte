<script lang="ts" module>
	let instances = 0 // Shared across every <Seo> instance, so we can detect double-rendering.
</script>

<script lang="ts">
	import { page } from '$app/state'
	import { dev } from '$app/env'
	import { onMount } from 'svelte'

	interface Props {
		name: string // Site name — og:site_name + the Organization/WebSite entity
		description: string // Default description, used when a route doesn't set its own
		image?: string // Default og:image (absolute, or root-relative — resolved against the origin)
		locale?: string // og:locale, e.g. 'en_GB'. Omitted when not set
		lang?: string // Language for inLanguage
	}

	let { name, description, image, locale, lang = 'en' }: Props = $props()

	// Warn (dev only) if <Seo> is mounted more than once — e.g. in both a layout and a page —
	// which duplicates every <head> tag. Set per-page values via page.data.seo from a load instead.
	if (dev) {
		onMount(() => {
			instances += 1
			if (instances > 1) {
				console.warn(
					'[Seo] rendered more than once (likely in both a layout and a page). This duplicates ' +
						'<head> tags. Render <Seo> once, and set per-page values via page.data.seo from a load function.'
				)
			}
			return () => (instances -= 1)
		})
	}

	// Per-page overrides: routes set `page.data.seo` from a load function.
	const seo = $derived(page.data.seo ?? {})
	const title = $derived(seo.title ?? name)
	const desc = $derived(seo.description ?? description)
	const type = $derived(seo.type ?? 'website')
	const origin = $derived(page.url.origin)
	const canonical = $derived(origin + page.url.pathname)
	const og_src = $derived(seo.image ?? image)
	const og_image = $derived(og_src ? new URL(og_src, origin).href : undefined)

	// `script` token split so the literal tag isn't parsed as a block; `<` escaped so content can't break out.
	const json_ld = $derived(
		`<${'script'} type="application/ld+json">${JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				{ '@type': 'Organization', '@id': `${origin}/#organization`, name, url: `${origin}/` },
				{
					'@type': 'WebSite',
					'@id': `${origin}/#website`,
					url: `${origin}/`,
					name,
					publisher: { '@id': `${origin}/#organization` },
					inLanguage: lang
				},
				{
					'@type': 'WebPage',
					'@id': `${canonical}#webpage`,
					url: canonical,
					name: title,
					description: desc,
					isPartOf: { '@id': `${origin}/#website` },
					inLanguage: lang
				}
			]
		}).replace(/</g, '\\u003c')}</${'script'}>`
	)
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:url" content={canonical} />
	{#if og_image}
		<meta property="og:image" content={og_image} />
		<meta property="og:image:alt" content={title} />
	{/if}

	<meta property="og:site_name" content={name} />
	{#if locale}
		<meta property="og:locale" content={locale} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />

	{@html json_ld}
</svelte:head>
