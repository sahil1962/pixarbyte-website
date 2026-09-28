import type { Metadata } from "next";

export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: image ? [image] : undefined },
    twitter: { title, description, images: image ? [image] : undefined },
  };
}
