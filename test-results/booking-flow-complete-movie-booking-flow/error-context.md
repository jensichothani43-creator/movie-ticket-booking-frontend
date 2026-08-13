# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-flow.spec.js >> complete movie booking flow
- Location: src/tests/booking-flow.spec.js:4:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/home" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e6]:
  - paragraph [ref=e7]: Sign in to continue
  - generic [ref=e8]:
    - textbox "Email" [ref=e9]: admin@gmail.com
    - textbox "Password" [ref=e10]: "123456"
    - button "Login" [ref=e11] [cursor=pointer]
  - paragraph [ref=e12]: Login Failed
  - paragraph [ref=e13]:
    - text: Don't have an account?
    - link "Sign up" [ref=e14] [cursor=pointer]:
      - /url: /register
```

# Test source

```ts
  1  | 
  2  | import { test, expect } from "@playwright/test";
  3  | 
  4  | test("complete movie booking flow", async ({ page }) => {
  5  | 
  6  |   // 1. Login page
  7  |   await page.goto("http://localhost:5173/login");
  8  | 
  9  |   await page.getByPlaceholder("Email").fill("admin@gmail.com");
  10 |   await page.getByPlaceholder("Password").fill("123456");
  11 | 
  12 |   await page.getByRole("button", { name: /login/i }).click();
  13 | 
  14 |   // 2. Login success -> Home
> 15 |   await page.waitForURL("**/home");
     |              ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  16 | 
  17 | // 3. Check Joker exists
  18 | const joker = page
  19 |   .getByRole("heading", { name: "Joker", exact: true })
  20 |   .first();
  21 | 
  22 | await expect(joker).toBeVisible({
  23 |   timeout: 10000,
  24 | });
  25 | 
  26 | // 4. Click Joker
  27 | await joker.click();
  28 | 
  29 |  
  30 | });
  31 | 
  32 | 
```