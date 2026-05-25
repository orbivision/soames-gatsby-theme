import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import Seo from "../components/Seo";

const NotFoundPage: React.FC = () => (
  <Layout>
    <Seo title="404: Page Not Found" />
    <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <h1>Page Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <p>
        <Link to="/">Go home</Link> or <Link to="/blog">browse the blog</Link>.
      </p>
    </section>
  </Layout>
);

export default NotFoundPage;
