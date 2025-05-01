import React from "react";

interface GalleryMenuAttributes {
  images: string[];
  links?: string[];
  labels?: string[];
  css?: string[];
}

interface GalleryMenuItem {
  id: string;
  imageUrl: string;
  label?: string;
  link?: string;
  css?: string;
}

interface SoamesGalleryMenuProps {
  attributes: GalleryMenuAttributes;
}

const SoamesGalleryMenu: React.FC<SoamesGalleryMenuProps> = ({ attributes }) => {
  const { images, links, labels, css } = attributes;

  const menuItems: GalleryMenuItem[] = images.map((image, i) => ({
    id: `icon_${i}`,
    imageUrl: image.replace(/['""]+/g, '"'),
    label: labels?.[i],
    link: links?.[i],
    css: css?.[i],
  }));

  return (
    <section className="features1 soames-gallery-menu">
      <div className="container-fluid">
        <div className="media-container-row">
          {menuItems.map(menuItem => (
            <div key={menuItem.id} className="card p-3 col-md-12 col-lg-3">
              <div className="card-wrapper">
                <div className="card-img">
                  <a href={menuItem.link}>
                    <img
                      src={menuItem.imageUrl}
                      alt={menuItem.label ?? ""}
                      title={menuItem.label ?? ""}
                    />
                  </a>
                </div>
                <div className="card-box">
                  <h4 className="card-title pb-3 mbr-fonts-style display-7">
                    {menuItem.label}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoamesGalleryMenu;
