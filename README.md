# strike-cli-web

Marketing site for [strike-cli](https://github.com/jonathanung/strike-cli) — agentic coding in your terminal.

Live target: [strike.jonathanung.ca](https://strike.jonathanung.ca)

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- framer-motion + lucide-react
- Docker multi-stage (Node build → nginx Alpine)

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Docker

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

Or build the image directly:

```bash
docker build -t strike-cli-web .
docker run --rm -p 8080:80 strike-cli-web
```

## `/install` endpoint

nginx proxies `GET /install` (exact match) to the raw install script on the CLI repo:

`https://raw.githubusercontent.com/jonathanung/strike-cli/main/scripts/install.sh`

This is a **proxy**, not a redirect — `curl …/install | bash` receives the script body.

**Note:** `install.sh` must exist on the CLI repo default branch for the install endpoint to succeed. This site does **not** vendor the script.

The `/install` proxy runs inside the container nginx (see `nginx.conf`), so it works the same in local Docker and on the droplet.

## Deploy / CI/CD

Same pattern as [new-portfolio](https://github.com/jonathanung/new-portfolio): GitHub Actions builds on every push/PR to `main`, and deploys over SSH to a DigitalOcean droplet only on successful pushes to `main`.

### Workflow

- **File:** [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)
- **Build job:** checkout → Node 22 → `npm ci` → `npm run build` → `test`/`lint` if present
- **Deploy job:** runs only when `github.event_name == 'push' && github.ref == 'refs/heads/main'` (PRs never deploy). SSHes to the droplet, `git pull origin main`, then `docker-compose up -d --build --remove-orphans` (and prunes dangling images). Does not run `docker-compose down --volumes` on every deploy.

### Required GitHub secrets

Configure these under the repo **Settings → Secrets and variables → Actions**:

| Secret       | Purpose                          |
| ------------ | -------------------------------- |
| `DO_HOST`    | Droplet IP or hostname           |
| `DO_USER`    | SSH user                         |
| `DO_SSH_KEY` | Private key for that user        |
| `DO_PORT`    | SSH port (usually `22`)          |

### One-time server setup

1. Install Docker and `docker-compose` on the droplet.
2. Clone this repo to **`/var/www/strike-cli-web`** (change the path in the workflow if you use another directory).
3. Ensure the deploy user can `git pull origin main` non-interactively (deploy key or credential helper).
4. Point the host reverse proxy (nginx/Caddy) for `strike.jonathanung.ca` at the published container port. Compose maps **`8080:80`**, so proxy to `http://127.0.0.1:8080` (or adjust `docker-compose.yml` ports).
5. First bring-up (optional, before CI runs):

   ```bash
   cd /var/www/strike-cli-web
   docker-compose up -d --build
   ```

`/install` continues to be served by container nginx after deploy; no extra host proxy rule is required beyond forwarding to the app port.

## Demo GIFs

1. Record the three flows described on the site (launch, tools/permissions, sessions).
2. Put files in `public/demos/` (e.g. `launch.gif`, `tools.gif`, `sessions.gif`).
3. Wire them in `src/components/Demos.tsx` (replace the dashed placeholders with `<img src="/demos/….gif" />`).

## Links

- CLI: [github.com/jonathanung/strike-cli](https://github.com/jonathanung/strike-cli)
- Site source: this repository
