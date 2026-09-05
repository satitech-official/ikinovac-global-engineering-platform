# IKINOVAC RFQ email service

GitHub Pages is static, so it cannot securely send an email with a PDF attachment. This small Cloudflare Worker receives the validated RFQ data and customer-generated PDF, then sends it through Resend without exposing any credential to the browser.

1. Deploy this folder as a Cloudflare Worker using `wrangler.toml.example` as the starting configuration.
2. Set server-only secrets: `RESEND_API_KEY`, `IKINOVAC_RFQ_TO`, and `RFQ_FROM`.
3. Set `ALLOWED_ORIGIN` to the exact deployed website origin.
4. In the GitHub Pages build environment, set the public, non-secret value `NEXT_PUBLIC_IKINOVAC_RFQ_ENDPOINT` to the deployed worker URL ending in `/api/rfq`.

The frontend never shows RFQ success or downloads the final PDF until this endpoint returns success. It does not send email through `mailto`, and it never exposes a mail password or API key.
