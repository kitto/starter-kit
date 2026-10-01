import { to_app_error } from '#library/errors.ts'

export function handleError(input) {
	// Replaces SvelteKit's default server hook, so log what it would: validation issues and unknown errors.
	if (input.kind === 'validation') console.error('Remote function schema validation failed:', input.issues)

	if (input.kind === 'unknown') {
		let err = input.error

		while (err instanceof Error) {
			if (err.stack) console.error(err.stack)
			err = err.cause
		}

		if (err) console.error(String(err))
	}

	return to_app_error(input)
}

export const handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	response.headers.set('Cache-Control', 'no-cache')
	response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
	response.headers.set('Permissions-Policy', 'fullscreen=*')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	response.headers.set('X-Content-Type-Options', 'nosniff')

	return response
}
