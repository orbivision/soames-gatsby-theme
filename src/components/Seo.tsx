import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

interface SeoProps {
  title: string;
  description?: string;
  lang?: string;
  meta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

const Seo: React.FC<SeoProps> = ({
  title,
  description = "",
  lang = "en",
  meta = [],
}) => {
  const { wp, wpUser } = useStaticQuery(graphql`
    query {
      wp {
        generalSettings {
          title
          description
        }
      }
      wpUser {
        name
      }
    }
  `);

  const metaDescription = description || wp.generalSettings?.description;
  const defaultTitle = wp.generalSettings?.title;
  const twitterHandle = wpUser?.name || "";

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : undefined}
      meta={[
        {
          name: "description",
          content: metaDescription,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: metaDescription,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "twitter:creator",
          content: twitterHandle,
        },
        {
          name: "twitter:title",
          content: title,
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
        ...meta,
      ]}
    />
  );
};

export default Seo;
