import React from "react";

export interface HeroHeaderProps {
  title: React.ReactNode;
  subhead?: React.ReactNode;
  backgroundImage?: string | null;
  backgroundImageTitle?: string | null;
  overlayOpacity?: number;
}

const HeroHeader = ({
  title,
  subhead,
  backgroundImage,
  backgroundImageTitle,
  overlayOpacity,
}: HeroHeaderProps) => {
  if (!backgroundImage) {
    backgroundImage = "https://picsum.photos/1080/720";
  } else {
    if (backgroundImageTitle?.includes("_03o_")) overlayOpacity = 0.3;
    else if (backgroundImageTitle?.includes("_04o_")) overlayOpacity = 0.4;
    else if (backgroundImageTitle?.includes("_05o_")) overlayOpacity = 0.5;
    else if (backgroundImageTitle?.includes("_06o_")) overlayOpacity = 0.6;
    else if (backgroundImageTitle?.includes("_07o_")) overlayOpacity = 0.7;
  }

  if (!overlayOpacity) {
    overlayOpacity = 0.6;
  }

  const css = `
    .soames-background-lg::after {
      background: url(${backgroundImage});
      background-position: 50% 50%;
      background-size: cover;
      background-repeat: no-repeat;
      position: fixed;
      top: 0px;
      left: 0px;
      overflow: hidden;
      pointer-events: none;
      margin-top: -180px;
    }
  `;

  return (
    <>
      <style>{css}</style>
      <section
        className="soames-header-lg soames-parallax soames-background-lg"
        id="header1"
      >
        <div
          className="soames-overlay"
          style={{ opacity: overlayOpacity, backgroundColor: "rgb(46, 46, 46)" }}
        />
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="soames-hero-header soames-white col-md-10">
              <h1 className="soames-section-title align-center soames-bold mbr-fonts-style display-1">
                {title}
              </h1>
              <div className="soames-section-subtitle align-center soames-light soames-white mbr-fonts-style display-5">
                {subhead}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroHeader;
