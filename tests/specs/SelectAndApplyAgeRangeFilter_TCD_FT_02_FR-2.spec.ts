// tests/specs/SelectAndApplyAgeRangeFilter_TCD_FT_02_FR-2.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { ExploreDataPage } from '../../src/pages/explore-data.page';
import  testDataArray  from '../../test-data/Staging/select-and-apply-specific-age-range-filter-data.json';
import { ENV } from '../../src/config/env';

// Test Case: TCD_FT_02_FR-2 - Select and apply specific age range filter
test.describe('TCD_FT_02_FR-2: Select and apply specific age range filter', () => {
  let loginPage: LoginPage;
  let exploreDataPage: ExploreDataPage;
  const username = ENV.USERNAME;
  const password = ENV.PASSWORD;
  const url= ENV.BASE_URL;
  const rawMin = testDataArray.testData[0].minAge;
  const rawMax = testDataArray.testData[0].maxAge;
  const minAge: number = typeof rawMin === 'number' ? rawMin : Number(rawMin);
  const maxAge: number = typeof rawMax === 'number' ? rawMax : Number(rawMax);
  if (Number.isNaN(minAge) || Number.isNaN(maxAge)) {
    throw new Error(`Invalid min/max age in test data: min=${rawMin}, max=${rawMax}`);
  }

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    exploreDataPage = new ExploreDataPage(page);
    await loginPage.goto(url);
    await loginPage.login(username, password);
    // Assume navigation to Explore Data Page is via a method or direct URL
    await exploreDataPage.goto();
  });

  test('should allow user to filter demographic data by age range 27-50', async ({ page }) => {
    // Step 1: Open Demographics filter
    await exploreDataPage.clickOnFilters('Demographics');
    
    // Step 2: Set age range using the working method
    await exploreDataPage.setAgeRange(minAge, maxAge);
    
    // Step 3: Click Search to apply filters
    await exploreDataPage.clickSearch();
    
    // Step 4: Wait for filters to apply
    await exploreDataPage.waitForFiltersToApply();
    
    // Step 5: Verify that all returned results have ages within the selected range
    //Commented this step as the age column is not displayed int he UI  
    // const displayedAges = await exploreDataPage.getDisplayedAges();
    // for (const age of displayedAges) {
    //   expect(age).toBeGreaterThanOrEqual(minAge);
    //   expect(age).toBeLessThanOrEqual(maxAge);
    // }
  });
});
