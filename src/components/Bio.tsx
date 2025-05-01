// src/components/Bio.tsx

import React from "react";
import { useStaticQuery, graphql } from "gatsby";

interface Author {
  firstName: string;
  name: string; // Used as Twitter handle
  description: string;
  avatar?: {
    url: string;
  };
}

interface BioQueryData {
  author: Author;
}

const Bio: React.FC = () => {
  const data = useStaticQuery<BioQueryData>(graphql`
    query BioQuery {
      author: wpUser {
        firstName
        name
        description
        avatar {
          url
        }
      }
    }
  `);

  const { author } = data;
  const avatarUrl = author?.avatar?.url;
  const twitterHandle = author?.name;

  return (
    <div className="bio">
      {avatarUrl && (
        <img
          alt={author.firstName}
          className="bio-avatar"
          src={avatarUrl}
        />
      )}
      {author.firstName && (
        <p>
          Written by <strong>{author.firstName}</strong>
          {` `}
          {author.description}
          {` `}
          {twitterHandle && (
            <a href={`https://twitter.com/${twitterHandle}`}>
              You should follow them on Twitter
            </a>
          )}
        </p>
      )}
    </div>
  );
};

export default Bio;
