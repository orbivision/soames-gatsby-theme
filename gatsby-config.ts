import type { GatsbyConfig } from 'gatsby';

interface ThemeOptions {
  url?: string;
}

const themeConfig = (themeOptions: ThemeOptions = {}): GatsbyConfig => {
  const url = themeOptions.url || process.env.GATSBY_WORDPRESS_URL;

  if (!url) {
    throw new Error("The WordPress GraphQL 'url' is required in theme options or .env.");
  }

  return {
    siteMetadata: {
      title: 'Soames Gatsby Theme',
    },
    plugins: [
      {
        resolve: 'gatsby-source-wordpress',
        options: {
          url,
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `assets`,
          path: `${__dirname}/content/assets`,
        },
      },
      `gatsby-plugin-image`,
      `gatsby-plugin-sharp`,
      `gatsby-transformer-sharp`,
      {
        // See https://www.gatsbyjs.com/plugins/gatsby-plugin-manifest/?=gatsby-plugin-manifest
        resolve: `gatsby-plugin-manifest`,
        options: {
          name: `Gatsby Starter WordPress Blog`,
          short_name: `GatsbyJS & WP`,
          start_url: `/`,
          background_color: `#ffffff`,
          theme_color: `#663399`,
          display: `minimal-ui`,
          icon: `content/assets/gatsby-icon.png`,
        },
      },

      // See https://www.gatsbyjs.com/plugins/gatsby-plugin-react-helmet/?=gatsby-plugin-react-helmet
      `gatsby-plugin-react-helmet`,
    ],
  };
};

export default themeConfig;
