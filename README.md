# Jesse K Apps Website

The official static website for Jesse K Apps, LLC. It uses semantic HTML, shared CSS, and a small amount of vanilla JavaScript—no framework, package manager, build step, or external runtime dependency.

## Project structure

- `index.html` — home page
- `products/` — overview and general/business product pages
- `sports/` — Jesse K Sports and the canonical LiveEdge product page
- `solutions/` — audience-focused Jesse K Books landing pages
- `products/jesse-k-books/` — product, downloads, Privacy Policy, and User Agreement
- `products/jesse-k-mileage/` — product, Privacy Policy, and User Agreement
- `about/`, `support/`, `privacy/`, `terms/` — company pages
- `assets/css/styles.css` — shared design system and responsive styles
- `assets/js/site.js` — mobile navigation and current-year enhancement
- `assets/favicon.svg` — compact Jesse K Apps brand favicon
- `assets/brand/` — approved Jesse K Apps PNG logo and product-specific SVG icons
- `assets/css/brand.css` — shared brand refinement and logo presentation
- `404.html`, `robots.txt`, `sitemap.xml` — hosting and search support

## Run locally

The pages can be opened directly, but a local server provides clean route behavior:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. No installation is required. A different available local port may also be used.

## Cloudflare Pages deployment plan

Connect this repository to Cloudflare Pages. Use the repository root as the output directory and leave the build command empty. The site consists entirely of deployable static files.

## Updating content

Edit the relevant page's HTML for copy and page-specific content. Update shared colors, spacing, and components in `assets/css/styles.css`. Navigation and footer markup are repeated intentionally so the site remains functional without JavaScript; update those sections across every HTML page when adding routes.
