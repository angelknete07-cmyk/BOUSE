import { test, expect, type Page, type BrowserContext } from "@playwright/test";

// Browser integration uses the actual SDK + UI, with an intercepted transport.
// Live RLS/API tests are separate (docs/ACCOUNT-VALIDATION.md).
test.skip(
  !process.env.BOUSE_ACCOUNT_TESTS,
  "Dedicated account transport configuration required",
);
const origin = "https://bouse-test.invalid";
const a = "11111111-1111-4111-8111-111111111111";
const b = "22222222-2222-4222-8222-222222222222";
const key = (id: string) => `bouse.academy.v1:user:${id}`;
const profile = (name: string) => ({
  name,
  level: "Débutant++",
  goal: "Comprendre et piloter un business",
  interests: ["Finance"],
  minutes: 20,
  preference: "Exemples puis pratique",
  diagnostic: { finance: 0 },
});
const saved = (name: string) => ({
  schemaVersion: 1,
  profile: profile(name),
  notes: {},
  attempts: [],
  projects: [],
  lastLessonId: null,
});
const token = (id: string) =>
  [
    "eyJhbGciOiJIUzI1NiJ9",
    Buffer.from(
      JSON.stringify({
        sub: id,
        role: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString("base64url"),
    "test",
  ].join(".");
const session = (id: string) => ({
  access_token: token(id),
  refresh_token: "test-refresh",
  token_type: "bearer",
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  user: {
    id,
    email: `${id === a ? "a" : "b"}@example.invalid`,
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
  },
});
type Row = {
  user_id: string;
  state: ReturnType<typeof saved>;
  revision: number;
  updated_at: string;
};
async function transport(context: BrowserContext, rows: Map<string, Row>) {
  await context.route(`${origin}/**`, async (route) => {
    const r = route.request();
    const url = new URL(r.url());
    if (url.pathname === "/auth/v1/logout")
      return route.fulfill({ status: 204 });
    if (url.pathname === "/auth/v1/user") {
      const id = r.headers().authorization?.includes(token(a)) ? a : b;
      return route.fulfill({ json: session(id).user });
    }
    if (url.pathname !== "/rest/v1/learning_states")
      return route.fulfill({
        status: 400,
        json: { message: "Unexpected endpoint" },
      });
    const id =
      url.searchParams.get("user_id")?.replace("eq.", "") ??
      r.postDataJSON()?.user_id;
    const current = rows.get(id);
    if (r.method() === "GET") return route.fulfill({ json: current ?? null });
    if (
      r.method() === "PATCH" &&
      String(current?.revision) !==
        url.searchParams.get("revision")?.replace("eq.", "")
    )
      return route.fulfill({ json: [] });
    if (r.method() === "POST" && current)
      return route.fulfill({ status: 409, json: { code: "23505" } });
    const row = {
      user_id: id,
      state: r.postDataJSON().state,
      revision: (current?.revision ?? 0) + 1,
      updated_at: new Date().toISOString(),
    };
    rows.set(id, row);
    return route.fulfill({ json: [row] });
  });
}
async function seed(context: BrowserContext, id: string) {
  await context.addInitScript(
    ({ value }) => {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem("sb-bouse-test-auth-token", JSON.stringify(value));
        sessionStorage.setItem("seeded", "yes");
      }
    },
    { value: session(id) },
  );
}
async function changeAccount(page: Page, id: string) {
  await page.evaluate(
    (value) =>
      localStorage.setItem("sb-bouse-test-auth-token", JSON.stringify(value)),
    session(id),
  );
  await page.reload();
}
test("A/B/C: independent accounts, second device, same-browser switch and sign-out", async ({
  browser,
}) => {
  const rows = new Map<string, Row>();
  for (const [id, name] of [
    [a, "Compte Alpha"],
    [b, "Compte Bravo"],
  ])
    rows.set(id, {
      user_id: id,
      state: saved(name),
      revision: 1,
      updated_at: new Date().toISOString(),
    });
  const one = await browser.newContext();
  const two = await browser.newContext();
  await transport(one, rows);
  await transport(two, rows);
  await seed(one, a);
  await seed(two, a);
  const p = await one.newPage();
  const q = await two.newPage();
  await p.goto("/#settings");
  await q.goto("/#settings");
  await expect(p.getByLabel("Prénom ou pseudo")).toHaveValue("Compte Alpha");
  await p.getByLabel("Prénom ou pseudo").fill("Alpha modifié");
  await expect
    .poll(() => rows.get(a)?.state.profile.name)
    .toBe("Alpha modifié");
  await q.getByRole("button", { name: "Synchroniser maintenant" }).click();
  await expect(q.getByLabel("Prénom ou pseudo")).toHaveValue("Alpha modifié");
  await changeAccount(p, b);
  await expect(p.getByLabel("Prénom ou pseudo")).toHaveValue("Compte Bravo");
  await expect(p.locator("body")).not.toContainText("Alpha modifié");
  await p.getByLabel("Prénom ou pseudo").fill("Bravo modifié");
  await expect
    .poll(() => rows.get(b)?.state.profile.name)
    .toBe("Bravo modifié");
  expect(rows.get(a)?.state.profile.name).toBe("Alpha modifié");
  await p.getByRole("button", { name: "Se déconnecter", exact: true }).click();
  await expect(
    p.getByRole("heading", { name: "Faisons connaissance." }),
  ).toBeVisible();
  await expect(p.locator("body")).not.toContainText("Bravo modifié");
  expect(
    await p.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).profile.name,
      key(a),
    ),
  ).toBe("Alpha modifié");
  await one.close();
  await two.close();
});
test("D/E: offline local edit, reload with save, reconnect; no old version overwrite", async ({
  browser,
}) => {
  const rows = new Map<string, Row>([
    [
      a,
      {
        user_id: a,
        state: saved("Alpha"),
        revision: 1,
        updated_at: new Date().toISOString(),
      },
    ],
  ]);
  const context = await browser.newContext();
  await transport(context, rows);
  await seed(context, a);
  const p = await context.newPage();
  await p.goto("/#settings");
  await expect(p.getByLabel("Prénom ou pseudo")).toHaveValue("Alpha");
  await context.setOffline(true);
  await p.getByLabel("Prénom ou pseudo").fill("Travail hors ligne");
  await expect(p.getByText("Hors connexion", { exact: true })).toBeVisible();
  expect(
    await p.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).profile.name,
      key(a),
    ),
  ).toBe("Travail hors ligne");
  await context.setOffline(false);
  await p.getByRole("button", { name: "Synchroniser maintenant" }).click();
  await expect
    .poll(() => rows.get(a)?.state.profile.name)
    .toBe("Travail hors ligne");
  await p.reload();
  await expect(p.getByLabel("Prénom ou pseudo")).toHaveValue(
    "Travail hors ligne",
  );
  await context.close();
});
