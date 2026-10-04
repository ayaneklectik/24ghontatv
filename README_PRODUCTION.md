# 24GhontaTV Production Frontend

This source is a hardened Next.js frontend intended to sit in front of the Laravel REST API.

## Architecture

Browser -> Next.js same-origin routes -> Laravel REST API -> MySQL

The Laravel bearer token is stored inside the NextAuth JWT session cookie and is NOT placed in localStorage or exposed to browser JavaScript. The browser calls same-origin `/api/admin/*` BFF routes.

## Production environment

Create `.env.production` on the server (never commit it):

```env
LARAVEL_API_URL=https://api.24ghontatv.com/api/v1/admin
LARAVEL_PUBLIC_API_URL=https://api.24ghontatv.com/api/v1
NEXTAUTH_SECRET=long-random-secret
NEXTAUTH_URL=https://24ghontatv.com
NEXT_PUBLIC_SITE_URL=https://24ghontatv.com
```

Generate a secret:

```bash
openssl rand -base64 32
```

## Install

```bash
npm ci
```

Commit a generated `package-lock.json` after the first controlled install so production uses deterministic dependency versions.

## Typecheck / build

```bash
npm run typecheck
npm run build
```

## Run production

The project uses `output: standalone`.

After `npm run build`, ensure these exist inside the deployment directory:

```text
.next/standalone/server.js
.next/static/
public/
```

Then:

```bash
npm start
```

or PM2:

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

## Nginx

Use `deploy/nginx.conf.example` as the reverse-proxy template and terminate TLS at Nginx.

## Laravel companion

The Next.js public home and article pages require the Laravel
`PublicApiController` and `/api/v1/home` and `/api/v1/news/{id}` routes. Deploy
the corresponding files under `public_html/` and ensure Laravel can connect to
its MySQL database.

The Next.js Special Section editor needs:
`backend-production-overlay/`

Apply its migration/controller/route patch to the Laravel API and run:

```bash
php artisan migrate
php artisan optimize:clear
```

The header appearance, breaking ticker, and in-app user messages also require the isolated Laravel API additions under `public_html/`. Deploy those backend files before using the related admin controls, then run:

```bash
php artisan migrate
php artisan storage:link
php artisan optimize:clear
```

Set Laravel `APP_URL` to the public site origin and ensure the public storage disk is writable so uploaded header backgrounds can be served to visitors.

## Security changes included

- Removed hardcoded admin/test credentials from login flow.
- NextAuth Credentials provider authenticates against the Laravel API.
- Same-origin BFF keeps the Laravel token server-side.
- `/admin/*` is protected by NextAuth middleware.
- API calls use server-side timeouts and fail with controlled 502/503 JSON responses.
- Security response headers are enabled.
- Admin pages are marked `no-store`.
- Prisma-backed duplicate API routes were replaced by Laravel proxy routes.
- User/news CRUD now reaches the Laravel API rather than a second local database.
- Standalone output and PM2/Nginx deployment files are included.
- Robots excludes `/admin/` and `/api/`.

## Important

This package does not claim that the full application is verified against your production Laravel database until `npm run typecheck`, `npm run build`, and real API integration tests are run against your actual Laravel environment.

## Build fix: App Router root layout

The production source must contain `app/layout.tsx` at the top level. Route-group layouts such as `app/(public)/layout.tsx` and `app/(backend-ui)/layout.tsx` do not replace the required root layout for routes such as `app/login` and `app/admin/login`.

The corrected source now includes `app/layout.tsx` and keeps the public header/footer in `app/(public)/layout.tsx` without nested `<html>`/`<body>` elements.

### Local production test

```powershell
npm install
npm run typecheck
npm run build
npm run start
```

`npm run start` is only expected to work after `npm run build` succeeds and `.next/standalone/server.js` has been generated.

### Windows PowerShell health check

```powershell
curl http://localhost:3000/api/health
```

or open:

```text
http://localhost:3000/api/health
```
