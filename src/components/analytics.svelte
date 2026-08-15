<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { prefs } from '#library/stores.ts'

	interface Props {
		id?: string
	}

	let { id }: Props = $props()
	let initialised = false

	// gtag.js only processes native `arguments` entries in dataLayer; a spread array is
	// silently ignored and no hits are sent.
	function gtag(..._: Array<unknown>) {
		window.dataLayer.push(arguments)
	}

	function consent(state: 'granted' | 'denied') {
		return {
			ad_storage: state,
			ad_user_data: state,
			ad_personalization: state,
			analytics_storage: state
		}
	}

	// Google Consent Mode v2: load gtag for everyone, defaulting to the stored choice (denied until the
	// user decides) before the library runs, then update it when the choice changes. Denied sends
	// anonymous cookieless pings; granted enables full analytics.
	$effect(() => {
		if (!id) return

		if (!initialised) {
			initialised = true
			window.dataLayer = window.dataLayer || []
			gtag('consent', 'default', consent($prefs.cookies ? 'granted' : 'denied'))
			gtag('js', new Date())
			gtag('config', id)

			const script = document.createElement('script')
			script.async = true
			script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
			document.head.appendChild(script)
		} else if ($prefs.cookies !== undefined) {
			gtag('consent', 'update', consent($prefs.cookies ? 'granted' : 'denied'))
		}
	})

	// Track client-side navigations; skip the initial load (config already counted it).
	afterNavigate(({ from, to, shallow }) => {
		if (shallow) return
		if (!id || !from || !to) return

		gtag('event', 'page_view', { page_title: document.title, page_path: to.url.pathname })
	})
</script>
