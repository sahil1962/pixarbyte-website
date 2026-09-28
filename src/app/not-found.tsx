import Link from "next/link";
import { getNotFound } from "@/lib/content";

export default async function NotFound() {
  const content = await getNotFound();
  return (
    <section className="section" aria-labelledby="nf-title">
      <div className="container">
        <div className="sec-head">
          <h2 id="nf-title">{content.title}</h2>
          <p>{content.text}</p>
        </div>
        <Link className="btn btn-primary btn-lg" href="/">
          {content.cta}
        </Link>
      </div>
    </section>
  );
}
