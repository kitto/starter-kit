import type { HandleServerError } from '@sveltejs/kit/hooks'

const ENV = import.meta.env.environment

export const handleError: HandleServerError = ({ error, kind, issues }) => {
	// Errors thrown with `error(...)` already have the App.Error shape the app chose.
	if (kind === 'app') return { ...error, env: ENV }

	// Framework (404s) and validation errors carry a safe status and message; validation
	// issues can echo user input, so they are logged rather than sent to the client.
	if (kind !== 'unknown') {
		if (issues) console.error('Validation failed', issues)

		return { code: kind.toUpperCase(), env: ENV }
	}

	const err = error instanceof Error ? error : new Error('Unknown error')

	return {
		// Production hides details; development and preview surface the real message for debugging.
		message: ENV === 'production' ? 'Whoa there!' : err.message,
		code: 'code' in err && typeof err.code === 'string' ? err.code : 'UNKNOWN',
		env: ENV
	}
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
