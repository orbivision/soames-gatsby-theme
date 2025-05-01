// src/components/BlogSidebar.tsx

import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import parse from "html-react-parser";

interface FeaturedImage {
  node: {
    guid: string;
  };
}

interface PostNode {
  id: string;
  excerpt: string;
  uri: string;
  date: string;
  title: string;
  featuredImage?: FeaturedImage;
}

interface SidebarPostArchiveData {
  posts: {
    nodes: PostNode[];
  };
}

interface BlogSidebarProps {
  postId: string;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ postId }) => {
  const data = useStaticQuery<SidebarPostArchiveData>(graphql`
    query SidebarPostArchive {
      posts: allWpPost(sort: { date: DESC }) {
        nodes {
          id
          excerpt
          uri
          date(formatString: "MMMM DD, YYYY")
          title
          featuredImage {
            node {
              guid
            }
          }
        }
      }
    }
  `);

  return (
    <section className="soames-blog-roll pt-3">
      <div className="container">
        {data.posts.nodes.map((post, index) =>
          post.id !== postId ? (
            <div key={index} className="media-container-row">
              <div className="card p-3 col-12">
                <div className="card-wrapper">
                  <div className="card-box">
                    <h4 className="card-title mbr-fonts-style display-5">
                      {parse(post.title)}
                    </h4>
                    <h4 className="mbr-fonts-style display-7">{post.date}</h4>
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
            </div>
          ) : null
        )}
      </div>
    </section>
  );
};

export default BlogSidebar;
