// Test Case: TCD_FT_02_FR-2 - Search using a single valid Site ID
// Objective: Verify that the system allows searching with a single Site ID and returns the correct results.

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { EntitlementsPage } from '../../src/pages/entitlements.page';
import { testData } from '../../test-data/Staging/testData.json';

// NOTE: If an ExploreDataPage page object does not exist, it should be created in src/pages/explore-data.page.ts
// For this test, we will assume it exists and exposes the necessary methods.
import { ExploreDataPage } from '../../src/pages/explore-data.page';

// Test Data: Site IDs and user credentials
const validSiteId = testData.singleValidSiteId || 'SITE12345'; // fallback if not present
const username = testData.validUser?.username || 'testuser';
const password = testData.validUser?.password || 'password123';

// Main test
test.describe('TCD_FT_02_FR-2: Search using a single valid Site ID', () => {
  let loginPage: LoginPage;
  let entitlementsPage: EntitlementsPage;
  let exploreDataPage: ExploreDataPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    entitlementsPage = new EntitlementsPage(page);
    exploreDataPage = new ExploreDataPage(page);

    // Login and navigate to Explore Data page
    await loginPage.goto();
    await loginPage.login(username, password);
    // Optionally, handle entitlements if required
    await entitlementsPage.handleEntitlementsIfPresent();
    await exploreDataPage.goto();
  });

  test('should allow searching with a single valid Site ID and display correct results', async ({ page }) => {
    // Step 1: Enter the single valid Site ID in the search field
    await exploreDataPage.enterSiteId(validSiteId);

    // Step 2: Initiate the search
    await exploreDataPage.clickSearchButton();

    // Step 3: Wait for search results to load
    await exploreDataPage.waitForSearchResults();

    // Step 4: Assert that results are displayed and correspond to the Site ID
    const results = await exploreDataPage.getSearchResults();
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.siteId).toBe(validSiteId);
    }

    // Step 5: Optionally, verify that user can analyze the data (e.g., charts, tables are visible)
    await expect(await exploreDataPage.isDataAnalysisSectionVisible()).toBeTruthy();
  });
});
