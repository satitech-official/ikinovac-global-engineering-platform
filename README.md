<div align="center">

# IKINOVAC GLOBAL

### Engineering Solutions. Global Impact.

A global industrial sourcing, engineering procurement and project supply platform for valves, automation, piping, instrumentation, rotating equipment, MRO and international RFQ-led requirements.

<br />

[![OPEN LIVE PROJECT](https://img.shields.io/badge/OPEN%20LIVE%20PROJECT-E7B43A?style=for-the-badge&logo=googlechrome&logoColor=061224)](https://www.ikinovac.com/)

[![VIEW SOURCE](https://img.shields.io/badge/VIEW%20SOURCE-081B33?style=for-the-badge&logo=github&logoColor=white)](https://github.com/satitech-official/ikinovac-global-engineering-platform)

<br /><br />

<a href="https://www.ikinovac.com/">
  <img src="https://raw.githubusercontent.com/satitech-official/ikinovac-global-engineering-platform/main/public/og.png" alt="IKINOVAC Global industrial engineering platform preview" width="100%" />
</a>

### [▶ Click here to run the live project](https://www.ikinovac.com/)

</div>

---

## Platform highlights

- Responsive premium industrial design for desktop, tablet, and mobile
- Product catalogue with category and individual product discovery, plus direct B2B RFQ enquiries
- Individual product catalogues with print / Save as PDF support
- Global supply network, business verticals, quality, services, and resource experiences
- Product search, filters, availability guidance, and technical enquiry support
- Motion-led UI with accessibility-aware interaction patterns

## Technology

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=061224" alt="React 19" />
  <img src="https://img.shields.io/badge/Next.js-15-081B33?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/RFQ%20PDF-pdf--lib-E7B43A?style=flat-square" alt="RFQ PDF generation" />
  <img src="https://img.shields.io/badge/GitHub%20Pages-Live-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Pages" />
</p>

## Live deployment

The project is published from the `main` branch through GitHub Actions.

**Live URL:** [www.ikinovac.com](https://www.ikinovac.com/)

## Google Analytics 4 (GA4) — free visitor analytics

The Next.js root layout already loads Google's `gtag.js` only when a valid
`NEXT_PUBLIC_GA_ID` (web measurement ID, beginning `G-`) is provided to the
production build. RFQ opening and successful lead submissions also emit
`rfq_open` and `generate_lead` events when tracking is active.

To enable tracking on **www.ikinovac.com** without modifying the design:

1. In [Google Analytics](https://analytics.google.com/), choose the IKINOVAC GA4
   property. Under **Admin → Data streams → Web**, select the stream whose
   website URL is `https://www.ikinovac.com/`. Copy its **Measurement ID**
   (`G-XXXXXXXXXX`), not the numeric GA4 property ID.
2. In this repository open **Settings → Secrets and variables → Actions →
   Variables → New repository variable** and create:
   `NEXT_PUBLIC_GA_ID` = the GA4 web Measurement ID.
3. Re-run **Deploy to GitHub Pages** or push an approved change to `main`.
   The workflow sends the public Measurement ID to the static production build
   and checks that it follows the `G-...` format.
4. Visit `https://www.ikinovac.com/?utm_source=ga4_test&utm_medium=manual&utm_campaign=tracking_check`
   from a normal browser with analytics blocking disabled. Check **GA4 →
   Reports → Realtime** or **Admin → DebugView** (with debug mode enabled).
   Realtime reporting can take a few minutes and depends on consent/blockers.
5. Confirm `page_view` and, by actually initiating an enquiry, `rfq_open`.
   Do **not** submit a test customer RFQ solely to inflate real business leads.
   Check that the traffic source is `ga4_test / manual`.

**Important:** Connecting Google Search Console is not the same as installing
GA4; Search Console clicks and GA4 site visits are different metrics.
The Measurement ID is a public client-side identifier, not a service-account key.
No GA4 API key or authentication token belongs in this repository.
For international traffic, provide an appropriate privacy notice and obtain
any consent required by applicable law before collecting analytics data.

## Secure RFQ email delivery

The website creates a branded PDF only after its secure RFQ email endpoint confirms receipt. GitHub Pages is static, so the endpoint is deliberately deployed separately and keeps all mail credentials server-side. See [rfq-service/README.md](rfq-service/README.md) for the Cloudflare Worker and Resend configuration. Set only the public endpoint URL as `NEXT_PUBLIC_IKINOVAC_RFQ_ENDPOINT` in the GitHub Pages build environment; never commit a mail key.

## Run locally

```bash
git clone https://github.com/satitech-official/ikinovac-global-engineering-platform.git
cd ikinovac-global-engineering-platform
npm install
npm run dev
```

## Project structure

```text
app/                 Site pages and catalogue routes
components/          Reusable UI and catalogue components
data/                Product catalogue content
public/              Brand, industrial, and social-preview assets
rfq-service/         Secure serverless RFQ email endpoint
.github/workflows/   GitHub Pages deployment workflow
```

<div align="center">

**IKINOVAC GLOBAL — Engineering • Procurement • Industrial Solutions • Global Sourcing**

</div>
