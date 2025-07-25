# All Things Linux Website

This repository contains the source code for the All Things Linux website ([allthingslinux.org](https://allthingslinux.org)).

## Overview

This is a [Next.js](https://nextjs.org/) application (using the App Router) built with [Tailwind CSS](https://tailwindcss.com/) for styling and [Contentlayer](https://www.contentlayer.dev/) for managing MDX blog content. It is deployed to [Cloudflare Workers](https://workers.cloudflare.com/) using the [OpenNext](https://opennext.js.org/) adapter (`@opennextjs/cloudflare`). The project also utilizes [Trigger.dev](https://trigger.dev/) for background jobs.

Deployments are automated via Cloudflare's Git integration, deploying the `main` branch to production and the `dev` branch to a development/preview environment.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (v15+)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Content:** [Contentlayer](https://www.contentlayer.dev/) (MDX)
- **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/)
- **Adapter:** [OpenNext (`@opennextjs/cloudflare`)](https://opennext.js.org/cloudflare/get-started)
- **Background Jobs:** [Trigger.dev](https://trigger.dev/)
- **Package Manager:** [npm](https://www.npmjs.com/)
- **Node Version:** Defined in `package.json` (`engines` field)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version specified in `package.json`)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- Access to Cloudflare account (for viewing deployments and managing secrets)
- Trigger.dev account for background/async task management

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/allthingslinux/allthingslinux.git
    cd allthingslinux
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Local Development

1.  **Secrets (`.dev.vars`):**

    - Create a `.dev.vars` file in the project root. This file is ignored by Git (`.gitignore`).
    - Add the required environment variables and secrets needed for local development (e.g., `GITHUB_TOKEN`, `MONDAY_API_KEY`, `MONDAY_BOARD_ID`, `DISCORD_WEBHOOK_URL`, `TRIGGER_SECRET_KEY`). Use the format `KEY=VALUE`, one per line.
    - Refer to `wrangler.local.jsonc` (`vars` section) for the expected variable names.

2.  **Run Development Servers:**

    - To start all necessary development servers (Next.js, Wrangler, Trigger.dev) concurrently, run:
      ```bash
      npm run dev:all
      ```
    - This will typically make:
      - The Next.js app available at `http://localhost:3000`.
      - The Wrangler dev server (simulating Cloudflare) available at `http://localhost:8788`.

3.  **Accessing the App:** Use `http://localhost:3000` for standard development with Hot Module Replacement (HMR). Use `http://localhost:8788` to interact with the app as it would run within the Wrangler environment (useful for testing Cloudflare-specific bindings or logic).

## Configuration Files

The project uses separate `wrangler` configuration files for different environments:

- `wrangler.local.jsonc`: Used by `npm run dev:wrangler` and `npm run dev:all`. Reads secrets from `.dev.vars`.
- `wrangler.dev.jsonc`: Used for deployments to the development environment (via Cloudflare Git integration on the `dev` branch).
- `wrangler.production.jsonc`: Used for deployments to the production environment (via Cloudflare Git integration on the `main` branch).
- `wrangler.jsonc`: Minimal file required _only_ for the `@opennextjs/cloudflare build` step (due to the specific package version). Not used for deployment targeting.

## Building the Project

To perform a full production build, including adapting the Next.js output for Cloudflare Workers via OpenNext, run:

```bash
npm run build
```

This executes the full build chain defined in `package.json`. The output suitable for Cloudflare deployment will be placed in the `.open-next` directory.

## Deployment

Deployments are typically automated via Cloudflare's Git integration connected to the `allthingslinux-development` and `allthingslinux-production` Worker services.

- **Push to `dev` branch:** Triggers a build and deployment to the development environment.
- **Push to `main` branch:** Triggers a build and deployment to the production environment.

Manual deployments can be triggered using:

- `npm run deploy:dev` (Builds and deploys to development)
- `npm run deploy:prod` (Builds and deploys to production)
- `npm run deploy` (Alias for `deploy:prod`)

Refer to the Cloudflare Worker settings for the exact build/deploy commands used by the automated process.

## Secrets Management

- **Local:** Use the `.dev.vars` file (ensure it's in `.gitignore`).
- **Development:** Manage secrets via the Cloudflare dashboard for the `allthingslinux-development` Worker or using `wrangler secret put <KEY> --env development`.
- **Production:** Manage secrets via the Cloudflare dashboard for the `allthingslinux-production` Worker or using `wrangler secret put <KEY>`.

## Available Scripts

For a detailed explanation of all available NPM scripts, please refer to the `NPM_SCRIPTS.md` file in the repository root.
