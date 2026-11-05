/** Ordered learning domains; the order drives filters, lanes and columns. */
export const domains = [
  "Finance",
  "Entrepreneuriat",
  "Intelligence artificielle",
  "Investissement",
] as const;
export type Domain = (typeof domains)[number];
