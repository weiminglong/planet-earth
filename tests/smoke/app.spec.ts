import { expect, test } from "@playwright/test";

test("homepage loads and links into the flora index", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Explore flora on a real Earth, not an abstract sphere.",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Open full flora index" }).click();

  await expect(
    page.getByRole("heading", {
      name: "An editorial index of the first living flora stories.",
    }),
  ).toBeVisible();
});

test("flora detail pages render seeded content", async ({ page }) => {
  await page.goto("/flora/prunus-serrulata");

  await expect(
    page.getByRole("heading", { name: "Cherry Blossom" }),
  ).toBeVisible();
  await expect(
    page.getByText("Prunus serrulata", { exact: true }),
  ).toBeVisible();
});

test("region detail pages render seeded content", async ({ page }) => {
  await page.goto("/regions/japan");

  await expect(
    page.getByRole("heading", { name: "Japan", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Botanical stories rooted in Japan",
    }),
  ).toBeVisible();
});
