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
        companyName
        showCompanyName
      }
    }
  `);

  const logoUrl         = data.soamesSettings?.logoUrl ?? null;
  const logoAlt         = data.soamesSettings?.logoAlt ?? title;
  const displayName     = data.soamesSettings?.companyName || title;
  const showCompanyName = data.soamesSettings?.showCompanyName ?? true;

  return (
    <div className="menu-logo">
      <div className="navbar-brand">
        <span className="navbar-caption-wrap">
          <a className="navbar-caption text-white display-5" href="/">
            {logoUrl && (
              <img width="108" alt={logoAlt} src={logoUrl} />
            )}
            {showCompanyName && <>&nbsp;&nbsp;{displayName}</>}
          </a>
        </span>
      </div>
    </div>
  );
};

export default Logo;
