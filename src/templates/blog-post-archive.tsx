import React from "react";
import { Link, graphql, PageProps } from "gatsby";
import parse from "html-react-parser";

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import HeroHeader from "../components/HeroHeader";

interface PostNode {
  excerpt: string;
  uri: string;
  date: string;
  title: string;
  featuredImage?: {
    node: {
      guid: string;
      title: string;
    };
  };
}

interface ArchivePage {
  title: string;
  excerpt: string;
  featuredImage?: {
    node: {
      guid: string;
      title: string;
    };
  };
}

interface BlogPostArchiveProps extends PageProps<{
  allWpPost: {
    nodes: PostNode[];
  };
  wpPage: ArchivePage;
}, {
  nextPagePath?: string;
  previousPagePath?: string;
}> {}

const BlogIndex: React.FC<BlogPostArchiveProps> = ({ data, pageContext }) => {
  const posts = data.allWpPost.nodes;
  const archive = data.wpPage;
  const { nextPagePath, previousPagePath } = pageContext;

  if (!posts.length) {
    return (
      <Layout>
        <Seo title="All posts" />
        <HeroHeader
          title={archive.title ? parse(archive.title) : "Blog"}
          subhead={archive.excerpt ? parse(archive.excerpt) : ""}
          backgroundImage={archive.featuredImage?.node.guid || null}
          backgroundImageTitle={archive.featuredImage?.node.title || null}
        />
        <p>
          No blog posts found. Add posts to your WordPress site and they'll appear here!
        </p>
      </Layout>
    );
  }

  const groupedPosts = posts.reduce<PostNode[][]>((groups, post, index) => {
    if (index % 3 === 0) {
      groups.push([post]);
    } else {
      groups[groups.length - 1].push(post);
    }
    return groups;
  }, []);

  return (
    <Layout isHomePage>
      <Seo title="All posts" />
      <HeroHeader
        title={archive.title ? parse(archive.title) : "Blog"}
        subhead={archive.excerpt ? parse(archive.excerpt) : ""}
        backgroundImage={archive.featuredImage?.node.guid || null}
        backgroundImageTitle={archive.featuredImage?.node.title || null}
      />

      <section className="soames-blog-roll">
        <div className="container">
          {groupedPosts.map((group, index) => (
            <div key={index} className="media-container-row">
              {group.map((post, idx) => (
                <div key={idx} className="card p-3 col-12 col-lg-4">
                  <div className="card-wrapper">
                    {/* Uncomment and adjust the following block if featured images are to be displayed */}
                    {/* {post.featuredImage && (
                      <div className="card-img">
                        <Link to={`/blog${post.uri}`}>
                          <img src={post.featuredImage.node.guid} alt={post.featuredImage.node.title} title={post.featuredImage.node.title} />
                        </Link>
                      </div>
                    )} */}
                    <div className="card-box">
                      <h4 className="card-title mbr-fonts-style display-5">
                        {parse(post.title)}
                      </h4>
                      <h4 className="mbr-fonts-style display-7">
                        {post.date}
                      </h4>
                      {parse(post.excerpt)}
                    </div>
                    <div className="mbr-section-btn text-center">
                      <Link
                        to={`/blog${post.uri}`}
                        itemProp="url"
                        className="btn btn-primary display-4"
                      >
                        <span itemProp="headline">Read More</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section>
        {previousPagePath && (
          <>
            <Link to={`/blog${previousPagePath}`}>Previous page</Link>
            <br />
          </>
        )}
        {nextPagePath && <Link to={`/blog${nextPagePath}`}>Next page</Link>}
      </section>
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query WordPressPostArchive($offset: Int!, $postsPerPage: Int!) {
    allWpPost(sort: { date: DESC }, limit: $postsPerPage, skip: $offset) {
      nodes {
        excerpt
        uri
        date(formatString: "MMMM DD, YYYY")
        title
        featuredImage {
          node {
            guid
            title
          }
        }
      }
    }
    wpPage(isPostsPage: { eq: true }) {
      title
      excerpt
      featuredImage {
        node {
          guid
          title
        }
      }
    }
  }
`;
