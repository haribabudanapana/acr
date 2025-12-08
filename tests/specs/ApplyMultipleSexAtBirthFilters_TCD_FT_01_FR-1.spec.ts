import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { ExploreDataPage } from '../../src/pages/explore-data.page';
import { ENV } from '../../src/config/env';
import testDataArray from '../../test-data/Staging/apply-multiple-sex-at-birth-filters-data.json';

// Test Case: TCD_FT_01_FR-1 - Apply multiple Sex at Birth filters

test.describe('Apply multiple Sex at Birth filters - TCD_FT_01_FR-1', () => {
  let loginPage: LoginPage;
  let exploreDataPage: ExploreDataPage;
  
  // Get first test case from array
  const testData = testDataArray[0];
  const sexAtBirthFilters = testData.filters.sexAtBirth;
  const username = ENV.USERNAME;
  const password = ENV.PASSWORD;
  const url = ENV.BASE_URL;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    exploreDataPage = new ExploreDataPage(page);
    // Login and navigate to Explore Data Page
    await loginPage.goto(url);
    await loginPage.login(username, password);
    await exploreDataPage.goto();
    await exploreDataPage.waitForLoad();
  });

  test('should allow user to select and apply Sex at Birth filter', async ({ page }) => {
    // Step 1: Click on Demographics filter
    await exploreDataPage.clickOnFilters("Demographics");

    // Step 2: Apply Sex at Birth filter (e.g., 'Male')
    const sexValue = sexAtBirthFilters[0]; // Get first sex value from test data
    await exploreDataPage.applySexAtBirthFilter(sexValue);

    // Step 3: Click the search button to apply filters
    await exploreDataPage.clickSearch();

    // Step 4: Wait for results to load
    await exploreDataPage.waitForFiltersToApply();

    // Step 5: Verify results are displayed
    const results = await exploreDataPage.getFilteredDemographicResults();
    expect(results).toMatchObject({race: expect.any(String) });
  });
});
