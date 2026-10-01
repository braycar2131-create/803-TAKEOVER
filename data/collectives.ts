export type Collective = {
  slug: string;
  name: string;
  productTag: string;
  eyebrow: string;
  description: string;
  statementEyebrow: string;
  statementTitle: string;
  statement: string;
};

export const collectives: Collective[] = [
  {
    slug: "long-live-felix",
    name: "LONG LIVE FELIX COLLECTIVE",
    productTag: "LONG LIVE FELIX COLLECTIVE",
    eyebrow: "803 TAKEOVER MEMORIAL SERIES",
    description:
      "A limited memorial collective built around legacy, loyalty, and the movement.",
    statementEyebrow: "LONG LIVE FELIX",
    statementTitle: "LEGACY NEVER FADES",
    statement:
      "Every piece carries the energy of the city, the weight of the story, and a legacy that will never be forgotten.",
  },
];

export function getCollectiveBySlug(slug: string) {
  return collectives.find(
    (collective) => collective.slug === slug
  );
}