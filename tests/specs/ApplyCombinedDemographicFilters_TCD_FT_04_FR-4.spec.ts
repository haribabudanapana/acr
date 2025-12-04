// Playwright test for TCD_FT_04_FR-4: Apply combined filters for Sex at Birth, Age Range, and Race
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
// Hypothetical ExploreDataPage object for Explore Data Page actions
import { ExploreDataPage } from '../../src/pages/explore-data.page';
import { testData } from '../../test-data/Staging/testData.json';

// Test Data: Ensure these fields exist in your testData.json or adapt as needed
const {
  validUser: { username, password },
  demographicFilters: {
    sexAtBirth,
    minAge,
    race
  }
} = testData;

test.describe('TCD_FT_04_FR-4: Apply combined filters for Sex at Birth, Age Range, and Race', () => {
  test('should display data filtered by Male, age 30+, and Black/African American/African', async ({ page }) => {
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const exploreDataPage = new ExploreDataPage(page);

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(username, password);
    await expect(loginPage).not.toHaveLoginError();

    // Step 2: Navigate to Explore Data Page
    await exploreDataPage.goto();
    await expect(exploreDataPage).toBeVisible();

    // Step 3: Apply Sex at Birth filter
    await exploreDataPage.applySexAtBirthFilter(sexAtBirth); // e.g., 'Male'

    // Step 4: Apply Age Range filter (e.g., 30 and above)
    await exploreDataPage.applyAgeRangeFilter(minAge); // e.g., 30

    // Step 5: Apply Race filter
    await exploreDataPage.applyRaceFilter(race); // e.g., 'Black, African American, or African'

    // Step 6: Assert that the demographic data is filtered accordingly
    await exploreDataPage.waitForFiltersToApply();
    const results = await exploreDataPage.getFilteredDemographicResults();
    expect(results).toMatchObject({
      sexAtBirth: sexAtBirth,
      minAge: minAge,
      race: race
    });
    // Optionally, assert that only expected results are shown
    expect(await exploreDataPage.areOnlyExpectedResultsDisplayed({ sexAtBirth, minAge, race })).toBeTruthy();

    // Step 7: Ensure filters remain applied
    expect(await exploreDataPage.areFiltersPersisted({ sexAtBirth, minAge, race })).toBeTruthy();
  });
});
