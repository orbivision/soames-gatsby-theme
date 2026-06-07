const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

// Fetch Soames settings from the WordPress REST API and create a SoamesSettings
// node. gatsby-source-wordpress does not surface custom WPGraphQL fields added
// to GeneralSettings, so we use a dedicated REST endpoint instead.
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, themeOptions) => {
  const { createNode } = actions;

  const wpGraphqlUrl = themeOptions.url || process.env.GATSBY_WORDPRESS_URL || '';
  const wpBaseUrl = wpGraphqlUrl.replace(/\/graphql\/?$/, '');

  let settings = { logoUrl: null, logoAlt: null, faviconUrl: null, contactBlurb: null };

  if (wpBaseUrl) {
    try {
      const response = await fetch(`${wpBaseUrl}/wp-json/soames/v1/settings`);
      if (response.ok) {
        settings = await response.json();
      }
    } catch (e) {
      console.warn('[Soames] Could not fetch settings from WordPress:', e.message);
    }
  }

  createNode({
    logoUrl:      settings.logoUrl      ?? null,
    logoAlt:      settings.logoAlt      ?? null,
    faviconUrl:   settings.faviconUrl   ?? null,
    contactBlurb: settings.contactBlurb ?? null,
    id: createNodeId('soames-settings'),
    internal: {
      type: 'SoamesSettings',
      contentDigest: createContentDigest(JSON.stringify(settings)),
    },
  });
};

exports.createResolvers = ({ actions, cache, createNodeId, createResolvers, store, reporter }) => {
  const { createNode } = actions;
  createResolvers({
    WpMediaItem: {
      localFile: {
        type: `File`,
        resolve(source) {
          return createRemoteFileNode({
            url: source.sourceUrl,
            store,
            cache,
            createNode,
            createNodeId,
            reporter,
          });
        },
      },
    },
  });
};

const path = require('path');
const { chunk } = require('lodash');

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions;

  // Fetch posts
  const postsResult = await graphql(`
    query WpPosts {
      allWpPost(sort: { date: DESC }) {
        edges {
          previous {
            id
          }
          node {
            id
            uri
          }
          next {
            id
          }
        }
      }
    }
  `);

  if (postsResult.errors) {
    reporter.panicOnBuild('Error loading blog posts', postsResult.errors);
    return;
  }

  const postEdges = postsResult.data.allWpPost.edges;

  // Fetch pages
  const pagesResult = await graphql(`
    query WpPages {
      allWpPage {
        edges {
          node {
            id
            uri
            title
          }
        }
      }
    }
  `);

  if (pagesResult.errors) {
    reporter.panicOnBuild('Error loading pages', pagesResult.errors);
    return;
  }

  const pageEdges = pagesResult.data.allWpPage.edges;

  // Create individual blog post pages
  postEdges.forEach(({ previous, node, next }) => {
    createPage({
      path: `/blog${node.uri}`,
      component: path.resolve(__dirname, 'src/templates/blog-post.tsx'),
      context: {
        id: node.id,
        previousPostId: previous ? previous.id : null,
        nextPostId: next ? next.id : null,
      },
    });
    // Redirect WordPress "View Post" permalink to the Gatsby /blog/ path.
    // WordPress generates view links using node.uri (e.g. /2024/01/my-post/)
    // but Gatsby serves posts at /blog/2024/01/my-post/.
    createRedirect({
      fromPath: node.uri,
      toPath: `/blog${node.uri}`,
      isPermanent: false,
    });
  });

  // Create blog post archive pages
  const readingSettingsResult = await graphql(`
    {
      wp {
        readingSettings {
          postsPerPage
        }
      }
    }
  `);

  if (readingSettingsResult.errors) {
    reporter.panicOnBuild('Error loading reading settings', readingSettingsResult.errors);
    return;
  }

  const postsPerPage = readingSettingsResult.data.wp.readingSettings.postsPerPage;
  const postsChunkedIntoArchivePages = chunk(postEdges, postsPerPage);
  const totalPages = postsChunkedIntoArchivePages.length;

  postsChunkedIntoArchivePages.forEach((_, index) => {
    const pageNumber = index + 1;
    const pathSuffix = pageNumber === 1 ? '' : `/${pageNumber}`;
    createPage({
      path: `/blog${pathSuffix}`,
      component: path.resolve(__dirname, 'src/templates/blog-post-archive.tsx'),
      context: {
        offset: index * postsPerPage,
        postsPerPage,
        nextPagePath: pageNumber < totalPages ? `/blog/${pageNumber + 1}` : null,
        previousPagePath: pageNumber > 1 ? `/blog/${pageNumber - 1}` : null,
      },
    });
  });

  // Create individual pages
  pageEdges.forEach(({ node }) => {
    createPage({
      path: node.uri || '/soames-blog-archive/',
      component: path.resolve(__dirname, 'src/templates/page.tsx'),
      context: {
        id: node.id,
        title: node.title,
      },
    });
  });
};
