const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

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
  const { createPage } = actions;

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
