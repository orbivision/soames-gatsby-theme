import React from "react";
import { graphql, useStaticQuery } from "gatsby";

interface LogoProps {
  title: string;
}

interface LogoQueryData {
  wpMediaItem: {
    title: string;
    guid: string;
  } | null;
}

const Logo: React.FC<LogoProps> = ({ title }) => {
  const data = useStaticQuery<LogoQueryData>(graphql`
    query LogoQuery {
      wpMediaItem(title: { eq: "logo" }) {
        title
        guid
      }
    }
  `);

  const logo = data.wpMediaItem;

  return (
    <div className="menu-logo">
      <div className="navbar-brand">
        <span className="navbar-caption-wrap">
          <a className="navbar-caption text-white display-5" href="/">
            {logo ? (
              <img width="108" alt={logo.title} src={logo.guid} />
            ) : (
              <img
                width="108"
                alt="Orbi Software"
                src="https://orbivision.net/wp-content/uploads/2023/01/punch_card.png"
              />
            )}
            &nbsp;&nbsp;{title}
          </a>
        </span>
      </div>
    </div>
  );
};

export default Logo;
