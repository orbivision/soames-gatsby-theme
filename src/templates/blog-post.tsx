// src/templates/blog-post.tsx

import React from "react";
import { Link, graphql, PageProps } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import parse from "html-react-parser";

import "../styles/vendor/wordpress-blocks.css";

import Bio from "../components/Bio";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import HeroHeader from "../components/HeroHeader";
import BlogSidebar from "../components/BlogSidebar";

interface FeaturedImage {
  node: {
    altText?: string | null;
    gatsbyImage?: IGatsbyImageData;
  };
}

interface Post {
  id: string;
  excerpt?: string | null;
  content?: string | null;
  title?: string | null;
  date?: string | null;
  featuredImage?: FeaturedImage | null;
}

interface Page {
  title?: string | null;
  excerpt?: string | null;
  featuredImage?: {
    node: {
      guid?: string | null;
    };
  } | null;
}

interface PostEdge {
  uri: string;
  title?: string | null;
}

interface BlogPostTemplateProps extends PageProps {
  data: {
    post: Post;
    previous?: PostEdge | null;
    next?: PostEdge | null;
    page?: Page | null;
  };
}

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ data }) => {
  const { post, previous, next, page } = data;

  const featuredImageData = post.featuredImage?.node?.gatsbyImage ?? null;
  const featuredImageAlt = post.featuredImage?.node?.altText || "Featured image";

  return (
    <Layout>
      <Seo title={post.title || ""} description={post.excerpt || undefined} />
      <HeroHeader
        title={page?.title ? parse(page.title) : "Blog"}
        subhead={page?.excerpt ? parse(page.excerpt) : ""}
        backgroundImage={page?.featuredImage?.node?.guid || null}
        backgroundImageTitle={page?.title || null}
      />
      <section>
        <div className="media-container-row">
          <div className="col-12 col-lg-8">
            <section id="soames-gatsby-content-container" className="soames-gatsby-blog-content">
              <article className="blog-post" itemScope itemType="http://schema.org/Article">
                <header>
                  <h1 itemProp="headline">{post.title ? parse(post.title) : ""}</h1>
                  <p>{post.date}</p>
                </header>

                {post.content && (
                  <section itemProp="articleBody" className="blog-post-content">
                    {parse(post.content)}
                  </section>
                )}

                <hr />

                <footer>
                  <Bio />
                </footer>
              </article>

              <nav className="blog-post-nav">
                <ul
                  style={{
                    display: `flex`,
                    flexWrap: `wrap`,
                    justifyContent: `space-between`,
                    listStyle: `none`,
                    padding: 0,
                  }}
                >
                  <li>
                    {previous && (
                      <Link to={`/blog${previous.uri}`} rel="prev">
                        ← {previous.title ? parse(previous.title) : ""}
                      </Link>
                    )}
                  </li>

                  <li>
                    {next && (
                      <Link to={`/blog${next.uri}`} rel="next">
                        {next.title ? parse(next.title) : ""} →
                      </Link>
                    )}
                  </li>
                </ul>
              </nav>
            </section>
          </div>
          <div className="col-12 col-lg-4">
            <section id="soames-gatsby-sidebar-container" className="soames-gatsby-sidebar">
              {featuredImageData && (
                <GatsbyImage
                  image={featuredImageData}
                  alt={featuredImageAlt}
                  style={{ marginBottom: 50 }}
                />
              )}

              <h1>Recent Posts</h1>

              <BlogSidebar postId={post.id} />
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostById($id: String!, $previousPostId: String, $nextPostId: String) {
    post: wpPost(id: { eq: $id }) {
      id
      excerpt
      content
      title
      date(formatString: "MMMM DD, YYYY")
      featuredImage {
        node {
          altText
          gatsbyImage(
            width: 1200
            layout: CONSTRAINED
            placeholder: BLURRED
          )
        }
      }
    }
    previous: wpPost(id: { eq: $previousPostId }) {
      uri
      title
    }
    next: wpPost(id: { eq: $nextPostId }) {
      uri
      title
    }
    page: wpPage(isPostsPage: { eq: true }) {
      title
      excerpt
      featuredImage {
        node {
          guid
        }
      }
    }
  }
`;
