import { to_app_error } from '#library/errors.ts'

export function handleError(input) {
	// Replaces SvelteKit's default client hook, which logged unknown errors to the console.
	if (input.kind === 'unknown') console.error(input.error)

	return to_app_error(input)
}
