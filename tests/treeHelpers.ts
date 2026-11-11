import { expect, type Page } from "@playwright/test";

/** Ouvre le grand arbre des compétences. */
export async function openTree(page: Page) {
  await page
    .getByRole("button", { name: "Agrandir l’arbre", exact: true })
    .click();
  const tree = page.getByRole("dialog", { name: "L’arbre de tes compétences" });
  await expect(tree).toBeVisible();
  return tree;
}

/** Ferme le grand arbre ; le clavier revient sur « Agrandir l’arbre ». */
export async function closeTree(page: Page) {
  await page
    .getByRole("button", { name: "Fermer l’arbre", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

/** Choisit une leçon dans l'arbre, puis le referme : la fiche de la page la montre. */
export async function pickInTree(page: Page, name: RegExp) {
  const tree = await openTree(page);
  await clickInTree(page, name);
  await expect(
    tree.getByRole("complementary", { name: "La leçon choisie" }),
  ).toBeVisible();
  await closeTree(page);
}

/**
 * Touche une leçon de l'arbre. Elle peut être hors de l'écran : le focus la
 * fait venir au milieu (comme au clavier), puis on clique.
 */
export async function clickInTree(page: Page, name: RegExp) {
  const node = page
    .getByRole("dialog", { name: "L’arbre de tes compétences" })
    .getByRole("button", { name });
  await node.focus();
  await node.click();
}
