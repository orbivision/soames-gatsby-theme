import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";

interface MenuItem {
  id: string;
  label: string;
  parentDatabaseId: number;
  path: string;
  uri: string;
  order: number;
}

interface FooterMenuData {
  wpMenu: {
    id: string;
    name: string;
    menuItems: {
      nodes: MenuItem[];
    };
  };
}

const FooterMenu: React.FC = () => {
  const data: FooterMenuData = useStaticQuery(graphql`
    query WpFooterMenu {
      wpMenu(name: { eq: "soames-footer-menu" }) {
        id
        name
        menuItems {
          nodes {
            id
            label
            parentDatabaseId
            path
            uri
            order
          }
        }
      }
    }
  `);

  return (
    <div className="soames-footer-content">
      <ul>
        {data.wpMenu.menuItems.nodes.map((item) =>
          item.parentDatabaseId === 0 ? (
            item.uri.includes("http") ? (
              <li key={item.id}>
                <a href={item.uri} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
                <br />
              </li>
            ) : (
              <li key={item.id}>
                <Link to={item.uri}>{item.label}</Link>
                <br />
              </li>
            )
          ) : null
        )}
      </ul>
    </div>
  );
};

export default FooterMenu;
