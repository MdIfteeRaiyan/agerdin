# Deploy Agerdin

## Vercel

1. Push the project folder to the connected GitHub repository on its deployment branch.
2. In Vercel, import the repository or redeploy the connected project.
3. Use the project root as the static output; no build command is required.
4. Confirm `/`, `/404.html`, `/og-image.png`, `/robots.txt`, and `/sitemap.xml` load after deployment.

## Netlify

The deployment ZIP is flattened: extract its contents into the project root or deploy the extracted folder directly. For a Git-connected deployment, choose the project root as the static output and use no build command.

## Before enabling memory submissions

Replace `AGERDIN_FORM_SUBMIT_ALIAS` in the memory form endpoint with the alias generated and confirmed by the FormSubmit account owner. Until then, the form reports that submissions are unavailable and does not send visitor data.

The deployment package includes `index.html`, `404.html`, `css/`, `js/`, `data/`, image assets, the favicon, service worker, manifest, and SEO files at the root level.
