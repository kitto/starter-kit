<script lang="ts">
	import { enhance } from '$app/forms'
	import Captcha from 'postboi/svelte'
	import { slide } from 'svelte/transition'

	let sending: 'idle' | 'sending' | 'success' | 'error' = $state('idle')
</script>

<section class="contact">
	<div class="contain">
		<h2>Contact Us</h2>

		{#if sending === 'success'}
			<p transition:slide>Thank you for your message. We will get back to you soon.</p>
		{/if}
		{#if sending === 'error'}
			<p transition:slide>Sorry, there was an error sending your message. Please try again.</p>
		{/if}

		<form
			action="/?/contact"
			method="POST"
			use:enhance={() => {
				sending = 'sending'

				return async ({ result }) => {
					sending = result.type === 'success' ? 'success' : 'error'
				}
			}}
		>
			<input type="text" name="name" placeholder="Name" required />
			<input type="email" name="email" placeholder="Email" required />
			<textarea name="message" placeholder="Message" required></textarea>
			<Captcha />
			<button type="submit" disabled={sending === 'sending'}>
				{sending === 'sending' ? 'Sending...' : 'Send'}
			</button>
		</form>
	</div>
</section>

<style>
	.contact {
		background-color: var(--c-black);
		color: var(--c-white);
		padding-block: var(--s-40);
	}

	form {
		display: grid;
		gap: 1rem;

		@media (--from-tablet) {
			grid-template-columns: 1fr 1fr;
		}
	}

	input,
	textarea {
		padding: 1rem;
		border: 1px solid var(--c-white);
		border-radius: var(--r-10);
		color: inherit;
	}

	textarea {
		grid-column: 1 / -1;
	}

	button {
		grid-column: 1 / -1;
		background-color: var(--c-white);
		color: var(--c-black);
		padding: 1rem 2rem;
		border-radius: var(--r-10);
		cursor: pointer;

		&[disabled] {
			opacity: 0.5;
			cursor: not-allowed;
		}

		@media (--from-tablet) {
			justify-self: end;
		}
	}
</style>
