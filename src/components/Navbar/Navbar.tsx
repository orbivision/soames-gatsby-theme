import React, { useEffect, useRef } from "react";
import { Link } from "gatsby";
import useNavbarBehavior from "./useNavbarBehavior";
import Dropdown from "./Dropdown/Dropdown";

import "../../css/theme.css"; // Adjust path based on your setup

const Navbar: React.FC = () => {
  const navbarRef = useRef<HTMLElement | null>(null);
  
  useNavbarBehavior(navbarRef);

  useEffect(() => {
    // If you need to run any DOM logic for navbar dropdowns on mount,
    // this is the place to initialize or cleanup.
  }, []);

  return (
    <nav className="navbar navbar-expand-md navbar-dropdown navbar-fixed-top transparent">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Soames Theme
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Dropdown label="Services">
                <Link className="dropdown-item" to="/design">
                  Design
                </Link>
                <Link className="dropdown-item" to="/development">
                  Development
                </Link>
              </Dropdown>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
