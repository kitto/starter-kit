// See https://svelte.dev/docs/kit/types#app.d.ts

import type { LayoutData } from './routes/$types'

// for information about these interfaces
declare global {
	interface Window {
		dataLayer: Array<unknown>
	}

	interface ImportMetaEnv {
		readonly version: string
		readonly build: string
	}

	namespace NodeJS {
		interface ProcessEnv {
			SITE_URL: string
			BETTER_AUTH_SECRET: string
			POSTBOI_TOKEN: string
			POSTBOI_TO: string
		}
	}

	namespace App {
		interface Error {
			message: string
			code: string
			env?: string
		}
		interface Locals {
			version: import('$library/storyblok.js').Version
			token: string | undefined
		}
		interface PageData {
			readonly layout: LayoutData['layout']
			readonly version: LayoutData['version']
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
