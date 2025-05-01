import React from "react";
import { graphql, PageProps } from "gatsby";
import parse from "html-react-parser";

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import HeroHeader from "../components/HeroHeader";
import { Shortcodes } from "../utils/shortcodes/Shortcodes";

// Gutenberg block styles
import "../styles/vendor/wordpress-blocks.css";

type PageTemplateProps = PageProps<{
  page: {
    id: string;
    title: string;
    excerpt?: string;
    content?: string;
    featuredImage?: {
      node: {
        title: string;
        guid: string;
      };
    };
  };
}>;

const Page: React.FC<PageTemplateProps> = ({ data: { page } }) => (
  <Layout>
    <Seo title={page.title} />
    <HeroHeader
      title={parse(page.title)}
      subhead={page.excerpt ? parse(page.excerpt) : ""}
      backgroundImage={page.featuredImage?.node.guid || null}
      backgroundImageTitle={page.featuredImage?.node.title || null}
    />
    {page.content && (
      <section
        id="soames-gatsby-content-container"
        className="soames-gatsby-content"
      >
        <Shortcodes>{page.content}</Shortcodes>
      </section>
    )}
  </Layout>
);

export default Page;

export const pageQuery = graphql`
  query PageById($id: String!) {
    page: wpPage(id: { eq: $id }) {
      id
      title
      excerpt
      content
      featuredImage {
        node {
          title
          guid
        }
      }
    }
  }
`;
