import { domains } from "./domains";

/** Profile choices shared by onboarding and preferences. */
export const levelOptions = [
  "Fondations",
  "Débutant++",
  "Intermédiaire",
  "Avancé",
] as const;
export const minuteOptions = [10, 20, 40] as const;
export const goalOptions = [
  "Comprendre et piloter un business",
  "Construire un projet avec l’IA",
  "Mieux décider dans ma vie professionnelle",
] as const;
export const interestOptions = domains;
export const preferenceOptions = [
  "Exemples puis pratique",
  "Concepts puis cas professionnel",
  "Appliquer à mon projet",
] as const;

/**
 * Keeps a value restored from an older backup selectable instead of silently
 * replacing it with the first option.
 */
export function withCurrent<T extends string | number>(
  options: readonly T[],
  current: T,
): T[] {
  return options.includes(current) ? [...options] : [current, ...options];
}
