import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import HeroHeader from "../components/HeroHeader";
import { Shortcodes } from "../utils/shortcodes/Shortcodes";

interface FeaturedImage {
  node: {
    sourceUrl?: string;
    altText?: string;
  };
}

interface PreviewContent {
  title?: string;
  content?: string;
  excerpt?: string;
  date?: string;
  featuredImage?: FeaturedImage | null;
}

const POST_PREVIEW_QUERY = `
  query PreviewPost($id: ID!) {
    post(id: $id, idType: DATABASE_ID, asPreview: true) {
      title
      content
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

const PAGE_PREVIEW_QUERY = `
  query PreviewPage($id: ID!) {
    page(id: $id, idType: DATABASE_ID, asPreview: true) {
      title
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

const PreviewPage: React.FC = () => {
  const [content, setContent] = useState<PreviewContent | null>(null);
  const [contentType, setContentType] = useState<string>("post");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const type = (params.get("type") || "post").toLowerCase();
    const token = params.get("token");

    setContentType(type);

    if (!id) {
      setError(
        "No preview ID provided. Please use the Preview button in WordPress admin."
      );
      setLoading(false);
      return;
    }

    const wpGraphQLUrl = process.env.GATSBY_WORDPRESS_URL;
    if (!wpGraphQLUrl) {
      setError("WordPress URL is not configured.");
      setLoading(false);
      return;
    }

    const query = type === "page" ? PAGE_PREVIEW_QUERY : POST_PREVIEW_QUERY;

    fetch(wpGraphQLUrl, {
      method: "POST",
      credentials: token ? "omit" : "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query, variables: { id } }),
    })
      .then((res) => res.json())
      .then((data) => {
        const node = data?.data?.post ?? data?.data?.page ?? null;
        if (!node) {
          const firstError: string | undefined = data?.errors?.[0]?.message;
          if (
            firstError &&
            (firstError.toLowerCase().includes("forbidden") ||
              firstError.toLowerCase().includes("authorization"))
          ) {
            setError(
              "Preview token expired or invalid. Please click Preview again from WordPress admin."
            );
          } else {
            setError(
              firstError
                ? `Could not load preview: ${firstError}`
                : "Could not load preview content. The post or page may not exist."
            );
          }
        } else {
          setContent(node as PreviewContent);
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

  const backgroundImage = content.featuredImage?.node?.sourceUrl ?? null;
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
      {contentType === "post" ? (
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
