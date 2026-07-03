// Playwright config for the a11y harness. Serves the static root and runs tests/a11y/.
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/a11y',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    // Deterministic scans: the site disables reveal/marquee animation under
    // reduced motion, so elements are never sampled mid-transition.
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
