# Project Discloser: 24GhontaTV

This document explains how the 24GhontaTV project is built, how the different parts connect, what is served where, which deployment systems are involved, and what each part does in production.

This project is not a single monolith. It is a hybrid system with:

- A modern Next.js frontend running on Vercel
- A Laravel/MySQL backend running on a cPanel-style hosting environment and/or API subdomain
- Legacy PHP content and admin assets still stored in the repo under `public_html/` and `admin_assets/`
- GitHub as the source control and deployment trigger for the frontend

The project is essentially a Bangla online news portal and CMS setup for publishing articles, categories, media, videos, e-papers, and admin content management.

---

## 1. Project at a glance

### Main public site
- `https://24ghontatv.com`

### Vercel preview / frontend deployment
- `https://24ghontatv.vercel.app/`

### Laravel API host
- `https://api.24ghontatv.com/api/v1`
- Admin API namespace: `https://api.24ghontatv.com/api/v1/admin`

### Source repository
- GitHub: `ayaneklectik/24ghontatv`

### Core architecture
- Browser -> Next.js frontend
- Frontend -> same-origin BFF routes (`/api/...`) or direct Laravel public API calls
- Laravel backend -> MySQL database
- Admin authentication -> NextAuth + Laravel Sanctum token exchange

---

## 2. What this repo contains

### Frontend / app shell
Main folders:
- `app/` — Next.js App Router pages and API routes
- `components/` — reusable UI blocks, landing-page sections, dashboard components
- `lib/` — backend proxy logic, URL resolver logic, Bengali date formatting, API helpers
- `context/` — app state and title/language contexts
- `public/` — static assets served by the frontend
- `middleware.ts` — admin route protection
- `auth.ts` — NextAuth configuration

### Backend / Laravel app
- `public_html/` — Laravel application and legacy backend
- `public_html/routes/api.php` — public and admin API definitions
- `public_html/app/Http/Controllers/PublicApiController.php` — public home/news endpoints
- `public_html/ghontatv_db.sql` — database dump / SQL backup for MySQL
- `public_html/vendor/` — Laravel dependencies

### Legacy / operational assets
- `admin_assets/` — old CMS/admin static files, images, assets, editor resources
- `deploy/` — deployment config examples and packaging
- `24ghontatv-deploy/` — packaged deployment copy of the frontend app
- `cpanel-update/` — cPanel-related update area

### Configuration and docs
- `package.json` — Next.js app scripts and dependencies
- `.env.example` — environment variables template
- `README_PRODUCTION.md` — production deployment explanation
- `DB_INTEGRATION_PHASE1.md` — backend integration notes

---

## 3. Frontend stack

The frontend is a modern Next.js + React app.

### Stack used in the frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- NextAuth for admin auth
- Lucide icons, React Icons
- Recharts for charts
- Tiptap for rich text editing
- Vercel Analytics

### Frontend build scripts
From `package.json`:
- `npm run dev` — local development server
- `npm run build` — production build
- `npm run start` — start the standalone server
- `npm run typecheck` — TypeScript validation
- `npm run lint` — ESLint

### Production server mode
This app intentionally uses:
- `output: 'standalone'` in `next.config.ts`
- `scripts/start-standalone.mjs`

This means the frontend is intended to be run as a standalone Node production server after a build, usually behind Nginx or a reverse proxy.

---

## 4. How the frontend authenticates admin users

The core auth setup is in `auth.ts`.

### Authentication flow
1. User visits `/admin/login`
2. NextAuth credentials login form posts email/password
3. Frontend sends those credentials to the Laravel admin login endpoint
4. Laravel API validates the credentials and returns a bearer token and user payload
5. The token is saved in the NextAuth JWT session and kept server-side
6. Protected admin pages use `middleware.ts` to allow only authenticated users

### Important rule
The token is not stored in browser localStorage. It is stored inside the NextAuth session/JWT and used in same-origin backend routing.

### Middleware behavior
`middleware.ts` does this:
- allows `/admin/login` to remain public
- protects all other `/admin/*` pages
- checks `token` presence through NextAuth

This is a major security pattern: the browser never directly keeps the Laravel API token in JS.

---

## 5. BFF proxy architecture

A large portion of the project uses same-origin API routes in `app/api/*`.

Example:
- `app/api/admin/[...path]/route.ts`
- `app/api/news/route.ts`
- `app/api/categories/route.ts`
- `app/api/settings/route.ts`
- `app/api/site-display-settings/route.ts`

These routes act as a backend-for-frontend (BFF) layer.

### Why this matters
The frontend does not directly call the Laravel API from the browser for sensitive admin flows. Instead, it calls routes like:
- `/api/admin/...`
- `/api/settings/...`

Those Next routes then call Laravel with a server-side proxy (see `lib/laravel-proxy.ts`).

### Proxy behavior
`lib/laravel-proxy.ts`:
- reads `LARAVEL_API_URL` or `LARAVEL_PUBLIC_API_URL`
- attaches `Authorization: Bearer ...` when needed
- handles multipart uploads and JSON body forwarding
- enforces request timeouts
- returns controlled JSON / 502 errors if the backend is down

This is the main mechanism bridging Next.js and Laravel.

---

## 6. Public data flow

The project uses Laravel as the content source for news and site data.

### Public homepage and content fetch flow
The homepage (`app/(public)/page.tsx`) calls:
- `fetchLaravelHome()`
- which uses `LARAVEL_PUBLIC_API_URL`

The public API contract is defined in `DB_INTEGRATION_PHASE1.md` and implemented by the Laravel controller under `public_html/app/Http/Controllers/PublicApiController.php`.

### Public endpoint pattern
The public API base is:
- `LARAVEL_PUBLIC_API_URL=https://api.24ghontatv.com/api/v1`

Public endpoints include:
- `GET /api/v1/home`
- `GET /api/v1/site`
- `GET /api/v1/categories`
- `GET /api/v1/categories/{slug}`
- `GET /api/v1/categories/{id}/news`
- `GET /api/v1/sub-categories/{id}/news`
- `GET /api/v1/news`
- `GET /api/v1/news/{id}`
- `GET /api/v1/search`
- `GET /api/v1/videos`
- `GET /api/v1/photos`
- `GET /api/v1/epapers`
- `GET /api/v1/family`
- `GET /api/v1/live-video`
- `GET /api/v1/just-now`
- `GET /api/v1/special-section`

The Laravel public controller builds site data such as:
- latest news
- breaking news
- popular news
- lead news
- categories
- videos
- photos
- just-now section
- site configuration data

### News detail behavior
The `showNews` method in `PublicApiController`:
- loads a published news item by ID
- increments `hit` when `track_view=true`
- loads related, previous, and next news entries
- returns article content and metadata

---

## 7. Laravel backend and admin API

The Laravel backend is in `public_html/`.

### Laravel version
From `public_html/composer.json`:
- Laravel 10
- PHP ^8.1
- Sanctum
- MySQL backend (via Laravel Eloquent)

### Admin route patterns
From `public_html/routes/api.php`:
- `GET /api/v1/admin/news/{id}`
- `POST /api/v1/admin/news`
- `PUT /api/v1/admin/news/{id}`
- `GET /api/v1/admin/site-display-settings`
- `PUT /api/v1/admin/site-display-settings`
- `POST /api/v1/admin/site-display-settings/background-image`
- `POST /api/v1/admin/site-display-settings/logo-image`

The admin routes are protected by:
- `auth:sanctum`
- `admin.only`

### Admin auth endpoint
The Laravel admin login is reached through:
- `POST {LARAVEL_API_URL}/login`

That is invoked in `auth.ts` using NextAuth Credentials provider.

---

## 8. Environment variables and config

The project expects environment variables like these from `.env.example`:

```env
NODE_ENV=production
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=https://24ghontatv.com
NEXT_PUBLIC_SITE_URL=https://24ghontatv.com
LARAVEL_BASE_URL=https://24ghontatv.com
LARAVEL_API_URL=https://api.24ghontatv.com/api/v1/admin
LARAVEL_PUBLIC_API_URL=https://api.24ghontatv.com/api/v1
NEXT_PUBLIC_MEDIA_BASE_URL=https://24ghontatv.com
```

### Meaning of the most important ones
- `NEXTAUTH_SECRET` — secret for session/JWT signing
- `NEXTAUTH_URL` — deployment origin of the frontend
- `NEXT_PUBLIC_SITE_URL` — public site base URL used in generated links and media resolution
- `LARAVEL_BASE_URL` — public site origin the frontend expects as the main site host
- `LARAVEL_API_URL` — authenticated admin API base for same-origin proxying
- `LARAVEL_PUBLIC_API_URL` — public read API base for home/news/category queries
- `NEXT_PUBLIC_MEDIA_BASE_URL` — media host resolution for images

### Important note
If any of these are missing, the project cannot work properly when running against production data.

---

## 9. cPanel and Vercel roles

### Vercel
The Next.js frontend is meant to be deployed on Vercel from GitHub.

The project includes:
- Next.js app router pages
- standalone Node build output
- security headers in `next.config.ts`
- Vercel Analytics dependency

This is the public UI deployment layer.

### cPanel / legacy hosting
The Laravel app and content system are tied to a hosting environment such as cPanel or a similar server setup. The repo contains:
- `public_html/` = Laravel app root
- legacy static assets in `admin_assets/`
- file-based server app architecture
- database dump in `public_html/ghontatv_db.sql`

This is the CMS/data layer and is likely where the actual MySQL database and old PHP site live.

### Real-world operating model
- GitHub stores the source code
- Vercel builds and serves the Next.js frontend
- cPanel/legacy hosting serves the PHP/Laravel application and DB-backed back end
- Frontend reads from the Laravel API endpoint
- The app still references a mixed architecture: legacy pieces remain alongside the new frontend

---

## 10. API and route map

### Frontend same-origin app routes
These are Next.js API endpoints used by the front-end app and admin UI:
- `/api/health`
- `/api/categories`
- `/api/news`
- `/api/news/[id]`
- `/api/photos`
- `/api/videos`
- `/api/search`
- `/api/family`
- `/api/epapers`
- `/api/live-video`
- `/api/users`
- `/api/site-display-settings`
- `/api/settings`
- `/api/settings/special-section`
- `/api/admin/[...path]`

### Admin protection
All `/admin/*` routes are protected by NextAuth middleware.

### Public pages (frontend app)
The project uses Next App Router route groups such as:
- `app/(public)/page.tsx` — homepage
- `app/(public)/news/...` — article pages
- `app/(public)/category/...` — category archive pages
- `app/(public)/gallery` — gallery pages
- `app/(public)/video` — video pages
- `app/(public)/family` — family/feature pages
- `app/(public)/search` — search page
- `app/(public)/epaper` — e-paper pages

### Backend admin UI
The admin UI is under route group:
- `app/(backend-ui)/`

This includes dashboard sections such as:
- posts/news
- categories
- gallery
- videos
- users
- social
- settings
- special section
- footer
- breaking news
- ads

---

## 11. Media handling and asset serving

A lot of the project logic revolves around media URL resolution.

### Media helper files
- `lib/urls.ts`
- `lib/site-display.ts`

These files resolve article images, previews, header backgrounds, and media asset URLs across multiple hosts.

### Common patterns
Media paths may be:
- `images/news_img/...`
- `images/photo_gallery/...`
- `images/news_family/...`
- `/epaper/{file}.pdf`

The code rewrites media hosts so old public files served from `24ghontatv.com` and API assets at `api.24ghontatv.com` can be normalized for frontend display.

### Image URL behavior
For article content and images, the code tries to:
- normalize image URLs
- prefer the correct public host
- fall back to placeholders if not available
- rewrite known hosts to the expected public origin

---

## 12. Database and persistence model

The project is tightly tied to MySQL.

### Evidence in the repo
- `public_html/ghontatv_db.sql` — SQL dump
- Laravel Eloquent models in `public_html/app/Models/`
- `PublicApiController` reads from tables such as:
  - categories
  - news tables
  - photos
  - videos
  - live video
  - social media
  - footer content
  - just-now items

### Data flow
The content backend is largely DB-driven:
- New articles are created through admin API routes
- Frontend home page and article pages read from the Laravel public API
- The DB is the canonical source for published content, categories, and site config

---

## 13. What is modern, and what is legacy?

### Modern parts
- Next.js App Router frontend
- TypeScript components
- NextAuth admin auth
- Same-origin BFF API route layer
- Production standalone server config
- Vercel deployment model

### Legacy parts
- `public_html/` Laravel app structure
- old Blade/PHP admin patterns and static assets
- `admin_assets/` CMS asset bundle
- database-first content system and old media files

### Practical interpretation
This project is in a migration / coexistence phase:
- the frontend is modernized
- the CMS and data layer still exist in a legacy codebase
- both systems must work together for the full site to function

---

## 14. What is not fully isolated

This is important for any maintainer or AI agent taking over the project.

The project is not a purely self-contained frontend repo. It depends on:
- a running Laravel API
- a MySQL database
- proper env secrets
- working media paths
- correct domain mapping between public site and API subdomain

If the Laravel backend is unavailable or the database is not connected, public pages will fail or show placeholder content.

---

## 15. Recommended deployment understanding

### Frontend deployment checklist
- Push to GitHub
- Vercel triggers production build automatically
- Build includes Next.js app
- Production env variables must be set in Vercel
- `NEXTAUTH_SECRET`, `LARAVEL_*` values must be valid

### Backend deployment checklist
- Deploy `/public_html` Laravel code to the hosting server or API domain
- Ensure PHP + Composer dependencies are installed
- Configure Laravel `.env` with DB credentials and app URL
- Run Laravel migrations and optimize commands
- Make sure storage and public uploads are writable
- Ensure the public site can access `/public` assets and media files

### Use of `README_PRODUCTION.md`
This file specifically documents the production pattern:
- Browser -> Next.js -> Laravel REST API -> MySQL
- No hardcoded admin credentials
- server-side token handling
- Nginx proxying / PM2
- standalone output

---

## 16. Operating instructions summary

### Local development
- Install dependencies: `npm ci`
- Ensure backend is available at `LARAVEL_PUBLIC_API_URL`
- Run `npm run dev`

### Production build
- `npm run typecheck`
- `npm run build`
- `npm run start`

### Laravel backend operations
- `php artisan migrate`
- `php artisan optimize:clear`
- `php artisan storage:link` if media upload storage is involved

### Reverse proxy / serving
The repo includes a sample reverse proxy config in:
- `deploy/nginx.conf.example`

This is intended to sit in front of the Next.js standalone server and terminate TLS.

---

## 17. What to expect when working on this project

Any developer or AI working on this repo must understand that:

1. The visible website is a Next.js frontend.
2. The content, news, category, admin, and media data come from a Laravel API.
3. The public site and admin site are split but connected.
4. Vercel and cPanel are separate deployment environments with different responsibilities.
5. GitHub is the code source, while runtime deployment is split between Vercel and the PHP hosting environment.
6. The project is hybrid and has both modern and legacy parts.
7. The app depends on environment variables and MySQL state being configured correctly.
8. Routing and data flows are intentionally proxied to preserve server-side auth and secure token storage.

---

## 18. Conclusion

24GhontaTV is best understood as a hybrid news portal system:

- Next.js front-end for experience and UI
- Laravel + MySQL backend for CMS, data, and APIs
- Vercel for the frontend deployment
- cPanel / hosting environment for the Laravel and legacy site deployment
- GitHub for repository and code history
- API endpoints for public and admin data flows

This means the project should be treated as a connected system, not as a single standalone frontend or a single standalone backend. Anyone working on it needs both sides of the system to understand deployment, routing, and data behavior.

---

## 19. Quick reference

### Primary domains
- Public site: `https://24ghontatv.com`
- Frontend preview: `https://24ghontatv.vercel.app/`
- Public API: `https://api.24ghontatv.com/api/v1`
- Admin API: `https://api.24ghontatv.com/api/v1/admin`

### Main source folders
- `app/` - Next.js website and API routes
- `components/` - UI building blocks
- `lib/` - helper logic and API proxies
- `public_html/` - Laravel backend and CMS logic
- `admin_assets/` - old CMS asset bundle
- `deploy/` - production deployment templates

### Core production requirement
The app is only fully functional when the Next.js frontend, Laravel API, and MySQL database are all healthy and correctly configured.
