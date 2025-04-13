import React, { ReactNode } from 'react';
import '../styles/theme.css';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <div className="site-wrapper">
    <header>
      <h1>Soames Gatsby Theme</h1>
    </header>
    <main>{children}</main>
  </div>
);

export default Layout;
