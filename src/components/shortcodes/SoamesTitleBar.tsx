import React from "react";

interface SoamesTitleBarProps {
  title: React.ReactNode;
}

const SoamesTitleBar: React.FC<SoamesTitleBarProps> = ({ title }) => {
  return (
    <section className="soames-section soames-title-bar mt-5 mb-3">
      <div className="container">
        <div className="media-container-row">
          <div className="title col-12 col-md-8">
            <h2 className="align-center pb-3 mbr-fonts-style display-2">{title}</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoamesTitleBar;
