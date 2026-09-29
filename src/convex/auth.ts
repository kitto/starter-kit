import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { components } from './_generated/api'
import type { DataModel } from './_generated/dataModel'
import { query } from './_generated/server'
import { betterAuth, type BetterAuthOptions } from 'better-auth/minimal'
import config from './auth.config.js'
import schema from './better_auth/schema.js'
import { magicLink } from 'better-auth/plugins'
import { mail } from 'postboi'

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const auth_component = createClient<DataModel, typeof schema>(components.better_auth, {
	local: { schema }
})

export const options = (ctx: GenericCtx<DataModel>) =>
	({
		baseURL: process.env.SITE_URL,
		database: auth_component.adapter(ctx),
		plugins: [
			// The Convex plugin is required for Convex compatibility
			convex({ authConfig: config }),
			magicLink({
				allowedAttempts: 3,
				async sendMagicLink({ email, url }) {
					// POSTBOI_TOKEN comes from the Convex deployment's environment
					await mail({
						to: email,
						subject: 'Your magic link',
						body: `<p>Click the link to sign in:</p><p><a href="${url}">${url}</a></p>`
					})
				}
			})
		]
	}) satisfies BetterAuthOptions

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const get_current_user = query({
	args: {},
	handler: async (ctx) => auth_component.getAuthUser(ctx).catch(() => null)
})

export const create_auth = (ctx: GenericCtx<DataModel>) => betterAuth(options(ctx))
