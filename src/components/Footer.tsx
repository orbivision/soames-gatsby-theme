import React from "react";
import parse from "html-react-parser";
import { graphql, useStaticQuery } from "gatsby";
import FooterMenu from "./FooterMenu";

interface FooterProps {
  title: string;
}

const Footer: React.FC<FooterProps> = ({ title }) => {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      soamesSettings {
        contactBlurb
      }
    }
  `);

  const contactBlurb = data.soamesSettings?.contactBlurb ?? null;

  return (
    <section className="soames-footer mt-5">
      <div className="container">
        <div className="media-container-row content text-white">
          <div className="col-12 col-md-2">
            <div className="media-wrap">{` `}</div>
          </div>
          <div className="col-12 col-md-4 mbr-fonts-style display-7">
            <h5 className="pb-3">Links</h5>
            <FooterMenu />
          </div>
          <div className="col-12 col-md-4 mbr-fonts-style display-7">
            {contactBlurb && (
              <>
                <h5 className="pb-3">Contact</h5>
                <div className="soames-text pr-3">
                  {parse(contactBlurb)}
                </div>
              </>
            )}
            <p className="soames-text pt-3">
              © {new Date().getFullYear()} {title}
              <br />
              Built with{" "}
              <a href="https://www.soames.app" target="_blank" rel="noreferrer">
                Soames
              </a>
              ,{" "}
              <a href="https://www.gatsbyjs.com" target="_blank" rel="noreferrer">
                Gatsby
              </a>
              , and{" "}
              <a href="https://wordpress.org/" target="_blank" rel="noreferrer">
                WordPress
              </a>
            </p>
          </div>
          <div className="col-12 col-md-2 mbr-fonts-style display-7">
            <h5 className="pb-3">{` `}</h5>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
