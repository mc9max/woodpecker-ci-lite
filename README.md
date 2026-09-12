# Woodpecker CI Lite

Lightweight self-hosted CI/CD platform — GitHub Actions alternative. Runs pipelines as steps via a local backend (no Docker daemon required). Two services: server + agent.

## Deploy and Host

Host your own Woodpecker CI on Railway. This template provisions a server (UI, API, SQLite) and an agent (pipeline executor) with persistent storage for your build data.

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.com/deploy/woodpecker-ci-lite)

## Architecture

- **Server** — UI, API, webhook receiver, pipeline analyzer. Stores everything in SQLite (`/var/lib/woodpecker`).
- **Agent** — connects to the server via GRPC and executes pipeline steps locally. No Docker socket required.

## Features

- **GitHub Actions alternative** — familiar YAML pipeline syntax
- **OAuth login** — GitHub/GitLab/Forgejo/Gitea OAuth2 (configure via env vars)
- **Local backend** — runs pipeline steps directly on the agent (no Docker daemon needed)
- **SQLite by default** — zero external database to manage
- **Webhook triggers** — automatic pipeline runs on push/PR
- **Secrets management** — built-in secret store for pipeline variables
- **Parallel steps** — `WOODPECKER_MAX_WORKFLOWS` controls concurrency
- **Persistent** — SQLite DB persists across deploys via Railway volume

### Deployment Dependencies

This template is self-contained — no external services required. All data persists on the server's volume. The only external dependency is an OAuth app with your forge (GitHub, GitLab, Forgejo, or Gitea) for user authentication.

## About Hosting

Woodpecker CI requires two services:

1. **Server** — the web UI and API. Exposes port 8000 for HTTP and port 9000 for GRPC (agent communication).
2. **Agent** — the pipeline executor. Connects to the server via GRPC using a shared secret.

Both services must share the same `WOODPECKER_AGENT_SECRET`. The server stores all data in SQLite, persisted via a Railway volume mounted at `/var/lib/woodpecker`.

To enable user authentication, configure an OAuth app with your forge (GitHub, GitLab, Forgejo, or Gitea) and set the corresponding `WOODPECKER_<FORGE>_CLIENT` and `WOODPECKER_<FORGE>_SECRET` environment variables.

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server HTTP port | `8000` |
| `WOODPECKER_HOST` | Public URL for webhook callbacks | `https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| `WOODPECKER_OPEN` | Allow open registration | `true` |
| `WOODPECKER_ADMIN` | Admin username (optional) | — |
| `WOODPECKER_AGENT_SECRET` | Shared secret (must match agent) | `${{secret(32)}}` |
| `WOODPECKER_GITHUB` | Enable GitHub OAuth | `false` |
| `WOODPECKER_GITHUB_CLIENT` | GitHub OAuth Client ID | — |
| `WOODPECKER_GITHUB_SECRET` | GitHub OAuth Client Secret | — |
| `WOODPECKER_DATABASE_DRIVER` | Database driver | `sqlite3` |
| `WOODPECKER_DATABASE_DATASOURCE` | SQLite file path | `/var/lib/woodpecker/woodpecker.sqlite` |
| `WOODPECKER_LOG_LEVEL` | Log level | `info` |
| `WOODPECKER_SERVER` | Server GRPC address (agent only) | `${{server.RAILWAY_PRIVATE_DOMAIN}}:9000` |
| `WOODPECKER_MAX_WORKFLOWS` | Max parallel workflows (agent only) | `4` |
| `WOODPECKER_BACKEND` | Agent backend type | `local` |

## Quick Start

1. Deploy via the button above.
2. Configure OAuth with your forge (GitHub/GitLab/Forgejo/Gitea).
3. Set `WOODPECKER_OPEN=true` and `WOODPECKER_ADMIN=<your-username>`.
4. Access the dashboard at `https://${{RAILWAY_PUBLIC_DOMAIN}}`.
5. Add your first repository and push a `.woodpecker.yml` pipeline.

## License

Woodpecker CI is open source under the Apache License 2.0.
