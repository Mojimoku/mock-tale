// Fixed flavor tag vocabulary offered in the drink entry form. Includes the
// spec's core list plus every tag used in the seed data, so existing entries
// always render correctly against the picker.
export const FLAVOR_TAGS = [
  "citrus",
  "herbal",
  "smoky",
  "sweet",
  "tart",
  "bitter",
  "floral",
  "fruity",
  "spicy",
  "crisp",
  "malty",
  "light",
  "fresh",
  "fizzy",
] as const;

export type FlavorTag = (typeof FLAVOR_TAGS)[number];
