<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Soames Gatsby Theme
</h1>

[![npm version](https://img.shields.io/npm/v/soames-gatsby-theme.svg?style=flat-square)](https://www.npmjs.com/package/soames-gatsby-theme)
[![license](https://img.shields.io/npm/l/soames-gatsby-theme.svg?style=flat-square)](./LICENSE)

A customizable Gatsby theme for building personal websites using WordPress as a headless CMS. Built with TypeScript for better DX and safety.

## Install Instructions

npm install soames-gatsby-theme

## WordPress Preview Setup

Soames supports previewing draft posts and pages directly from the WordPress admin, and fixes the "View Post" / "View Page" links that would otherwise land on the home page.

### Requirements

1. **WP Gatsby plugin** — install [WP Gatsby](https://wordpress.org/plugins/wp-gatsby/) on your WordPress backend. This plugin intercepts the Preview button and redirects to the Gatsby `/preview/` page with a short-lived auth token.
2. **WPGraphQL** — already required by `gatsby-source-wordpress`, so this should already be active.

### WP Gatsby configuration

In the WP Gatsby settings in WordPress admin:
- **Frontend URL** — set to your Gatsby site's public URL (e.g. `https://yoursite.com`)

That's it. WP Gatsby will redirect Preview clicks to `https://yoursite.com/preview/?id=<id>&type=<post|page>&token=<token>`. The Soames theme handles the rest.

### How it works

- **Preview** — the `/preview/` page fetches draft content from the WordPress GraphQL endpoint using the token supplied by WP Gatsby, then renders it using the same layout as the published version.
- **View Post** — a redirect is generated at build time from the WordPress permalink (e.g. `/2024/01/my-post/`) to the Gatsby blog path (e.g. `/blog/2024/01/my-post/`).
- **View Page** — WordPress pages are already served at their WordPress URI, so no redirect is needed.

Preview requires the editor to be logged into WordPress in the same browser session. The token expires shortly after being generated; if the preview page shows an error, click Preview again in WordPress admin.

---

## Known Security Notices

After installation, `npm audit` will report a number of vulnerabilities. All remaining issues fall into two categories:

**Gatsby dev-server tooling** — packages used only during local development (`gatsby develop`) and not included in the production static build:

- `cookie`, `path-to-regexp` — used by express and socket.io for Gatsby’s hot-reloading dev server
- `@parcel/reporter-dev-server` — Gatsby’s internal build tooling
- `webpack`, `serialize-javascript` — bundler used at build time, not present in the output
- `tmp` — used by CLI tooling (inquirer) internal to Gatsby’s dependency tree

**Build-time data-fetching dependencies** — packages used to pull content from WordPress at build time and not included in the deployed site:

- `showdown` — pulled in by `@wordpress/blocks` for block rendering; no upstream fix available as of this version
- `file-type`, `uuid` — used by `gatsby-source-wordpress` for media processing and internal queuing

Gatsby generates static HTML, CSS, and JS files. None of the packages above are included in your deployed site or exposed to end users.

These issues cannot be resolved without breaking changes to core Gatsby dependencies and will be addressed in future versions as Gatsby and its plugins are updated. You can safely ignore these warnings unless you are modifying or redistributing the Gatsby development tooling itself.