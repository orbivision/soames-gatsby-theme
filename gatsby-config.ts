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
    ],
  };
};

export default themeConfig;
