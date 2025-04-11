# Soames Gatsby Theme

[![npm version](https://img.shields.io/npm/v/soames-gatsby-theme.svg?style=flat-square)](https://www.npmjs.com/package/soames-gatsby-theme)
[![license](https://img.shields.io/npm/l/soames-gatsby-theme.svg?style=flat-square)](./LICENSE)

A customizable Gatsby theme for building personal websites using WordPress as a headless CMS. Built with TypeScript for better DX and safety.

## Install Instructions

npm install soames-gatsby-theme

## Known Security Notices

During installation, you may encounter audit warnings for two high-severity vulnerabilities related to the cookie and path-to-regexp packages. These packages are used internally by Gatsby’s development tooling, specifically:

cookie is included via express and socket.io, which Gatsby uses for its hot-reloading dev server.

path-to-regexp is also included by express and only used during local development.

These dependencies are not included in the production build of your site. Gatsby generates static HTML, CSS, and JS files that do not use these server-side tools.

As of this version, these issues do not pose a risk to end users or affect the final deployed site. They will be resolved in future versions as Gatsby and its related plugins are updated.

You can safely ignore these warnings unless you're modifying or redistributing the Gatsby development server code itself.