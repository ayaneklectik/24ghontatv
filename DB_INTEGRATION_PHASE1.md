# 24GhontaTV — Database Integration Phase 1

## What changed

The public-facing Next.js website no longer depends on the `data/mockNews.ts` news arrays for the homepage, category archive, news details, search, gallery and public media sections.

The flow is:

Next.js server component → Laravel public REST API → Laravel Eloquent → MySQL

## Laravel public endpoints

- GET /api/v1/home
- GET /api/v1/site
- GET /api/v1/categories
- GET /api/v1/categories/{slug}
- GET /api/v1/categories/{id}/news
- GET /api/v1/sub-categories/{id}/news
- GET /api/v1/news
- GET /api/v1/news/{id}
- GET /api/v1/search
- GET /api/v1/videos
- GET /api/v1/photos
- GET /api/v1/epapers
- GET /api/v1/family
- GET /api/v1/live-video
- GET /api/v1/just-now
- GET /api/v1/special-section

## Environment

Local Next.js:

LARAVEL_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
LARAVEL_BASE_URL=http://127.0.0.1:8000

Production Next.js:

LARAVEL_PUBLIC_API_URL=https://api.24ghontatv.com/api/v1
LARAVEL_BASE_URL=https://24ghontatv.com

Deploy `public_html/app/Http/Controllers/PublicApiController.php` and
`public_html/routes/api.php` to Laravel for the public home and news-detail
endpoints. The Laravel application must also be able to connect to its MySQL
database.

## Media paths

News images:
- /images/news_img/{filename}

Gallery:
- /images/photo_gallery/{filename}

Family:
- /images/news_family/{filename}

E-paper:
- /epaper/{name}.pdf

## Important

`data/mockNews.ts` is no longer used by the public homepage flow. It can be kept temporarily for reference and then removed after visual verification.

Admin dashboard pages still contain some local/mock UI state in this phase. The Laravel admin CRUD API already exists; the next integration phase should wire each admin page to the existing `/api/admin/*` BFF routes while preserving the current UI.
