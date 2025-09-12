# Erick — Portfolio (Next.js static export)

Minimal starter to deploy on Cloudflare Pages without local installs.

## Scripts
- `npm run dev` — local dev (optional)
- `npm run build` — builds to `out/` for static export

## Notes
- `next.config.mjs` sets `output: 'export'` and disables the image optimizer.
- Use `/public/images/*` for assets.
