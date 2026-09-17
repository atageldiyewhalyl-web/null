import type { OptionDef } from "./types";

export const OTHER_LABEL = "Andere";

const slugify = (label: string) =>
  label
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Builds options from labels. "Andere" automatically reveals a free-text field. */
export function options(...labels: string[]): OptionDef[] {
  return labels.map((label) => ({
    value: label === OTHER_LABEL ? "andere" : slugify(label),
    label,
    ...(label === OTHER_LABEL ? { other: true } : {}),
  }));
}
