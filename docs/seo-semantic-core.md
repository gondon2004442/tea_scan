# Tea Scan — Semantic core (English) & SEO map

Target market: **international / English**. Search engines: Google (worldwide).

The site is a client-rendered app whose catalog sits behind a login, so search
engines cannot index the app itself. To rank for tea queries we ship **static,
crawlable HTML pages** built from the catalog (`scripts/generate-seo.mjs`) that
target the clusters below. These live alongside the app on Firebase Hosting and
link into it ("Open the app").

## Page ↔ keyword-cluster map

| Page | URL | Primary queries | Supporting queries |
|------|-----|-----------------|--------------------|
| Catalog index | `/catalog/` | chinese tea catalog, types of chinese tea, chinese tea list | green/oolong/pu-erh/white/black/yellow/dark/scented tea, loose leaf chinese tea |
| Gongfu guide | `/guide/gongfu-brewing/` | how to brew gongfu, gongfu cha, gongfu tea | gaiwan brewing, tea steeping time, water temperature for tea, how to brew oolong/green/pu-erh |
| Per-tea page (×50) | `/tea/<slug>/` | `<tea name>`, `<tea name> tea, how to brew <tea name>` | `<tea name> gongfu`, `<tea name> steeping time`, `<tea name> temperature`, `<category> tea`, origin/region |
| App landing | `/` (`/explore`) | tea scan, scan tea app, tea finder | tea search by photo, tea recommendation quiz |

## Cluster detail

**Brand / product** — tea scan, scan tea, tea scanner app, identify tea by photo,
tea recommendation quiz. (App landing + meta/OG already set.)

**Category (head terms)** — chinese green tea, chinese oolong tea, pu-erh tea,
white tea, chinese black tea / red tea, yellow tea, dark tea, jasmine / scented
tea. → Catalog sections (`/catalog/#oolong`, etc.).

**How-to / informational** — how to brew tea gongfu style, gongfu cha method,
how to use a gaiwan, water temperature for green/oolong tea, tea steeping times,
how many infusions. → Gongfu guide + brewing table on every tea page.

**Long-tail (per tea)** — e.g. "how to brew Tie Guan Yin", "Da Hong Pao steeping
time", "Longjing water temperature", "what is Bi Luo Chun". → 50 dedicated pages,
each with the tea's story, brewing recipe (temp / ratio / infusions) and internal
links to same-category teas.

## On-page SEO shipped
- Unique `<title>` + meta description per page; canonical URLs.
- Open Graph + Twitter cards (per-tea image where available).
- JSON-LD structured data: `ItemList` (catalog), `Article` (tea pages), `HowTo` (guide).
- Internal linking: catalog ↔ teas ↔ related teas ↔ app.
- `robots.txt` + generated `sitemap.xml` (home, catalog, guide, all 50 teas).
- Brand favicon (multi-size) + PWA manifest.

## What SEO does NOT do by itself (expectations)
Publishing these pages makes the site **eligible** to rank; it is not instant.
Google must crawl and index them (days–weeks), and competitive head terms
("chinese tea") need time + external links (backlinks) to rank well. Long-tail
per-tea queries are the realistic early wins.

## Next levers (optional, not yet done)
- Submit the sitemap in Google Search Console and request indexing.
- Add FAQ blocks (FAQ schema) to tea pages for richer results.
- A short blog / articles targeting informational queries.
- If a Russian-speaking audience matters, add a parallel `/ru/` set of pages
  (the generator can be extended with translated fields).
