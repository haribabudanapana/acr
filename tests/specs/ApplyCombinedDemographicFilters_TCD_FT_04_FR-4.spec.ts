// Playwright test for TCD_FT_04_FR-4: Apply combined filters for Sex at Birth, Age Range, and Race
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
// Hypothetical ExploreDataPage object for Explore Data Page actions
import { ExploreDataPage } from '../../src/pages/explore-data.page';
import { ENV } from '../../src/config/env';
import testData from '../../test-data/Staging/apply-combined-filters-sex-age-race-data.json';

// Test Data - Read from JSON and ENV
const sexAtBirth = testData.filters.sexAtBirth[0].value; // 'Male'
const minAge = testData.filters.ageRange[0].min; // 30
const race = testData.filters.race[0].value; // 'Black, African American, or African'
const username = ENV.USERNAME;
const password = ENV.PASSWORD;
const url= ENV.BASE_URL;

test.describe('TCD_FT_04_FR-4: Apply combined filters for Sex at Birth, Age Range, and Race', () => {
  test('should display data filtered by Male, age 30+, and Black/African American/African', async ({ page }) => {
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const exploreDataPage = new ExploreDataPage(page);

    // Step 1: Login
    await loginPage.goto(url);
    await loginPage.login(username, password);

    // Step 2: Navigate to Explore Data Page
    await exploreDataPage.goto();
    await exploreDataPage.toBeVisible();

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
