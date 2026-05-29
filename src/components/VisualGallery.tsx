import { GovImage } from "@/components/GovImage";
import { GALLERY_PHOTOS } from "@/lib/site-media";

export function VisualGallery() {
  return (
    <section className="visual-gallery" aria-label="Фото и инфографика">
      <div className="visual-gallery__head">
        <h2>Финансовый рынок в фактах и кадрах</h2>
      </div>
      <div className="visual-gallery__grid">
        {GALLERY_PHOTOS.map((photo, i) => (
          <figure key={i} className="visual-gallery__item">
            <GovImage src={photo.src} alt={photo.alt} className="visual-gallery__img" />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
