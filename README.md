# IKINOVAC GLOBAL — Engineering Platform

<p align="center">
  <img src="./public/assets/hero-refinery.png" alt="IKINOVAC GLOBAL industrial engineering platform preview" width="100%" />
</p>

<p align="center">
  <a href="https://satitech-official.github.io/ikinovac-global-engineering-platform/">
    <img src="https://img.shields.io/badge/Live%20Preview-Open%20Website-45E0C1?style=for-the-badge&logo=githubpages&logoColor=0B2732" alt="Open live website" />
  </a>
  <a href="https://github.com/satitech-official/ikinovac-global-engineering-platform">
    <img src="https://img.shields.io/badge/Source%20Code-GitHub-0B2732?style=for-the-badge&logo=github&logoColor=white" alt="View source code" />
  </a>
</p>

Premium, responsive engineering and industrial procurement website for **IKINOVAC GLOBAL**. Built in Next.js and React using JavaScript only—no TypeScript.

## Highlights

- Responsive editorial website with refined motion and industrial visuals
- Locally bundled logo and photography for reliable loading
- Interactive project-flow tabs, product-system selector, RFQ shortlist, and quick navigator
- Functional RFQ form and browser-based operations workspace
- GitHub Pages deployment workflow for automatic live releases from `main`

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Operations workspace

Open [http://localhost:3000/admin](http://localhost:3000/admin).

Demo access:

- Email: `admin@ikinovac.com`
- Password: `admin123`

The current admin console stores demo RFQs in browser storage. Connect a real authentication provider and database before using it as a multi-user production portal.

## Deployment

Every push to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy-pages.yml`. It creates a static Next.js export and publishes it through GitHub Pages.

The public deployment URL is:

**https://satitech-official.github.io/ikinovac-global-engineering-platform/**

