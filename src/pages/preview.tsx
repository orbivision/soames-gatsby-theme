import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import HeroHeader from "../components/HeroHeader";
import Bio from "../components/Bio";
import BlogSidebar from "../components/BlogSidebar";
import { Shortcodes } from "../utils/shortcodes/Shortcodes";
import "../styles/vendor/wordpress-blocks.css";

interface FeaturedImage {
  sourceUrl?: string;
  altText?: string;
}

interface BlogHero {
  title?: string | null;
  excerpt?: string | null;
  guid?: string | null;
  overlayOpacity?: string | null;
}

interface PreviewContent {
  type: string;
  title?: string;
  content?: string;
  excerpt?: string;
  date?: string;
  overlayOpacity?: string | null;
  featuredImage?: FeaturedImage | null;
  blogHero?: BlogHero | null;
}

const PreviewPage: React.FC = () => {
  const [content, setContent] = useState<PreviewContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError(
        "No preview token provided. Please use the Preview button in WordPress admin."
      );
      setLoading(false);
      return;
    }

    const wpUrl = process.env.GATSBY_WORDPRESS_URL;
    if (!wpUrl) {
      setError("WordPress URL is not configured.");
      setLoading(false);
      return;
    }

    const wpOrigin = new URL(wpUrl).origin;
    const endpoint = `${wpOrigin}/wp-json/soames/v1/preview?token=${encodeURIComponent(token)}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          setError(data.message ?? "Could not load preview content.");
        } else {
          setContent(data as PreviewContent);
        }
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(`Failed to connect to WordPress: ${err.message}`);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout>
        <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <p>Loading preview&hellip;</p>
        </section>
      </Layout>
    );
  }

  if (error || !content) {
    return (
      <Layout>
        <Seo title="Preview Unavailable" />
        <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h2>Preview Unavailable</h2>
          <p>{error ?? "No preview content found."}</p>
        </section>
      </Layout>
    );
  }

  const isPost = content.type === "post";

  // For posts, HeroHeader mirrors the Blog archive page hero (matching blog-post.tsx).
  // For pages, use the page's own title and featured image (matching page.tsx).
  const heroTitle = isPost
    ? (content.blogHero?.title ? parse(content.blogHero.title) : "Blog")
    : (content.title ? parse(content.title) : "Preview");
  const heroSubhead = isPost
    ? (content.blogHero?.excerpt ? parse(content.blogHero.excerpt) : "")
    : (content.excerpt ? parse(content.excerpt) : "");
  const heroBg = isPost
    ? (content.blogHero?.guid ?? null)
    : (content.featuredImage?.sourceUrl ?? null);
  const heroOpacityStr = isPost
    ? (content.blogHero?.overlayOpacity ?? null)
    : (content.overlayOpacity ?? null);

  return (
    <Layout>
      <Seo title={`Preview: ${content.title ?? ""}`} />
      <HeroHeader
        title={heroTitle}
        subhead={heroSubhead}
        backgroundImage={heroBg}
        overlayOpacity={heroOpacityStr ? parseFloat(heroOpacityStr) : undefined}
      />
      {isPost ? (
        <section>
          <div className="media-container-row">
            <div className="col-12 col-lg-8">
              <section
                id="soames-gatsby-content-container"
                className="soames-gatsby-blog-content"
              >
                <article
                  className="blog-post"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h1 itemProp="headline">
                      {content.title ? parse(content.title) : ""}
                    </h1>
                    {content.date && <p>{content.date}</p>}
                  </header>
                  {content.content && (
                    <section
                      itemProp="articleBody"
                      className="blog-post-content"
                    >
                      {parse(content.content)}
                    </section>
                  )}
                  <hr />
                  <footer>
                    <Bio />
                  </footer>
                </article>
              </section>
            </div>
            <div className="col-12 col-lg-4">
              <section
                id="soames-gatsby-sidebar-container"
                className="soames-gatsby-sidebar"
              >
                {content.featuredImage?.sourceUrl && (
                  <img
                    src={content.featuredImage.sourceUrl}
                    alt={content.featuredImage.altText || ""}
                    style={{ marginBottom: 50, width: "100%" }}
                  />
                )}
                <h1>Recent Posts</h1>
                <BlogSidebar postId="" />
              </section>
            </div>
          </div>
        </section>
      ) : (
        content.content && (
          <section
            id="soames-gatsby-content-container"
            className="soames-gatsby-content"
          >
            <Shortcodes>{content.content}</Shortcodes>
          </section>
        )
      )}
    </Layout>
  );
};

export default PreviewPage;
