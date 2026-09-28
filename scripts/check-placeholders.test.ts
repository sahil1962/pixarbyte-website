/**
 * Launch check: fails while any [placeholder] text remains in the About and team data.
 * Run with `npm run check:placeholders`. It's kept out of `npm test` on purpose, because the
 * placeholders are expected until real names, photos and dates are supplied.
 */
import { expect, it } from "vitest";
import { aboutContent, certifications } from "@/data/about";
import { team } from "@/data/team";
import { findPlaceholders } from "@/lib/placeholders";

it("has no [placeholder] text left in About or team content", () => {
  const found = findPlaceholders({ aboutContent, certifications, team });
  expect(found.map((f) => `${f.path}: ${f.text}`)).toEqual([]);
});
