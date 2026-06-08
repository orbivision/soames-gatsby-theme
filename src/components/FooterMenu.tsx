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

interface MenuNode {
  locations: string[];
  menuItems: {
    nodes: MenuItem[];
  };
}

interface FooterMenuData {
  menus: {
    nodes: MenuNode[];
  };
}

const FooterMenu: React.FC = () => {
  const data: FooterMenuData = useStaticQuery(graphql`
    query WpFooterMenu {
      menus {
        nodes {
          locations
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
    }
  `);

  const menu = data.menus?.nodes.find(m => m.locations?.includes("FOOTER"));
  const items = (menu?.menuItems?.nodes ?? []).filter(item => item.parentDatabaseId === 0);

  if (items.length === 0) return null;

  return (
    <>
      <h5 className="pb-3">Links</h5>
      <ul>
        {items.map(item =>
          item.uri.includes("http") ? (
            <li className="soames-footer-list-item" key={item.id}>
              <a href={item.uri} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            </li>
          ) : (
            <li className="soames-footer-list-item" key={item.id}>
              <Link to={item.uri}>{item.label}</Link>
            </li>
          )
        )}
      </ul>
    </>
  );
};

export default FooterMenu;
