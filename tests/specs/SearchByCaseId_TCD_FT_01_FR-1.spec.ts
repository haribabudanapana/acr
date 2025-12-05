import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { ExploreDataPage } from '../../src/pages/explore-data.page';
import testDataArray from '../../test-data/Staging/search-using-single-valid-case-id-data.json';
import {ENV} from '../../src/config/env.ts';
// Test Case: TCD_FT_01_FR-1 - Search using a single valid Case ID
// Objective: Verify that the system allows searching with a single Case ID and returns the correct results.

test.describe('TCD_FT_01_FR-1: Search using a single valid Case ID', () => {
  let loginPage: LoginPage;
  let exploreDataPage: ExploreDataPage;
  const validCaseId = testDataArray[0].searchInput.caseId; // This could be parameterized from testData if needed
  const url=ENV.BASE_URL; 
  const username=ENV.USERNAME;
  const password=ENV.PASSWORD;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    exploreDataPage = new ExploreDataPage(page);
    // Login using credentials from test data
    await loginPage.goto(url);
    await loginPage.login(username,password);
    // Navigate to Explore Data Page
    await exploreDataPage.goto();
    await expect(exploreDataPage.isLoaded()).resolves.toBeTruthy();
  });

  test('should display correct subjects when searching by a valid Case ID', async ({ page }) => {
    // Enter the Case ID in the search field
    await exploreDataPage.enterCaseId(validCaseId);
    // Click the search button
    await exploreDataPage.clickSearch();
    // Wait for results to load
    await exploreDataPage.waitForResults();
    // Assert that the results contain the expected Case ID
    const results = await exploreDataPage.getResultsCaseIds();
    expect(results).toContain(validCaseId);
    // Optionally, check that the results list is displayed
    expect(await exploreDataPage.isResultsListDisplayed()).toBeTruthy();
  });
});
