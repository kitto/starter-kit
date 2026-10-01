<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation'
	import { Tween } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'

	let show_loading_bar = $state(false)
	let hide_timeout: ReturnType<typeof setTimeout>

	const progress = new Tween(0, {
		duration: 3500, // The time it takes to move between values
		easing: cubicOut // The easing function to use
	})

	beforeNavigate(({ from, to, shallow }) => {
		if (shallow) return

		if (from?.url.pathname !== to?.url.pathname) {
			// Cancel a pending hide so a quick second navigation doesn't blank the bar mid-load.
			clearTimeout(hide_timeout)
			show_loading_bar = true
			progress.set(0.7)
		}
	})

	afterNavigate(({ shallow }) => {
		if (shallow) return

		progress.set(1, { duration: 500 })

		hide_timeout = setTimeout(() => {
			show_loading_bar = false
			progress.set(0, { duration: 0 })
		}, 600)
	})
</script>

{#if show_loading_bar}
	<div class="progress">
		<div class="bar" style="width: {progress.current * 100}%"></div>
	</div>
{/if}

<style>
	.progress {
		background-color: var(--c-black);
		height: 0.125rem;
		position: fixed;
		top: 0;
		width: 100%;
		will-change: transform;
		z-index: 2000;
	}

	.bar {
		background-color: hsl(225 73% 57%);
		height: 100%;
	}
</style>
