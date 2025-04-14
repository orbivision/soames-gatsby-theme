import React from "react";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";

interface HeaderProps {
  title: string;
  isHomePage: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, isHomePage }) => {
  return (
    <section className="menu soames-menu">
      <nav className="navbar navbar-expand beta-menu navbar-dropdown align-items-center navbar-fixed-top navbar-toggleable-sm">
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <Logo title={title} />
        <HeaderMenu />
      </nav>
    </section>
  );
};

export default Header;
