# Starter Kit

### An opinionated SvelteKit starter, with the following opinions:

- TypeScript
- Prettier
- ESLint
- MCP (incl. Claude, Cursor, Gemini)
- Bun
- Component & Library aliases
- Viewport-fit cover
- Ignore lock files

### Along with these features:

- Analytics, Button, Cookie, Loader starter components
- CSS reset (kitto)
- Global CSS with sensible defaults and fluid type vars (kitto)
- Overlay component for pixel perfect frontend (kitto)
- Preferences store backed by localstorage (kitto)
- Security headers in hooks
- Size CSS shorthand (kitto)
- SSL support with mkcert
- Svelte Check RS
- UI state store
- Variablised media query breakpoints (kitto)

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
bunx degit https://github.com/mattpilott/starter-kit my-app
```

To recreate the underlying SvelteKit setup use this configuration:

```sh
# recreate this project
bun x sv@0.12.8 create --template minimal --types ts --add prettier eslint sveltekit-adapter="adapter:auto" devtools-json mcp="ide:claude-code,cursor,gemini+setup:remote" --install bun .
```

## Developing

Once you've created a project and installed dependencies with `bun i`, start a development server:

```sh
bun dev

# or start the server and open the app in a new browser tab
bun dev -- --open
```

## Contact form

The contact form sends through [Postboi](https://postboi.app). Set it up once per project:

```sh
bunx postboi init
```

This writes `POSTBOI_TOKEN` to `.env` and the project's captcha key to `postboi.config.ts`, and adds postboi to `vite.config.ts` and the `prepare` script. Commit those changes, and set `POSTBOI_TOKEN` and `POSTBOI_TO` on your host. Postboi captcha-checks every form submission, so without the key the form's messages can be rejected.

## Building

To create a production version of your app:

```sh
bun run build
```

You can preview the production build with `bun preview`.

## Additional Features

### Height & width shorthand

Define both height and width in a single line.

```css
div {
	size: 10rem;
}
```

### Variable media queries

Define your breakpoints just once in the Vite config and use them in your CSS and Svelte components.

```css
@media (--from-mobile) and (--until-tablet) {
	color: blue;
	size: 10px; /* this instead of height + width */
}
```

```svelte
<Overlay mobile="/mobile.jpg@393" desktop="/desktop.jpg@1920" />
```

## Notes

### Local SSL

For local trusted SSL's rather than untrusted self-signed (like that of vite-basic-ssl) use mkcert.

```bash
brew install mkcert nss

mkcert -install

mkcert localhost
```

Then add/edit the https object in svelte config

```js
server: {
	proxy: {},
	https: {
		key: readFileSync(new URL('localhost-key.pem', import.meta.url), 'utf8'),
		cert: readFileSync(new URL('localhost.pem', import.meta.url), 'utf8')
	}
},
```
