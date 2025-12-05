// tests/specs/SelectAndApplyAgeRangeFilter_TCD_FT_02_FR-2.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { ExploreDataPage } from '../../src/pages/explore-data.page';
import { testData } from '../../test-data/Staging/testData.json';

// Test Case: TCD_FT_02_FR-2 - Select and apply specific age range filter
test.describe('TCD_FT_02_FR-2: Select and apply specific age range filter', () => {
  let loginPage: LoginPage;
  let exploreDataPage: ExploreDataPage;
  const username = testData.validUser.username;
  const password = testData.validUser.password;
  const minAge = 27;
  const maxAge = 50;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    exploreDataPage = new ExploreDataPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);
    // Assume navigation to Explore Data Page is via a method or direct URL
    await exploreDataPage.goto();
  });

  test('should allow user to filter demographic data by age range 27-50', async ({ page }) => {
    await exploreDataPage.openAgeRangeFilter();
    await exploreDataPage.setAgeRange(minAge, maxAge);
    await exploreDataPage.applyAgeRangeFilter();

    // Wait for demographic data to update
    await page.waitForTimeout(1000); // Replace with better wait if possible

    const ages = await exploreDataPage.getDisplayedAges();
    expect(ages.length).toBeGreaterThan(0);
    for (const age of ages) {
      expect(age).toBeGreaterThanOrEqual(minAge);
      expect(age).toBeLessThanOrEqual(maxAge);
    }

    // Verify filter remains sticky
    const isSticky = await exploreDataPage.isAgeRangeFilterSticky(minAge, maxAge);
    expect(isSticky).toBeTruthy();
  });
});
