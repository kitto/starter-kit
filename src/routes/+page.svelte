<script lang="ts">
	// ██████╗ ███████╗██╗     ███████╗████████╗███████╗    ███╗   ███╗███████╗
	// ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝    ████╗ ████║██╔════╝
	// ██║  ██║█████╗  ██║     █████╗     ██║   █████╗      ██╔████╔██║█████╗
	// ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝      ██║╚██╔╝██║██╔══╝
	// ██████╔╝███████╗███████╗███████╗   ██║   ███████╗    ██║ ╚═╝ ██║███████╗
	// ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝    ╚═╝     ╚═╝╚══════╝
	import { format_date } from 'kitto'
	import { onMount } from 'svelte'

	const build_format = '{DD}-{MM}-{YYYY}@{HH}:{mm}:{ss}'

	// Start with the build-time value (matches SSR) then swap to the time the page was opened on mount.
	let opened = $state(import.meta.env.build)
	onMount(() => (opened = format_date(build_format)))

	// Menu: highlight the section currently crossing the upper band of the viewport.
	const slug = (s: string) =>
		s
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')

	let active = $state('')

	onMount(() => {
		const observer = new IntersectionObserver(
			entries => {
				for (const entry of entries) if (entry.isIntersecting) active = entry.target.id
			},
			{ rootMargin: '-15% 0px -75% 0px' }
		)
		for (const el of document.querySelectorAll('.item')) observer.observe(el)
		return () => observer.disconnect()
	})

	function highlight(code: string): string {
		return code
			.replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, m => `<span class=hl-s>${m}</span>`)
			.replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, m => `<span class=hl-s>${m}</span>`)
			.replace(/\/\*[\s\S]*?\*\//g, m => `<span class=hl-c>${m}</span>`)
			.replace(/\/\/[^\n]*/g, m => `<span class=hl-c>${m}</span>`)
			.replace(/&lt;\/?[\w-]+[^&]*&gt;/g, m => `<span class=hl-t>${m}</span>`)
			.replace(/(--[\w-]+)/g, m => `<span class=hl-v>${m}</span>`)
			.replace(/@(media|import)/g, m => `<span class=hl-k>${m}</span>`)
			.replace(/\b(media|import|var|if|export|return|const|let|and)\b/g, m => `<span class=hl-k>${m}</span>`)
			.replace(
				/\b(fluid|breakpoints|size|composeVisitors|storable|set)\b/g,
				m => `<span class=hl-f>${m}</span>`
			)
			.replace(/(\.[a-zA-Z][\w-]*)(?=[\s{,])/g, m => `<span class=hl-sel>${m}</span>`)
			.replace(/\b(?<![\w-]-)(\d+\.?\d*)(px|rem|em|%)?\b/g, m => `<span class=hl-n>${m}</span>`)
	}

	const items = $derived([
		{
			title: 'TypeScript, lint, and checks',
			badge: 'package.json',
			desc: 'TypeScript across the app, Oxfmt and ESLint (with the Svelte plugin), and `svelte-check-rs` via `bun run check`. Dependencies and scripts assume Bun.',
			example: `"scripts": {
  "check": "svelte-kit sync && svelte-check-rs --tsconfig ./tsconfig.json",
  "lint": "oxfmt --check . && eslint .",
  "format": "oxfmt"
}`
		},
		{
			title: 'LightningCSS + kitto visitors',
			badge: 'vite.config.ts',
			desc: 'CSS is processed with LightningCSS. Breakpoints are defined once in Vite; `fluid()` gives responsive `clamp()` values; `size` is a width+height shorthand. All three come from `kitto/lightningcss`.',
			examples: [
				{
					label: 'vite.config.ts',
					code: `visitor: composeVisitors([
  breakpoints({ mobile: 640, tablet: 1024, laptop: 1280, desktop: 1440 }),
  fluid({ vmax: 1600 }),
  size
])`
				},
				{
					label: 'breakpoints()',
					explain:
						'Use `--from-*` for min-width, `--until-*` for max-width and `--only-*` for the range up to the next breakpoint — no pixel values repeated in every file.',
					code: `&lt;style lang="css"&gt;
  @media (--from-mobile) { .sidebar { display: block; } }
  @media (--only-mobile) {
    .hero { padding: 2rem; }  /* 640px – 1023px */
  }
&lt;/style&gt;`
				},
				{
					label: 'fluid()',
					explain:
						'Resolves to `clamp(min, preferred, max)` so type and spacing can scale smoothly between viewports instead of fixed jumps.',
					code: `&lt;style lang="css"&gt;
  --f-h1: fluid(2.5rem, 5rem) / 1.2 var(--f-family);
  padding: fluid(1rem, 3rem);
&lt;/style&gt;`
				},
				{
					label: 'size()',
					explain: 'Sets `width` and `height` to the same value—handy for icons and square thumbnails.',
					code: `&lt;style lang="css"&gt;
  .icon { size: 24px; }
  .avatar { size: 3rem; }
&lt;/style&gt;`
				}
			]
		},
		{
			title: 'Design tokens',
			badge: 'app.css',
			desc: '`:root` holds fluid type steps (`--f-h1` … `--f-body`), radii (`--r-*`), layout width (`--s-wrap`), and base color. Reach for variables before new one-off numbers.',
			example: `&lt;style lang="css"&gt;
  .container { max-width: var(--s-wrap); }
  .card { border-radius: var(--r-14); }
  .title { font: var(--f-h2); }
&lt;/style&gt;`
		},
		{
			title: 'kitto unify',
			badge: 'app.css',
			desc: 'Imported first: sensible defaults for type smoothing, links, and buttons, plus a small reset-style baseline. Your tokens and overrides sit in the same file after the import.',
			example: `@import 'kitto/unify';

:root {
  --c-black: hsl(230 50% 4%);
  --f-h1: fluid(2.5rem, 5rem) / 1.2 var(--f-family);
  /* … */
}`
		},
		{
			title: 'Security headers',
			badge: 'hooks.server.ts',
			desc: 'Every response gets cache control, CSP (`frame-ancestors`), permissions policy, referrer policy, and X-Content-Type-Options—reasonable defaults you can tighten per app.',
			example: `response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
response.headers.set('X-Content-Type-Options', 'nosniff')`
		},
		{
			title: 'handleError',
			badge: 'hooks.server.ts',
			desc: 'Errors are shaped centrally: production shows a short generic message (no stack traces); dev and preview surface the real `error.message`. The env comes from `import.meta.env.environment`—detected at build time from the deploying host (Vercel, Netlify, Cloudflare Pages & Workers) and baked in, so it works server- and client-side with no env var or `.env`.',
			example: `// 'development' | 'preview' | 'production'
message: import.meta.env.environment === 'production' ? 'Whoa there!' : err.message`
		},
		{
			title: 'HTTPS in dev (optional)',
			badge: 'vite.config.ts',
			desc: 'If `localhost.pem` and `localhost-key.pem` exist (e.g. from mkcert), the dev server serves HTTPS—useful for OAuth redirects, `Secure` cookies, or APIs that need a secure context. Otherwise Vite logs a warning and runs over HTTP.',
			example: `# After mkcert localhost (+ key files next to vite.config.ts)
bun dev   # https://localhost:5173 when certs are present`
		},
		{
			title: 'Version and build metadata',
			badge: 'vite.config.ts · +layout.svelte',
			desc: '`import.meta.env` exposes package name, version, a build timestamp, and the deploy environment (development / preview / production, auto-detected on Vercel & Cloudflare); the layout also mirrors version/build in `<meta>` tags for quick checks in the DOM. The timestamp below is rendered live with `format_date` from kitto—it shows when you opened this page.',
			example: `import.meta.env.name        // starter-kit
import.meta.env.version     // 2.0.0
import.meta.env.build       // ${opened}
import.meta.env.environment // development`
		},
		{
			title: 'Path aliases',
			badge: 'vite.config.ts',
			desc: '`$components` and `$library` map to `src/components` and `src/library` so imports stay short and consistent.',
			example: `import Loader from '$components/loader.svelte'
import { prefs } from '$library/stores'`
		},
		{
			title: 'Route loader',
			badge: 'Loader.svelte',
			desc: 'A slim progress bar runs along the top during client-side navigations. It is already mounted in `+layout.svelte`; adjust or remove there.',
			example: `// Wired in +layout.svelte — no extra setup on routes`
		},
		{
			title: 'Cookie banner (optional)',
			badge: 'Cookies.svelte',
			desc: 'A consent UI backed by the `prefs` store—tri-state `cookies`: `undefined` undecided, `true` accepted, `false` rejected. It self-guards for SSR, so just render it; any feature can react to the choice. Commented out in `+layout.svelte`—enable for GDPR-style consent.',
			example: `&lt;Cookies /&gt;

// gate any feature on the decision
{#if $prefs.cookies === true}
  &lt;Map /&gt;
{/if}`
		},
		{
			title: 'Google Analytics helper',
			badge: 'Analytics.svelte',
			desc: 'Google Consent Mode v2—gtag loads for everyone but defaults to denied until the user accepts (then granted via `prefs.cookies`), so non-consenting visits get anonymous cookieless pings. Sends a page view on each `afterNavigate` for SPA route changes.',
			example: `import Analytics from '$components/analytics.svelte'

&lt;Analytics id="G-XXXXXXXXXX" /&gt;`
		},
		{
			title: 'Overlay (pixel perfect helper)',
			badge: 'kitto/svelte',
			desc: 'Optional full-viewport design overlay tool with separate mobile and desktop sources, enabling you to achieve pixel perfect design your designer would approve of. Commented in `+layout.svelte`; pass your asset paths when you enable it.',
			example: `import { Overlay } from 'kitto/svelte'

&lt;Overlay mobile="/mobile.jpg@393" desktop="/desktop.jpg@1920" /&gt;`
		},
		{
			title: 'Storable stores',
			badge: 'kitto/svelte',
			desc: 'Svelte stores that sync to `localStorage` and across tabs—used for the tri-state cookie consent and a good fit for theme or UI toggles that should survive refresh.',
			example: `import { storable } from 'kitto/svelte'

// undefined = undecided, true = accepted, false = rejected
export const prefs = storable&lt;{ cookies?: boolean }&gt;({}, 'prefs')`
		}
	])
</script>

<main class="page">
	<div class="wrap">
		<div class="content">
			<section class="hero">
				<h1 class="hero-title">Starter Kit</h1>
				<p class="hero-desc">
					This repo is a working SvelteKit app not a tutorial site. It comes with Bun-friendly scripts, TypeScript,
					linting and formatting, LightningCSS helpers for breakpoints and fluid type, basic security headers, and a few
					small UI pieces (loader, optional cookie banner, analytics helper) already imported or one comment away. Use
					it as a shortcut so you are not redoing the same wiring on every new project. When you are ready,
					<span>replace or delete this page</span>
					and ship your own home screen.
				</p>
			</section>

			<section class="items">
				{#each items as item (item)}
					<article class="item" id={slug(item.title)}>
						<div class="item-header">
							<h2 class="item-title">{item.title}</h2>
							<div class="item-badge">{item.badge}</div>
						</div>
						<p class="item-desc">{item.desc}</p>
						{#if item.examples}
							{#each item.examples as ex (ex)}
								<div class="item-example-block">
									<span class="item-example-label">{ex.label}</span>
									{#if ex.explain}
										<p class="item-explain">{ex.explain}</p>
									{/if}
									<pre class="item-example"><code>{@html highlight(ex.code)}</code></pre>
								</div>
							{/each}
						{:else}
							<pre class="item-example"><code>{@html highlight(item.example)}</code></pre>
						{/if}
					</article>
				{/each}
			</section>
		</div>

		<nav class="menu" aria-label="Sections">
			<span class="menu-label">On This Page</span>
			{#each items as item (item.title)}
				<a
					class="menu-link"
					class:active={active === slug(item.title)}
					aria-current={active === slug(item.title) ? 'true' : undefined}
					href="#{slug(item.title)}">
					{item.title}
				</a>
			{/each}
		</nav>
	</div>

	<footer class="footer">
		<p class="footer-links">
			<a href="https://svelte.dev/docs/kit">SvelteKit documentation</a>
			<span class="separator">·</span>
			<a href="https://github.com/mattpilott/starter-kit">Starter kit source</a>
		</p>
	</footer>
</main>

<style lang="css">
	:global(:root) {
		color-scheme: light dark;
	}

	:global(html, body) {
		background: light-dark(#ffffff, #000000);
	}

	/* Milieu tokens — light-dark(light value, dark value), sourced from ~/.milieu/design(.dark).md */
	.page {
		--bg: light-dark(#ffffff, #000000); /* background-100 */
		--text-1: light-dark(#171717, #ededed); /* gray-1000 */
		--text-2: light-dark(#4d4d4d, #a0a0a0); /* gray-900 */
		--border: light-dark(#00000014, #ffffff24); /* gray-alpha-400 */
		--fill: light-dark(#0000000d, #ffffff12); /* gray-alpha-100 */
		--code-bg: light-dark(#fafafa, #000000); /* background-200 */
		--accent: light-dark(#006bff, #006efe); /* blue-700 */
		--focus: light-dark(#006bff, #47a8ff); /* blue-700 / blue-900 */
		--svelte: light-dark(#d43008, #f96743); /* Svelte orange */
		--sans: 'Geist', system-ui, sans-serif;
		--mono: 'Geist Mono', ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
		--ease: cubic-bezier(0.175, 0.885, 0.32, 1.1);

		background: var(--bg);
		color: var(--text-1);
		font-family: var(--sans);
		min-height: 100vh;
	}

	@media (color-gamut: p3) {
		.page {
			--accent: light-dark(oklch(57.61% 0.2508 258.23), oklch(57.61% 0.2321 258.23));
			--focus: light-dark(oklch(57.61% 0.2508 258.23), oklch(71.7% 0.1648 250.79));
		}
	}

	.page a:focus-visible {
		outline: none;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 4px var(--focus);
	}

	.wrap {
		margin: 0 auto;
		max-width: 75rem; /* 1200px column */
		width: 90vw;
	}

	.menu {
		display: none;
	}

	.content {
		margin: 0 auto;
		max-width: 48rem;
	}

	@media (--from-tablet) {
		.wrap {
			column-gap: 64px;
			display: grid;
			grid-template-columns: minmax(0, 1fr) 14rem;
		}

		.menu {
			align-self: start;
			display: flex;
			flex-direction: column;
			gap: 2px;
			margin-top: clamp(48px, 8vw, 96px);
			max-height: calc(100vh - 64px);
			overflow-y: auto;
			position: sticky;
			top: 32px;
		}

		.content {
			margin: 0;
		}
	}

	.menu-label {
		font: 600 0.875rem/1.4 var(--sans); /* heading-14 */
		letter-spacing: -0.02em;
		margin-bottom: 8px;
		padding-left: 10px;
	}

	.menu-link {
		border-radius: 6px;
		color: var(--text-2);
		font: 400 0.875rem/1.4 var(--sans); /* label-14 */
		padding: 6px 10px;
		transition:
			background 150ms var(--ease),
			color 150ms var(--ease);
	}

	.menu-link:hover {
		color: var(--text-1);
	}

	.menu-link.active {
		background: var(--fill);
		color: var(--text-1);
	}

	.hero {
		padding: clamp(48px, 8vw, 96px) 0 clamp(40px, 6vw, 64px);
	}

	.hero-title {
		font: 600 fluid(3rem, 4.5rem) / 1.05 var(--sans);
		letter-spacing: -0.06em; /* heading-48…72 tracking */
		margin: 0 0 16px;
	}

	.hero-desc {
		color: var(--text-2);
		font: 400 fluid(1.125rem, 1.25rem) / 1.55 var(--sans); /* copy-18…20 */
		margin: 0;
		max-width: 60ch;

		span {
			color: var(--text-1);
			text-decoration: underline;
			text-underline-offset: 0.2em;
		}
	}

	.items {
		border-top: 1px solid var(--border);
	}

	.item {
		border-bottom: 1px solid var(--border);
		padding: 32px 0;
		scroll-margin-top: 32px;
	}

	.item:last-of-type {
		border-bottom: none;
	}

	.item-header {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 8px 12px;
		margin-bottom: 8px;
	}

	.item-title {
		font: 600 1.5rem/1.35 var(--sans); /* heading-24 */
		letter-spacing: -0.04em;
		margin: 0;
	}

	.item-badge {
		background: var(--fill);
		border-radius: 9999px;
		color: var(--text-2);
		font: 400 0.8125rem/1 var(--mono); /* label-13-mono */
		padding: 6px 12px;
	}

	.item-desc {
		color: var(--text-2);
		font: 400 1rem/1.5 var(--sans); /* copy-16 */
		margin: 0 0 16px;
		max-width: 68ch;
	}

	.item-example-block {
		margin-bottom: 16px;
	}

	.item-example-block:last-child {
		margin-bottom: 0;
	}

	.item-example-label {
		display: block;
		font: 400 0.875rem/1.45 var(--mono); /* label-14-mono */
		margin-bottom: 4px;
	}

	.item-explain {
		color: var(--text-2);
		font: 400 0.875rem/1.45 var(--sans); /* copy-14 */
		margin: 0 0 8px;
		max-width: 68ch;
	}

	.item-example {
		background: var(--code-bg);
		border: 1px solid var(--border);
		border-radius: 6px;
		font: 400 0.875rem/1.55 var(--mono); /* copy-14-mono */
		margin: 0;
		overflow-x: auto;
		padding: 16px 20px;
	}

	.item-example code {
		color: var(--text-1);
		white-space: pre;
	}

	/* Syntax colors from the Milieu accent scales, step 900 (secondary text) */
	.item-example :global(.hl-c) {
		color: light-dark(#7d7d7d, #8f8f8f); /* gray-800 / gray-700 */
		font-style: italic;
	}
	.item-example :global(.hl-s) {
		color: light-dark(#107d32, #00ca50); /* green-900 */
	}
	.item-example :global(.hl-t) {
		color: light-dark(#7d00cc, #c472fb); /* purple-900 */
	}
	.item-example :global(.hl-k) {
		color: light-dark(#7d00cc, #c472fb); /* purple-900 */
	}
	.item-example :global(.hl-f) {
		color: light-dark(#005ff2, #47a8ff); /* blue-900 */
	}
	.item-example :global(.hl-v) {
		color: light-dark(#aa4d00, #ff9300); /* amber-900 */
	}
	.item-example :global(.hl-sel) {
		color: light-dark(#c41562, #ff4d8d); /* pink-900 */
	}
	.item-example :global(.hl-n) {
		color: light-dark(#007f70, #00cfb7); /* teal-900 */
	}

	.footer {
		--glow: light-dark(rgb(212 48 8 / 0.12), rgb(249 103 67 / 0.2));

		background: radial-gradient(70% 120% at 50% 115%, var(--glow), transparent 70%);
		border-top: 1px solid var(--border);
		margin-top: 96px;
		padding: clamp(96px, 14vw, 176px) 0 clamp(64px, 10vw, 128px);
		text-align: center;
	}

	.footer-links {
		color: var(--text-2);
		font: 400 1rem/1.5 var(--sans); /* label-16 */
		margin: 0;
	}

	.footer-links a {
		color: var(--svelte);
		text-decoration: underline;
		text-underline-offset: 0.2em;
		transition: color 150ms var(--ease);
	}

	.footer-links a:hover {
		color: var(--text-1);
	}

	.separator {
		margin: 0 8px;
		opacity: 0.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-link,
		.footer-links a {
			transition: none;
		}
	}
</style>
