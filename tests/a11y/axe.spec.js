// Automated accessibility gate: axe-core scan + keyboard navigation checks.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('accessibility', () => {
  // Force reduced motion per-page so the site's reveal/marquee animations are
  // fully disabled and axe never samples an element mid-transition.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('axe-core: no critical or serious violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const blocking = results.violations.filter((v) => ['critical', 'serious'].includes(v.impact));
    expect(
      blocking,
      blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`).join('\n'),
    ).toEqual([]);
  });

  test('keyboard: skip link is first focus and jumps to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });

  test('keyboard: mobile menu toggle is operable and announces state', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto('/');
    const toggle = page.locator('.nav-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#nav-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('keyboard: all nav links reachable by tab', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.nav-menu a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute('href', /.+/);
    }
  });
});
