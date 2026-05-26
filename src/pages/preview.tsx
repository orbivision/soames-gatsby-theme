import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import HeroHeader from "../components/HeroHeader";
import { Shortcodes } from "../utils/shortcodes/Shortcodes";

interface FeaturedImage {
  sourceUrl?: string;
  altText?: string;
}

interface PreviewContent {
  type: string;
  title?: string;
  content?: string;
  excerpt?: string;
  date?: string;
  featuredImage?: FeaturedImage | null;
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

  const backgroundImage = content.featuredImage?.sourceUrl ?? null;
  const backgroundImageTitle = content.title ?? null;

  return (
    <Layout>
      <Seo title={`Preview: ${content.title ?? ""}`} />
      <HeroHeader
        title={content.title ? parse(content.title) : "Preview"}
        subhead={content.excerpt ? parse(content.excerpt) : ""}
        backgroundImage={backgroundImage}
        backgroundImageTitle={backgroundImageTitle}
      />
      {content.type === "post" ? (
        <section>
          <div className="media-container-row">
            <div className="col-12 col-lg-8">
              <section
                id="soames-gatsby-content-container"
                className="soames-gatsby-blog-content"
              >
                <article className="blog-post">
                  <header>
                    <h1>{content.title ? parse(content.title) : ""}</h1>
                    {content.date && <p>{content.date}</p>}
                  </header>
                  {content.content && (
                    <section className="blog-post-content">
                      {parse(content.content)}
                    </section>
                  )}
                </article>
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
