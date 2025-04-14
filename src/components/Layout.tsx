import React, { ReactNode } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet";

import Header from "./Header";
import Footer from "./Footer";

import "../styles/theme.css";

type LayoutProps = {
  isHomePage?: boolean;
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ isHomePage = false, children }) => {
  const {
    wp: {
      generalSettings: { title },
    },
    wpMediaItem,
  } = useStaticQuery(graphql`
    query LayoutQuery {
      wp {
        generalSettings {
          title
          description
        }
      }
      wpMediaItem(title: { eq: "favicon" }) {
        title
        guid
      }
    }
  `);

  return (
    <div className="global-wrapper" data-is-root-path={isHomePage}>
      <Helmet>
        {wpMediaItem && (
          <link
            rel="icon"
            href={wpMediaItem.guid}
            type="image/png"
          />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&display=swap"
        />
      </Helmet>
      <main>
        <Header title={title} isHomePage={isHomePage} />
        {children}
        <Footer title={title} />
      </main>
    </div>
  );
};

export default Layout;
