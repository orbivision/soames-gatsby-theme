import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";

interface MenuItem {
  id: string;
  label: string;
  parentDatabaseId: number;
  path: string;
  uri: string;
  order: number;
  childItems: {
    nodes: Array<{
      id: string;
      label: string;
      uri: string;
      order: number;
    }>;
  };
}

interface WpMenuQueryData {
  wpMenu: {
    id: string;
    name: string;
    menuItems: {
      nodes: MenuItem[];
    };
  };
}

const HeaderMenu: React.FC = () => {
  const data = useStaticQuery<WpMenuQueryData>(graphql`
    query WpHeaderMenu {
      wpMenu(name: { eq: "soames-header-menu" }) {
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
            childItems {
              nodes {
                id
                label
                uri
                order
              }
            }
          }
        }
      }
    }
  `);

  return (
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav nav-dropdown nav-right" data-app-modern-menu="true">
        {data.wpMenu.menuItems.nodes.map((item) =>
          item.path !== "/home/" && item.parentDatabaseId === 0 ? (
            item.childItems.nodes.length === 0 ? (
              <li key={item.id} className="nav-item">
                {item.uri.includes("http") ? (
                  <a
                    className="nav-link link text-white display-4"
                    href={item.uri}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.uri} className="nav-link link text-white display-4">
                    {item.label}
                  </Link>
                )}
              </li>
            ) : (
              <li key={item.id} className="nav-item dropdown">
                <a
                  className="nav-link link text-white dropdown-toggle display-4"
                  href={item.uri}
                  data-toggle="dropdown-submenu"
                  aria-expanded="false"
                >
                  {item.label}
                </a>
                <div className="dropdown-menu">
                  <ul className="navbar-nav nav-dropdown nav-right">
                    {item.childItems.nodes.map((childItem) => (
                      <li key={childItem.id}>
                        {childItem.uri.includes("http") ? (
                          <a
                            className="text-white dropdown-item display-4"
                            target="_blank"
                            rel="noreferrer"
                            href={childItem.uri}
                          >
                            {childItem.label}
                            <br />
                          </a>
                        ) : (
                          <Link to={childItem.uri} className="text-white dropdown-item display-4">
                            {childItem.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          ) : null
        )}
      </ul>
    </div>
  );
};

export default HeaderMenu;
