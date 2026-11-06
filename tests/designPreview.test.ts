import test from "node:test";
import assert from "node:assert/strict";
import {
  readDesignPreview,
  resolveDesignPreview,
} from "../src/lib/designPreview.ts";

test("sans paramètre, aucun essai de direction artistique n'est actif", () => {
  assert.deepEqual(readDesignPreview(""), {});
  assert.deepEqual(readDesignPreview("?utm=1"), {});
});

test("les essais connus sont lus depuis l'adresse", () => {
  assert.deepEqual(readDesignPreview("?da=b&palette=apaisee&type=affine"), {
    da: "b",
    palette: "apaisee",
    type: "affine",
  });
});

test("une valeur inconnue est ignorée", () => {
  assert.deepEqual(readDesignPreview("?da=z&palette=neon&type=comic"), {});
});

test("une variante d'accueil prend le système recommandé, sauf choix explicite", () => {
  assert.deepEqual(resolveDesignPreview("?da=a"), {
    da: "a",
    palette: "apaisee",
    type: "affine",
  });
  assert.deepEqual(resolveDesignPreview("?da=c&type=manrope"), {
    da: "c",
    palette: "apaisee",
    type: "manrope",
  });
  assert.deepEqual(resolveDesignPreview("?palette=apaisee"), {
    palette: "apaisee",
  });
});
