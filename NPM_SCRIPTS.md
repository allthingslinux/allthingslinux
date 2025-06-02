# NPM Scripts Reference

This file explains the purpose of the various scripts defined in `package.json`.

## Development

Scripts used for local development.

-   `npm run dev`
    Starts the standard Next.js development server (with Hot Module Replacement). Usually available at `http://localhost:3000`.

-   `npm run turbo`
    Starts the Next.js development server using TurboPack (experimental faster Rust-based engine).

-   `npm run dev:wrangler`
    Starts the Wrangler development server using the `wrangler.local.jsonc` configuration. This simulates the Cloudflare environment locally, including bindings. Usually available at `http://localhost:8788`.

-   `npm run trigger:dev`
    Starts the Trigger.dev local development process/CLI.

-   `npm run dev:all`
    Uses `concurrently` to run `dev`, `dev:wrangler`, and `trigger:dev` simultaneously for a complete local development environment.

## Build Steps

Individual steps involved in building the application and the Cloudflare worker bundle.

-   `npm run build:coc`
    Generates the Code of Conduct component using `scripts/generate-code-of-conduct.mjs`.

-   `npm run build:content`
    Builds content types and data using Contentlayer (`contentlayer2 build`).

-   `npm run build:next`
    Runs the standard Next.js production build (`next build`).

-   `npm run build:opennext`
    Runs the OpenNext adapter (`npx @opennextjs/cloudflare build`) to convert the Next.js build output into a Cloudflare Worker bundle located in `.open-next/`.

## Full Build

-   `npm run build`
    Executes the complete build sequence: `build:coc` -> `build:content` -> `build:next` -> `build:opennext`. This is the command typically used in CI/CD build steps.

## Deployment Steps (Worker Only)

These scripts perform *only* the deployment step, assuming the project has already been built (e.g., by `npm run build`). These are primarily used by the Cloudflare automated deployment system.

-   `npm run deploy:opennext:dev`
    Deploys the built worker (`.open-next` directory) to the `allthingslinux-development` Cloudflare Worker service, using configuration from `wrangler.dev.jsonc`.

-   `npm run deploy:opennext:prod`
    Deploys the built worker (`.open-next` directory) to the `allthingslinux-production` Cloudflare Worker service, using configuration from `wrangler.production.jsonc`.

## Full Deployment (Build & Deploy)

These scripts perform the full build *and* then deploy to the specified environment. Useful for manual deployments.

-   `npm run deploy:dev`
    Runs `npm run build` followed by `npm run deploy:opennext:dev`.

-   `npm run deploy:prod`
    Runs `npm run build` followed by `npm run deploy:opennext:prod`.

-   `npm run deploy`
    Alias for `npm run deploy:prod`. The default deploy action targets production.

## Preview & Start

-   `npm run preview:built`
    Runs a full `npm run build` and then starts a local preview server using `opennextjs-cloudflare preview` and the `wrangler.local.jsonc` configuration. This allows testing the final build artifact locally.

-   `npm run start`
    Starts the standard Next.js production server using the output from `npm run build:next`. Note: This does *not* run the Cloudflare worker adapter and is generally not used for previewing the deployed Cloudflare version.

## Checks & Formatting

Scripts for code quality and consistency checks.

-   `npm run lint`
    Runs ESLint to check for code style and potential errors.

-   `npm run format`
    Runs Prettier to automatically format code according to defined rules.

-   `npm run check`
    Runs a sequence of checks: TypeScript (`check:ts`), Prettier format (`check:format`), and MDX linting (`check:mdx`).

-   `npm run check:format`
    Runs Prettier in check mode (reports formatting issues without changing files).

-   `npm run check:mdx`
    Runs Remark CLI to lint `.mdx` files in `content/blog/`.

-   `npm run check:ts`
    Runs the TypeScript compiler (`tsc --noEmit`) to check for type errors without generating JavaScript output.

## Utilities

Miscellaneous helper scripts.

-   `npm run populate-cache:local`
    Uses OpenNext to populate the local cache (requires bindings to be set up correctly in `wrangler.local.jsonc`).

-   `npm run populate-cache:remote`
    Uses OpenNext to populate the remote cache (requires bindings to be set up correctly in the relevant deployed environment config).

-   `npm run cf-typegen`
    Uses Wrangler to generate a `cloudflare-env.d.ts` file based on the bindings defined in `wrangler.local.jsonc`. This provides TypeScript types for Cloudflare environment variables and bindings.

-   `npm run secrets:dev`
    Executes `bash scripts/secrets.sh development`. Likely part of a custom script to manage secrets for the development environment.

-   `npm run secrets:prod`
    Executes `bash scripts/secrets.sh production`. Likely part of a custom script to manage secrets for the production environment.

-   `npm run trigger:deploy`
    Deploys Trigger.dev jobs using the Trigger.dev CLI. 