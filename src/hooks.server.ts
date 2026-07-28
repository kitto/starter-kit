import type { Handle, HandleServerError } from '@sveltejs/kit'

export const handleError: HandleServerError = ({ error }) => {
	const env = import.meta.env.environment
	const err = error instanceof Error ? error : new Error('Unknown error')

	return {
		// Production hides details; development and preview surface the real message for debugging.
		message: env === 'production' ? 'Whoa there!' : err.message,
		code: 'code' in err && typeof err.code === 'string' ? err.code : 'UNKNOWN',
		env
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	response.headers.set('Cache-Control', 'no-cache')
	response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
	response.headers.set('Permissions-Policy', 'fullscreen=*')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	response.headers.set('X-Content-Type-Options', 'nosniff')

	return response
}
