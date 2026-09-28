import type { ReviewsSectionContent, Testimonial } from "@/types/content";
import { SectionHead } from "@/components/shared/SectionHead";
import { Stars } from "@/components/shared/Stars";
import { initials } from "@/lib/format";

/** "What clients say": rating summary plus a masonry of reviews. */
export function Reviews({ section, testimonials }: { section: ReviewsSectionContent; testimonials: Testimonial[] }) {
  return (
    <section className="section tint" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <SectionHead
          id="reviews-title"
          title={section.title}
          intro={section.intro}
          aside={
            <div className="big-rating">
              <strong>{section.rating}</strong>
              <div>
                <Stars />
                <small>{section.ratingCaption}</small>
              </div>
            </div>
          }
        />
        <div className="masonry" id="masonry">
          {testimonials.map((r) => (
            <figure key={r.name} className={r.featured ? "review feature" : "review"}>
              <Stars label={section.starsAriaLabel} />
              <blockquote>{`“${r.quote}”`}</blockquote>
              <figcaption className="who">
                <span style={{ background: r.color }}>{initials(r.name)}</span>
                <div>
                  <strong>{r.name}</strong>
                  <small>{r.role}</small>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
