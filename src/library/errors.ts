import type { CaughtError } from '@sveltejs/kit/hooks'

/**
 * Shapes an error caught by either `handleError` hook into the `App.Error` the error page receives.
 * App errors from `error(...)`, framework errors (404s) and validation errors are safe to show, so they pass
 * through with `code` defaulting to their kind. Unknown errors can leak internals, so their message is masked
 * in production, and their `code` is the thrown value's own string `code` (e.g. `ECONNREFUSED`) or `UNKNOWN`.
 */
export function to_app_error({ kind, error }: CaughtError) {
	const env = import.meta.env.environment

	if (kind !== 'unknown') return { code: kind.toUpperCase(), ...error, env }

	const err = error instanceof Error ? error : new Error('Unknown error')

	return {
		// Production hides details; development and preview surface the real message for debugging.
		message: env === 'production' ? 'Whoa there!' : err.message,
		code: 'code' in err && typeof err.code === 'string' ? err.code : 'UNKNOWN',
		env
	}
}
