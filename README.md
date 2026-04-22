# Reacon Static HTML Export

This folder contains rendered static HTML exported from the local WordPress site.

- `index.html` is the homepage.
- Each WordPress URL is exported as `slug/index.html`.
- `assets/` contains copied local WordPress theme, plugin, upload, and wp-includes files referenced by the exported HTML.
- `manifest.json` maps source WordPress URLs to generated static files.

ACF option pages do not have public frontend URLs. Their content is included wherever it renders publicly, such as header, footer, page templates, and archive templates.

External CDN URLs are intentionally left as external URLs.