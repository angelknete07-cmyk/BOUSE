/**
 * V4 — essais de direction artistique (jalons B et C).
 *
 * Les variantes ne sont jamais actives par défaut : elles ne s'appliquent que
 * si l'adresse les demande, par exemple `/?da=b#home` ou
 * `/?palette=apaisee&type=affine#lab`. Cela permet de comparer sur le vrai
 * produit sans toucher à ce que voient les autres visiteurs.
 */
export const designPreviewOptions = {
  palette: ["apaisee"],
  type: ["manrope", "affine"],
  da: ["a", "b", "c"],
} as const;

export type DesignPreviewKey = keyof typeof designPreviewOptions;

export function readDesignPreview(search: string) {
  const params = new URLSearchParams(search);
  const chosen: Partial<Record<DesignPreviewKey, string>> = {};
  for (const key of Object.keys(designPreviewOptions) as DesignPreviewKey[]) {
    const value = params.get(key);
    if (
      value &&
      (designPreviewOptions[key] as readonly string[]).includes(value)
    )
      chosen[key] = value;
  }
  return chosen;
}

export function applyDesignPreview(search: string, root: HTMLElement) {
  const chosen = readDesignPreview(search);
  for (const [key, value] of Object.entries(chosen)) root.dataset[key] = value;
  return chosen;
}
