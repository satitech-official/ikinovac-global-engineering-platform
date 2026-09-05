<div align="center">

# IKINOVAC GLOBAL

### Engineering Solutions. Global Impact.

A premium industrial engineering and procurement platform for product discovery, global sourcing, technical coordination, and RFQ-led project supply.

<br />

[![OPEN LIVE PROJECT](https://img.shields.io/badge/OPEN%20LIVE%20PROJECT-E7B43A?style=for-the-badge&logo=googlechrome&logoColor=061224)](https://satitech-official.github.io/ikinovac-global-engineering-platform/)

[![VIEW SOURCE](https://img.shields.io/badge/VIEW%20SOURCE-081B33?style=for-the-badge&logo=github&logoColor=white)](https://github.com/satitech-official/ikinovac-global-engineering-platform)

<br /><br />

<a href="https://satitech-official.github.io/ikinovac-global-engineering-platform/">
  <img src="https://raw.githubusercontent.com/satitech-official/ikinovac-global-engineering-platform/main/public/og.png" alt="IKINOVAC Global industrial engineering platform preview" width="100%" />
</a>

### [▶ Click here to run the live project](https://satitech-official.github.io/ikinovac-global-engineering-platform/)

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

**Live URL:** [satitech-official.github.io/ikinovac-global-engineering-platform](https://satitech-official.github.io/ikinovac-global-engineering-platform/)

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
