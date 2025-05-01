import React from "react";

interface IconListAttributes {
  images: string[];
  links?: string[];
  labels?: string[];
  css?: string[];
}

interface Icon {
  id: string;
  imageUrl: string;
  label?: string | null;
  link?: string | null;
  css?: string | null;
}

const SoamesIconList: React.FC<{ attributes: IconListAttributes }> = ({ attributes }) => {
  const { images, links, labels, css } = attributes;

  const icons: Icon[] = images.map((image, i) => ({
    id: `icon_${i}`,
    imageUrl: image.replace(/['""]+/g, '"'),
    label: labels?.[i] ?? null,
    link: links?.[i] ?? null,
    css: css?.[i] ?? null,
  }));

  return (
    <section className="soames-section">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center">
          {icons.map((icon) => (
            <a
              key={icon.id}
              className={`d-flex flex-column align-items-center text-decoration-none p-2 ${icon.css ?? ''}`}
              href={icon.link ?? "#"}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="d-block mb-2"
                src={icon.imageUrl}
                alt={icon.label ?? ""}
                height="116"
                loading="lazy"
              />
              <span className="text-muted">{icon.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoamesIconList;
