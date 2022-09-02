import { test, expect } from '@playwright/test'

test('index page has solid-start-enhanced-form in title', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  await expect(page).toHaveTitle(/solid-start-enhanced-form/)
})
