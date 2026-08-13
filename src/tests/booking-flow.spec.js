
import { test, expect } from "@playwright/test";

test("complete movie booking flow", async ({ page }) => {

  // 1. Login page
  await page.goto("http://localhost:5173/login");

  await page.getByPlaceholder("Email").fill("admin@gmail.com");
  await page.getByPlaceholder("Password").fill("123456");

  await page.getByRole("button", { name: /login/i }).click();

  // 2. Login success -> Home
  await page.waitForURL("**/home");

// 3. Check Joker exists
const joker = page
  .getByRole("heading", { name: "Joker", exact: true })
  .first();

await expect(joker).toBeVisible({
  timeout: 10000,
});

// 4. Click Joker
await joker.click();

 
});

