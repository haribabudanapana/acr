import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { ExploreDataPage } from '../../src/pages/explore-data.page';
import { testData } from '../../test-data/Staging/testData.json';

// Test Case: TCD_FT_01_FR-1 - Apply multiple Sex at Birth filters

test.describe('Apply multiple Sex at Birth filters - TCD_FT_01_FR-1', () => {
  let loginPage: LoginPage;
  let exploreDataPage: ExploreDataPage;
  const { username, password } = testData.validUser; // Ensure validUser exists in testData.json

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    exploreDataPage = new ExploreDataPage(page);
    // Login and navigate to Explore Data Page
    await loginPage.goto();
    await loginPage.login(username, password);
    await exploreDataPage.goto();
    await exploreDataPage.waitForLoad();
  });

  test('should allow user to select and apply multiple Sex at Birth filters', async ({ page }) => {
    // Step 1: Open the Sex at Birth filter dropdown
    await exploreDataPage.openSexAtBirthFilter();

    // Step 2: Select 'Male' and 'Female' options
    await exploreDataPage.selectSexAtBirthOption('Male');
    await exploreDataPage.selectSexAtBirthOption('Female');

    // Step 3: Apply the filter
    await exploreDataPage.applySexAtBirthFilter();

    // Step 4: Wait for the demographic data to update
    await exploreDataPage.waitForDemographicDataUpdate();

    // Step 5: Assert that demographic data is filtered by both 'Male' and 'Female'
    const filteredData = await exploreDataPage.getDemographicData();
    expect(filteredData).toMatchObject({
      sexAtBirth: expect.arrayContaining(['Male', 'Female'])
    });

    // Step 6: Assert that filters remain applied
    const appliedFilters = await exploreDataPage.getAppliedSexAtBirthFilters();
    expect(appliedFilters).toEqual(expect.arrayContaining(['Male', 'Female']));
  });
});
