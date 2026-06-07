import React from "react";
import { graphql, useStaticQuery } from "gatsby";

interface LogoProps {
  title: string;
}

const Logo: React.FC<LogoProps> = ({ title }) => {
  const data = useStaticQuery(graphql`
    query LogoQuery {
      soamesSettings {
        logoUrl
        logoAlt
      }
    }
  `);

  const logoUrl = data.soamesSettings?.logoUrl ?? null;
  const logoAlt = data.soamesSettings?.logoAlt ?? title;

  return (
    <div className="menu-logo">
      <div className="navbar-brand">
        <span className="navbar-caption-wrap">
          <a className="navbar-caption text-white display-5" href="/">
            {logoUrl && (
              <img width="108" alt={logoAlt} src={logoUrl} />
            )}
            &nbsp;&nbsp;{title}
          </a>
        </span>
      </div>
    </div>
  );
};

export default Logo;
