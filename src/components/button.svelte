<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'

	// Accept any native <a> or <button> attribute (href, target, rel, type, disabled, aria-*, …).
	type Props = HTMLButtonAttributes &
		HTMLAnchorAttributes & {
			children?: Snippet
		}

	let { href, type, class: cls, children, ...rest }: Props = $props()
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	class={['button', cls]}
	{href}
	type={href ? undefined : (type ?? 'button')}
	{...rest}
	>{@render children?.()}
</svelte:element>

<style lang="css">
	.button {
		display: inline-block;
	}
</style>
