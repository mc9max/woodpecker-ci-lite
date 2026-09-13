# Woodpecker CI Lite

Lightweight self-hosted CI/CD platform — GitHub Actions alternative. Runs pipelines as steps via a local backend (no Docker daemon required). Two services: server + agent.

## Deploy and Host

Host your own Woodpecker CI on Railway. This template provisions a server (UI, API, SQLite) and an agent (pipeline executor) with persistent storage for your build data.

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.com/deploy/00TmXS)

## Why Deploy

Woodpecker CI is a modern, lightweight alternative to GitHub Actions that runs your pipelines on your own infrastructure. No Docker daemon required — the agent executes steps locally via the `local` backend, making it ideal for self-hosted CI/CD on Railway.

## Common Use Cases

- **Replace GitHub Actions** — run your own CI/CD pipelines with familiar YAML syntax without relying on GitHub's hosted runners
- **Self-hosted CI for private repos** — keep your build data and secrets on your own infrastructure
- **Cost-effective CI for small teams** — single-server deployment with SQLite, no external database needed
- **Custom build environments** — the local backend runs steps directly on the agent, giving you full control over the execution environment

## Deployment Dependencies

This template is self-contained — no external services required. All data persists on the server's volume. The server **boots on one-click deploy** (the GitHub forge is enabled by default, so Woodpecker's startup requirement is already met).

To get **working login**, add a one-time GitHub OAuth App (the login button uses it):

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. **Homepage URL:** `https://<your-railway-public-domain>`
3. **Authorization callback URL:** `https://<your-railway-public-domain>/authorize`
4. Copy the **Client ID** and **Client Secret**
5. In Railway, set these on the `woodpecker-server` service (the OAuth flags are already `true` by default):
   - `WOODPECKER_GITHUB_CLIENT=<your-client-id>`
   - `WOODPECKER_GITHUB_SECRET=<your-client-secret>`
6. Redeploy the server service

> **Why the forge defaults to `true`:** Woodpecker v3 refuses to start with no forge driver enabled (`forge not configured`). Enabling exactly one is mandatory. GitHub is enabled by default so the first deploy doesn't crash-loop; add the OAuth client/secret above to activate login. Using another forge? Set one of `WOODPECKER_FORGEJO` / `WOODPECKER_GITEA` / `WOODPECKER_GITLAB` to `true` and set `WOODPECKER_GITHUB=false`.

## Architecture

- **Server** — UI, API, webhook receiver, pipeline analyzer. Stores everything in SQLite (`/var/lib/woodpecker`).
- **Agent** — connects to the server via GRPC and executes pipeline steps locally. No Docker socket required.

## Features

- **GitHub Actions alternative** — familiar YAML pipeline syntax
- **OAuth login** — GitHub OAuth2 (one-time setup, see Deployment Dependencies)
- **Local backend** — runs pipeline steps directly on the agent (no Docker daemon needed)
- **SQLite by default** — zero external database to manage
- **Webhook triggers** — automatic pipeline runs on push/PR
- **Secrets management** — built-in secret store for pipeline variables
- **Parallel steps** — `WOODPECKER_MAX_WORKFLOWS` controls concurrency
- **Persistent** — SQLite DB persists across deploys via Railway volume

## Dependencies for

This template is self-contained — no external services required. All data persists on the server's volume. The only external dependency is an OAuth app with your forge (GitHub, GitLab, Forgejo, or Gitea) for user authentication.

## About Hosting

Woodpecker CI requires two services:

1. **Server** — the web UI and API. Exposes port 8000 for HTTP and port 9000 for GRPC (agent communication).
2. **Agent** — the pipeline executor. Connects to the server via GRPC using a shared secret.

Both services must share the same `WOODPECKER_AGENT_SECRET`. The server stores all data in SQLite, persisted via a Railway volume mounted at `/var/lib/woodpecker`. No Docker daemon is required — the agent runs pipeline steps locally.

**GitHub OAuth (one-time setup):** To enable login, create a GitHub OAuth App as described in the Deployment Dependencies section above. Without OAuth configured, the login button returns a 404 — this is expected behavior.

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server HTTP port | `8000` |
| `WOODPECKER_HOST` | Public URL for webhook callbacks | `https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| `WOODPECKER_OPEN` | Allow open registration | `true` |
| `WOODPECKER_ADMIN` | Admin username (optional) | — |
| `WOODPECKER_AGENT_SECRET` | Shared secret (must match agent) | `${{secret(32)}}` |
| `WOODPECKER_GITHUB` | Enable the GitHub forge (required for startup) | `true` |
| `WOODPECKER_GITHUB_CLIENT` | GitHub OAuth Client ID | — |
| `WOODPECKER_GITHUB_SECRET` | GitHub OAuth Client Secret | — |
| `WOODPECKER_DATABASE_DRIVER` | Database driver | `sqlite3` |
| `WOODPECKER_DATABASE_DATASOURCE` | SQLite file path | `/var/lib/woodpecker/woodpecker.sqlite` |
| `WOODPECKER_LOG_LEVEL` | Log level | `info` |
| `WOODPECKER_SERVER` | Server GRPC address (agent only) | `${{server.RAILWAY_PRIVATE_DOMAIN}}:9000` |
| `WOODPECKER_MAX_WORKFLOWS` | Max parallel workflows (agent only) | `4` |
| `WOODPECKER_BACKEND` | Agent backend type | `local` |

## Quick Start

1. Deploy via the button above — the server and agent boot immediately (GitHub forge is enabled by default).
2. Create a GitHub OAuth App (see Deployment Dependencies above).
3. Set `WOODPECKER_GITHUB_CLIENT` and `WOODPECKER_GITHUB_SECRET` on the `woodpecker-server` service and redeploy to enable login.
4. Log in; you'll automatically be an admin (first user). Optionally set `WOODPECKER_ADMIN=<your-username>`.
5. Add your first repository under **Projects** and push a `.woodpecker.yml` pipeline.

## License

Woodpecker CI is open source under the Apache License 2.0.
